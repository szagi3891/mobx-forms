import * as React from 'react';
import { FormInputState, FormModel, input, group } from '../Form';
import { observer } from 'mobx-react';
import { InputView } from './InputView';
import { GroupView } from './GroupView';
import { validateRange, validateNotEmpty, convertToNumber } from '../Form/validators';

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

const input1/*: FormInputState<string>*/ = input('');
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
const field3/*: FormModel<number>*/ = input3
    .map(validateNotEmpty)
    .map(convertToNumber)
    .map(validateYear);

/*interface DateType {
    day: number,
    month: number,
    year: number
}*/

const date1 = group({
    day: field1,
    month: field2,
    year: field3
});

const input4 = input('');
const field4/*: FormModel<number>*/ = input4
    .map(validateNotEmpty)
    .map(convertToNumber);

const input5 = input('');
const field5 /*: FormModel<number>*/ = input5
    .map(validateNotEmpty)
    .map(convertToNumber);

/*interface FormType {
    from: number,
    to: FormGroupModel<number>,
}*/

const range /*: FormGroupModel<string>*/ = group({
        from: field4,
        to: field5
    })
    .map(acceptRange(10))
    .map((value): string | Error => `${value.from}-${value.to}`)
;

/*interface FormType {
    data: DateType,
    range: string,
}*/

const formState/*: FormModel<FormType>*/ = group({
    data: date1,
    range: range
});

/*
const aa = formState.valueModel;

if (!(aa instanceof Error)) {
    aa.range
}
console.info(formState);
*/


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
                </GroupView>
            </div>
        );
    }
}