import { client as WebSocketClient } from 'websocket';
import 'isomorphic-fetch';

interface SearchEventsRecord {
    type: string,
    url: string,
}

interface EventRecord {
    eventId: string,
    type: string,
}

const getEventsFrom = async ({type, url}: SearchEventsRecord): Promise<Array<EventRecord>> => {
    const data = await fetch(url);
    const response = await data.json();

    const out: Array<string> = response.events.map((item: {id: string}) => item.id);
    return out.map((eventId: string) => ({ eventId, type }));
};

const getEvents = async () => {
    const request: Array<SearchEventsRecord> = [{
        type: 'football',
        url: 'https://starsports.bet/api/events/search?market.display=true&market.main=yes&perPage=10000&sort=-competition.displayOrder&sort=competition.name&sort=timeSettings.startTime&sport=football&state=open'
    }, {
        type: 'tennis',
        url: 'https://starsports.bet/api/events/search?market.display=true&market.main=yes&perPage=10000&sort=-competition.displayOrder&sort=competition.name&sort=timeSettings.startTime&sport=tennis&state=open'
    }, {
        type: 'basketball',
        url: 'https://starsports.bet/api/events/search?market.display=true&market.main=yes&perPage=200&sort=-competition.displayOrder&sort=competition.name&sort=timeSettings.startTime&sport=basketball&state=open'
    }, {
        type: 'baseball',
        url: 'https://starsports.bet/api/events/search?market.display=true&market.main=yes&perPage=200&sort=-competition.displayOrder&sort=competition.name&sort=timeSettings.startTime&sport=baseball&state=open'
    }];

    const allResponse = await Promise.all(request.map(getEventsFrom));

    const out: Array<EventRecord> = [];

    return out.concat(...allResponse);
};

var client = new WebSocketClient();

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});
 
client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');

    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });

    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");

            //TODO - trzeba połączyć event z typem wydarzenia

        } else {
            console.error('Coś innego');
        }
    });
    
    connection.send('420["auth","eyJhbGciOiJIUzI1NiJ9.eyJzdCI6ImFub255bW91cyIsInN1YiI6IiIsImlwIjoiMzUuMTg5LjI0Ny4yMDgiLCJpc3MiOiJncHAiLCJzaWQiOiI1ODk3MzhlZS1kMzA2LTExZTgtYWMwZS01MGVjYjU3ZjUxMDEiLCJzYyI6IlVTIiwidW5pIjoic3RhciIsIm9wdCI6NiwibmJmIjoxNTM5ODg4NDg0LCJybHMiOiIiLCJzbiI6ImFub255bW91cyIsImV4cCI6MTUzOTg4OTM4NCwiaWF0IjoxNTM5ODg4NDg0LCJqdGkiOiIzN2Q4YTliNy1kZWE0LTRkNjktODQwYy03YmRkZThlYTRkMWEifQ.9tCA5tQJLMAzBuMLbYZXcL9g9g469DVyhQ7lVO1S9Hs"]');

    //connection.send('42["subscribe","*:Event:179136"]');

                            //keep alive
    setInterval(() => {
        connection.send('2');
    }, 20000);

    const addRecord: Map<string, string> = new Map();

    const getEventsAndSubscribe = () => {
        console.info('Fetching events ...');
        getEvents().then((list) => {
            console.info(`Fetching events -> ${list.length}`);

            for (const { eventId, type } of list) {
                if (addRecord.has(eventId) === false) {
                    addRecord.set(eventId, type);
                    console.info(`Subscribe ${eventId}`);
                    connection.send(`42["subscribe","*:Event:${eventId}"]`);
                }
            }
        }).catch((err) => {
            console.error(err);
        });
    };

    getEventsAndSubscribe();

    setInterval(() => {
        getEventsAndSubscribe();
    }, 30000);
});
 
client.connect('wss://push.sherbetcloud.com:7443/socket.io/?EIO=3&transport=websocket');