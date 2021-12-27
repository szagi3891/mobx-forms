import { FormInputState } from '../FormInputState';
import { Result } from '../FormModel';

const errorMessage = 'Przynajmnie dwa znaki wprowadz';
const createError = (): Result<string> => Result.createError(errorMessage);

describe('FormModel', () => {
    it('Visited', () => {
        const field = FormInputState.new('').map((value: string): Result<string> => {
            if (value.length < 2) {
                return createError();
            }
            
            return Result.createOk(value);
        });

        expect(field.result).toEqual(Result.createErrorList([]));
        expect(field.errors).toEqual([]);

        field.setAsVisited();
        expect(field.result).toEqual(createError());
        expect(field.errors).toEqual([errorMessage]);

        field.setValue('a');
        expect(field.result).toEqual(createError());
        expect(field.errors).toEqual([errorMessage]);

        field.setValue('aa');
        expect(field.result).toEqual(Result.createOk('aa'));
        expect(field.errors).toEqual([]);
    });
});