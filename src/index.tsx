import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App/App';

const root = document.getElementById('root');

if (root) {
    const appJsx = (
        <App />
    );

    ReactDOM.render(appJsx, root);
}