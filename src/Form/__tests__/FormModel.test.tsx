import { FormInputState } from '../FormInputState';
import { Result } from '../FormModel';

const errorMessage = 'Przynajmnie dwa znaki wprowadz';
const createError = (): Result<string> => ({
    type: 'error',
    message: [errorMessage]
});

describe('FormModel', () => {
    it('Visited', () => {
        const input1 = FormInputState.new('');
        const field1 = input1.map((value: string): Result<string> => {
            if (value.length < 2) {
                return createError();
            }
            
            return ({
                type: 'ok',
                value
            });
        });

        expect(field1.result).toEqual(createError());
        expect(field1.errors).toEqual(null);

        input1.setAsVisited();
        expect(field1.result).toEqual(createError());
        expect(field1.errors).toEqual(errorMessage);

        input1.setValue('a');
        expect(field1.result).toEqual(createError());
        expect(field1.errors).toEqual(errorMessage);

        input1.setValue('aa');
        expect(field1.result).toEqual({
            type: 'ok',
            value: 'aa'
        });
        expect(field1.errors).toEqual(null);
    });
});