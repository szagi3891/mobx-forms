import { Result, ResultError, ResultValue } from "./type";

export const convertToNumber = (value: string): Result<number> => {
    const valueNumber = parseFloat(value);
    return isNaN(valueNumber) ? new ResultError('Not number') : new ResultValue(valueNumber);
}

export const validateNotEmpty = (value: string): Result<string> =>
    value === '' ? new ResultError('Wpisz coś') : new ResultValue(value)
;

export const validateRange = (from: number, to: number, message: string) => (value: number): Result<number> =>
    (from <= value && value <= to) ? new ResultValue(value) : new ResultError(message)
;
