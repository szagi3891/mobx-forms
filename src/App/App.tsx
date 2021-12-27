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
        return Result.createError('Zbyt dua odległośc pomiędzy oboma liczbami');
    }
    
    return Result.createOk(value);
}

const field1 = FormInputState.new('')
    .map(validateNotEmpty('Wprowadź wartość'))
    .map(convertToNumber('Wprowadź poprawną liczbę'))
    .map(validateDay);

const field2 = FormInputState.new('')
    .map(validateNotEmpty('Wprowadź wartość'))
    .map(convertToNumber('Wprowadź poprawną liczbę'))
    .map(validateMonth);

const field3 = FormInputState.new('')
    .map(validateNotEmpty('Wprowadź wartość'))
    .map(convertToNumber('Wprowadź poprawną liczbę'))
    .map(validateYear);

const date1 = FormModel.group({
    day: field1,                                    //(message) => `Input1: ${message}`  TODO
    month: field2,                                  //(message) => `Input2: ${message}`  TODO
    year: field3                                    //(message) => `Input3: ${message}`  TODO
});

const field4 = FormInputState.new('10')
    .map(validateNotEmpty('Wprowadź wartość'))
    .map(convertToNumber('Wprowadź poprawną liczbę'));

const field5 = FormInputState.new('40')
    .map(validateNotEmpty('Wprowadź wartość'))
    .map(convertToNumber('Wprowadź poprawną liczbę'));

const range = FormModel.group({
        from: field4,                               //(message) => `Input4: ${message}`  TODO
        to: field5                                  //(message) => `Input5: ${message}`  TODO
    })
    .map(acceptRange(10))
    .map((value): Result<string> => Result.createOk(`${value.from}-${value.to}`))
;

type SelectType = 'a' | 'b' | 'c' | true;

const select = FormInputState.new<SelectType>('c');

const flag = FormInputState.new<boolean>(false);

const selectList = {
    'a1': FormInputState.new<SelectType>('c'),
    'a2': FormInputState.new<SelectType>('a'),
    'a3': FormInputState.new<SelectType>(true),
    'a4': FormInputState.new<SelectType>('a'),
    'a5': FormInputState.new<SelectType>(true)
};

const selectListGroup = FormModel.group(selectList).map((value) => {
    let count = 0;

    if (value.a1 === true) {
        count++;
    }
    if (value.a2 === true) {
        count++;
    }
    if (value.a3 === true) {
        count++;
    }
    if (value.a4 === true) {
        count++;
    }
    if (value.a5 === true) {
        count++;
    }

    if (count > 1) {
        return Result.createOk(value);
    }

    return Result.createError('Wybierz "true" przynajmniej dwa razy');
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
                        <InputView
                            label="Dzień"
                            input={field1}
                        />
                        <InputView
                            label="Miesiąc"
                            input={field2}
                        />
                        <InputView
                            label="Rok"
                            input={field3}
                        />
                    </GroupView>


                    <GroupView label="Zakres (max 10 różnicy)" group={range}>
                        <InputView
                            label="Od"
                            input={field4}
                        />

                        <InputView
                            label="Do"
                            input={field5}
                        />
                    </GroupView>


                    <GroupView label="Checkbox" group={flag}>
                        <CheckboxView state={flag} />
                    </GroupView>
                    
                    
                    <GroupView label="RadioBox" group={select}>
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
                        <SelectView state={selectList.a1} options={options} />
                        <SelectView state={selectList.a2} options={options} />
                        <SelectView state={selectList.a3} options={options} />
                        <SelectView state={selectList.a4} options={options} />
                        <SelectView state={selectList.a5} options={options} />
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
        const result = formState.result.value;

        if (result.type === 'error') {
            return (
                <div>
                    error {'==>>>'} {JSON.stringify(result.message)}
                </div>
            );
        }

        return (
            <div>
                result: {JSON.stringify(result.data)}
            </div>
        );
    }

    private renderSave() {
        const result = formState.result.value;

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

