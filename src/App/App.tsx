import * as React from 'react';
import { input, group } from '../Form';
import { observer } from 'mobx-react';
import { InputView } from './InputView';
import { GroupView } from './GroupView';
import { validateRange, validateNotEmpty, convertToNumber } from '../Form/validators';
import { SelectView, OptionType } from './SelectView';
import { CheckboxView } from './CheckboxView';
import { RadioBoxView } from './RadioBoxView';
import styled from 'react-emotion';

const Label = styled('label')`
    cursor: pointer;
`;

const validateDay = validateRange(1, 31, 'Niepoprawny dzień');
const validateMonth = validateRange(1, 12, 'Niepoprawny miesiąc');
const validateYear = validateRange(1970, 2050, 'Niepoprawny rok');

interface FromToType {
    from: number,
    to: number,
}

const acceptRange = (maxDelta: number) => (value: FromToType): FromToType | Error => {
    const delta = Math.abs(value.to - value.from);
    return delta > maxDelta ? new Error('Zbyt dua odległośc pomiędzy oboma liczbami') : value;
}

const input1 = input('');
const field1 = input1
    .map(validateNotEmpty)
    .map(convertToNumber)
    .map(validateDay);

const input2 = input('');
const field2 = input2
    .map(validateNotEmpty)
    .map(convertToNumber)
    .map(validateMonth);

const input3 = input('');
const field3 = input3
    .map(validateNotEmpty)
    .map(convertToNumber)
    .map(validateYear);

const date1 = group({
    day: field1,
    month: field2,
    year: field3
});

const input4 = input('');
const field4 = input4
    .map(validateNotEmpty)
    .map(convertToNumber);

const input5 = input('');
const field5 = input5
    .map(validateNotEmpty)
    .map(convertToNumber);

const range = group({
        from: field4,
        to: field5
    })
    .map(acceptRange(10))
    .map((value): string | Error => `${value.from}-${value.to}`)
;

type SelectType = 'a' | 'b' | 'c' | true;

const select = input<SelectType>('c');

const flag = input<boolean>(false);

const formState = group({
    data: date1,
    range: range,
    select: select,
    flag: flag
});

const options: Array<OptionType<SelectType>> = [{
    label: 'A',
    value: 'a'
}, {
    label: 'B',
    value: 'b'
}, {
    label: 'C',
    value: 'c'
}, {
    label: 'TRUE',
    value: true
}];

@observer
export class App extends React.Component {
    render() {
        return (
            <div>
                <GroupView label="Zbiorczy model" group={formState}>
                    <GroupView label="Cała data" group={date1}>
                        <GroupView label="Dzień" group={field1}>
                            <InputView input={input1} />
                        </GroupView>

                        <GroupView label="Miesiąc" group={field2}>
                            <InputView input={input2} />
                        </GroupView>

                        <GroupView label="Rok" group={field3}>
                            <InputView input={input3} />
                        </GroupView>
                    </GroupView>

                    <GroupView label="Zakres (max 10 różnicy)" group={range}>
                        <GroupView label="Od" group={field4}>
                            <InputView input={input4} />
                        </GroupView>

                        <GroupView label="Do" group={field5}>
                            <InputView input={input5} />
                        </GroupView>
                    </GroupView>

                    <CheckboxView state={flag} />

                    <hr/>


                    <Label>
                        <RadioBoxView state={select} value="a" /> a                        
                    </Label>
                    <br/>


                    <Label>
                        <RadioBoxView state={select} value="b" /> b
                    </Label>
                    <br/>


                    <Label>
                        <RadioBoxView state={select} value="c" /> c
                    </Label>
                    <br/>


                    <Label>
                        <RadioBoxView state={select} value={true} /> true
                    </Label>
                    <br/>


                    <hr/>

                    <SelectView state={select} options={options} />

                    <hr />

                </GroupView>

                {this.renderVisited()}
                {this.renderValue()}
                {this.renderSave()}
                {this.renderReset()}
            </div>
        );
    }

    onSave = () => {
        formState.setAsVisited();
    }

    private renderVisited() {
        const isVisited = formState.isVisited;
        return (
            <div>
                isVisited: { isVisited ? 'true' : 'false'}
            </div>
        );
    }

    private renderValue() {
        const valueModel = formState.valueModel;
        return (
            <div>
                valueModel: {valueModel instanceof Error ? '!!Error!!' : JSON.stringify(valueModel)}
            </div>
        );
    }

    private renderSave() {
        const isVisited = formState.isVisited;
        const valueModel = formState.valueModel;

        return (
            <div onClick={this.onSave}>
                { isVisited === false || (!(valueModel instanceof Error)) ? 'Zapisz' : 'jeszcze nie możesz zapisać' }
            </div>
        );
    }

    onReset = () => {
        formState.reset();
    }

    private renderReset() {
        return (
            <div onClick={this.onReset}>
                Reset
            </div>
        );
    }
}


/*
https://basarat.gitbooks.io/typescript/docs/types/index-signatures.html

type LastSetType = 'aa' | 'bb' | 'cc' | 'dd';

type FromSomeIndex<K extends string> = { [key in K]: string }

const lastSetMap: FromSomeIndex<LastSetType> = {
   "aa": "Tie Break",
   "bb": "dasdasda",
   "cc": "dasdas",
   "dd": "dasdas"
};

const aa: LastSetType = 'bb';

const label = lastSetMap[aa];
*/

