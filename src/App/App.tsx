import * as React from 'react';
import { FormInputState, FormGroupModel, input, group } from '../Form';
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

const input1: FormInputState<string> = input('');
const field1: FormGroupModel<number> = input1
    .map(validateNotEmpty)
    .map(convertToNumber)
    .map(validateDay);

const input2 = input('');
const field2: FormGroupModel<number> = input2
    .map(validateNotEmpty)
    .map(convertToNumber)
    .map(validateMonth);

const input3 = input('');
const field3: FormGroupModel<number> = input3
    .map(validateNotEmpty)
    .map(convertToNumber)
    .map(validateYear);

interface DateType {
    day: number,
    month: number,
    year: number
}

const date1: FormGroupModel<DateType> = group({
    day: field1,
    month: field2,
    year: field3
});

const input4 = input('');
const field4: FormGroupModel<number> = input4
    .map(validateNotEmpty)
    .map(convertToNumber);

const input5 = input('');
const field5: FormGroupModel<number> = input5
    .map(validateNotEmpty)
    .map(convertToNumber);

const range: FormGroupModel<string> = group({
        from: field4,
        to: field5
    })
    .map(acceptRange(10))
    .map((value): string | Error => `${value.from}-${value.to}`)
;

interface FormType {
    data: DateType,
    range: string,
}

const formState: FormGroupModel<FormType> = group({
    data: date1,
    range: range
})

console.info(formState);

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