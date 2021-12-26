import { Result } from "./FormModel";

export const convertToNumber = (message: string) => (value: string): Result<number> => {
    const valueNumber = parseFloat(value);
    if (isNaN(valueNumber)) {
        return {
            type: 'error',
            message: [message]
        };
    }
    
    return {
        type: 'ok',
        value: valueNumber
    };
}

export const validateNotEmpty = (message: string) => (value: string): Result<string> => {
    if (value === '') {
        return {
            type: 'error',
            message: [message]
        };
    }

    return {
        type: 'ok',
        value: value
    };
};

export const validateRange = (from: number, to: number, message: string) => (value: number): Result<number> => {
    if (from <= value && value <= to) {
        return {
            type: 'ok',
            value: value
        };
    }

    return {
        type: 'error',
        message: [message]
    };
};
