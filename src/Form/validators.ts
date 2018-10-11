
export const convertToNumber = (value: string): number | Error => {
    const valueNumber = parseFloat(value);
    return isNaN(valueNumber) ? new Error('Not number') : valueNumber;
}

export const validateNotEmpty = (value: string): string | Error =>
    value === '' ? new Error('Wpisz coś') : value
;

export const validateRange = (from: number, to: number, message: string) => (value: number): number | Error =>
    (from <= value && value <= to) ? value : new Error(message)
;
