import { input } from '../index';

const errorMessage = 'Przynajmnie dwa znaki wprowadz';
const createError = () => new Error(errorMessage);

describe('FormModel', () => {
    it('Visited', () => {
        const input1 = input('');
        const field1 = input1.map((value: string): string | Error =>
            value.length < 2 ? createError() : value
        );

        expect(field1.valueModel).toEqual(createError());
        expect(field1.errorMessage).toEqual(null);

        input1.setAsVisited();
        expect(field1.valueModel).toEqual(createError());
        expect(field1.errorMessage).toEqual(errorMessage);

        input1.setValue('a');
        expect(field1.valueModel).toEqual(createError());
        expect(field1.errorMessage).toEqual(errorMessage);

        input1.setValue('aa');
        expect(field1.valueModel).toEqual('aa');
        expect(field1.errorMessage).toEqual(null);
    });
});