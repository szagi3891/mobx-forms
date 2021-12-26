import * as React from 'react';
import { observer } from 'mobx-react';
import { InputView } from './InputView';
import { GroupView } from './GroupView';
import { validateRange, validateNotEmpty, convertToNumber } from '../Form/validators';
import { SelectView, OptionType } from './SelectView';
import { CheckboxView } from './CheckboxView';
import { RadioBoxView } from './RadioBoxView';
import styled from '@emotion/styled';
import { FormInputState } from '../Form/FormInputState';
import { FormModel, Result } from '../Form/FormModel';

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

const acceptRange = (maxDelta: number) => (value: FromToType): Result<FromToType> => {
    const delta = Math.abs(value.to - value.from);
    if (delta > maxDelta) {
        return {
            type: 'error',
            message: ['Zbyt dua odległośc pomiędzy oboma liczbami']
        };
    }
    
    return {
        type: 'ok',
        value
    };
}

const input1 = FormInputState.create('');
const field1 = input1
    .map(validateNotEmpty('Input1: Wprowadź wartość'))
    .map(convertToNumber('Input1: Wprowadź poprawną liczbę'))
    .map(validateDay);

const input2 = FormInputState.create('');
const field2 = input2
    .map(validateNotEmpty('Input2: Wprowadź wartość'))
    .map(convertToNumber('Input2: Wprowadź poprawną liczbę'))
    .map(validateMonth);

const input3 = FormInputState.create('');
const field3 = input3
    .map(validateNotEmpty('Input3: Wprowadź wartość'))
    .map(convertToNumber('Input3: Wprowadź poprawną liczbę'))
    .map(validateYear);

const date1 = FormModel.group({
    day: field1,
    month: field2,
    year: field3
});

const input4 = FormInputState.create('');
const field4 = input4
    .map(validateNotEmpty('Input4: Wprowadź wartość'))
    .map(convertToNumber('Input4: Wprowadź poprawną liczbę'));

const input5 = FormInputState.create('');
const field5 = input5
    .map(validateNotEmpty('Input5: Wprowadź wartość'))
    .map(convertToNumber('Input5: Wprowadź poprawną liczbę'));

const range = FormModel.group({
        from: field4,
        to: field5
    })
    .map(acceptRange(10))
    .map((value): Result<string> => ({
        type: 'ok',
        value: `${value.from}-${value.to}`
    }))
;

type SelectType = 'a' | 'b' | 'c' | true;

const select = FormInputState.create<SelectType>('c');
const selectModel = select.toModel();

const flag = FormInputState.create<boolean>(false);
const flagModel = flag.toModel();


const selectList = [
    FormInputState.create<SelectType>('c'),
    FormInputState.create<SelectType>('a'),
    FormInputState.create<SelectType>(true),
    FormInputState.create<SelectType>('a'),
    FormInputState.create<SelectType>(true)
];

const selectListGroup = FormModel.groupArray(selectList).map((value) => {
    let count = 0;
    for (const item of value) {
        if (item === true) {
            count++;
        }
    }

    if (count > 1) {
        return {
            type: 'ok',
            value
        };        
    }

    return {
        type: 'error',
        message: ['Wybierz "true" przynajmniej dwa razy']
    };   
});



const formState = FormModel.group({
    data: date1,
    range: range,
    select: select,
    flag: flag,
    selectList: selectListGroup
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


                    <GroupView label="Checkbox" group={flagModel}>
                        <CheckboxView state={flag} />
                    </GroupView>
                    
                    
                    <GroupView label="RadioBox" group={selectModel}>
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

                        <SelectView state={select} options={options} />

                    </GroupView>

                    <GroupView label="selectListGrpup" group={selectListGroup}>
                        { selectList.map((select, index) =>
                            <SelectView key={index} state={select} options={options} />
                        )}
                    </GroupView>

                </GroupView>

                {this.renderValue()}
                {this.renderSave()}
                {this.renderReset()}
            </div>
        );
    }

    onSave = () => {
        formState.setAsVisited();
    }

    private renderValue() {
        const result = formState.result;

        if (result.type === 'error') {
            return (
                <div>
                    error {'==>>>'} {JSON.stringify(result.message)}
                </div>
            );
        }

        if (result.type === 'loading') {
            return (
                <div>
                    Loading ...
                </div>
            );
        }

        return (
            <div>
                result: {result.type === 'ok' ? JSON.stringify(result.value) : '!!Error!!'}
            </div>
        );
    }

    private renderSave() {
        const result = formState.result;

        return (
            <div onClick={this.onSave}>
                { result.type === 'ok' ? 'Zapisz' : 'jeszcze nie możesz zapisać' }
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

