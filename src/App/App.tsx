import * as React from 'react';
import { FormGroup } from './FormGroup';
import { FormValue } from './FormValue';
import { observer } from 'mobx-react';

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


const formState = FormGroup.init({
    data: FormGroup.init({
        day: FormValue.init('')
            .map(validateNotEmpty)
            .map(convertToNumber)
            .map(validateDay),
        month: FormValue.init('')
            .map(validateNotEmpty)
            .map(convertToNumber)
            .map(validateMonth),
        year: FormValue.init('')
            .map(validateNotEmpty)
            .map(convertToNumber)
            .map(validateYear)
    }),
    range: FormGroup.init({
        from: FormValue.init('')
            .map(validateNotEmpty)
            .map(convertToNumber),
        to: FormValue.init('')
            .map(validateNotEmpty)
            .map(convertToNumber)
    })
        .map((value): string | Error => {
            return 'dasdsa';
        })
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