import { Result } from "./FormModel";

export const convertToNumber = (message: string) => (value: string): Result<number> => {
    const valueNumber = parseFloat(value);
    return isNaN(valueNumber) ? Result.createError(message) : Result.createOk(valueNumber);
}

export const validateNotEmpty = (message: string) => (value: string): Result<string> =>
    value === '' ? Result.createError(message) : Result.createOk(value)
;

export const validateRange = (from: number, to: number, message: string) => (value: number): Result<number> =>
    from <= value && value <= to ? Result.createOk(value) : Result.createError(message)
;
