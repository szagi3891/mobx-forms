import { createResultError, createResultOk, Result } from "./FormModel";

export const convertToNumber = (message: string) => (value: string): Result<number> => {
    const valueNumber = parseFloat(value);
    return isNaN(valueNumber) ? createResultError(message) : createResultOk(valueNumber);
}

export const validateNotEmpty = (message: string) => (value: string): Result<string> =>
    value === '' ? createResultError(message) : createResultOk(value)
;

export const validateRange = (from: number, to: number, message: string) => (value: number): Result<number> =>
    from <= value && value <= to ? createResultOk(value) : createResultError(message)
;
