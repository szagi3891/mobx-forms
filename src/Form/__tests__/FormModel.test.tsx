import { input } from '../index';
import { Result, ResultError, ResultValue } from '../../Form/type';

const errorMessage = 'Przynajmnie dwa znaki wprowadz';
const createError = () => new ResultError(errorMessage);

describe('FormModel', () => {
    it('Visited', () => {
        const input1 = input('');
        const field1 = input1.map((value: string): Result<string> =>
            value.length < 2 ? createError() : new ResultValue(value)
        );

        expect(field1.result).toEqual(createError());
        expect(field1.errorMessage).toEqual(null);

        input1.setAsVisited();
        expect(field1.result).toEqual(createError());
        expect(field1.errorMessage).toEqual(errorMessage);

        input1.setValue('a');
        expect(field1.result).toEqual(createError());
        expect(field1.errorMessage).toEqual(errorMessage);

        input1.setValue('aa');
        expect(field1.result).toEqual(new ResultValue('aa'));
        expect(field1.errorMessage).toEqual(null);
    });
});