import * as React from 'react';
import { FormGroup } from './FormGroup';
import { FormValue } from './FormValue';
import { observer } from 'mobx-react';
import { FormMap } from './Value';

const convertToNumber = (value: string): number | Error => {
    const valueNumber = parseFloat(value);
    return isNaN(valueNumber) ? new Error('Not number') : valueNumber;
}

const validateNotEmpty = (value: string): string | Error =>
    value === '' ? new Error('Wpisz coś') : value
;

const validateRange = (from: number, to: number, message: string) => (value: number): number | Error =>
    (from <= value && value <= to) ? value : new Error(message)
;

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

const field1: FormMap<number> = FormValue
    .init('')
    .map(validateNotEmpty)
    .map(convertToNumber)
    .map(validateDay);

const field2: FormMap<number> = FormValue
    .init('')
    .map(validateNotEmpty)
    .map(convertToNumber)
    .map(validateMonth);

const field3: FormMap<number> = FormValue
    .init('')
    .map(validateNotEmpty)
    .map(convertToNumber)
    .map(validateYear);

interface DateType {
    day: number,
    month: number,
    year: number
}

const date1: FormGroup<DateType> = FormGroup.init({
    day: field1,
    month: field2,
    year: field3
});

const field4: FormMap<number> = FormValue.init('')
    .map(validateNotEmpty)
    .map(convertToNumber);

const field5: FormMap<number> = FormValue.init('')
    .map(validateNotEmpty)
    .map(convertToNumber);

const range: FormMap<string> = FormGroup.
    init({
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

const formState: FormGroup<FormType> = FormGroup.init({
    data: date1,
    range: range
})

@observer
export class App extends React.Component {
    render() {
        return (
            <div>
                App ...
            </div>
        );
    }
}