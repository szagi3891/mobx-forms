import { validateRange, convertToNumber } from "../validators";
import { FormInputState } from "../FormInputState";
import { FormModel, Result } from "../FormModel";

describe('App', () => {
    it('validateRange', () => {
        //expect(true).toBe(true);

        const fun = validateRange(1, 31, "aaa");

        expect(fun(0)).toEqual({
            type: 'ok',
            value: 'aaa'
        });
        expect(fun(1)).toEqual({
            type: 'ok',
            value: 1
        });
        expect(fun(2)).toEqual({
            type: 'ok',
            value: 2
        });
        expect(fun(20)).toEqual({
            type: 'ok',
            value: 20
        });
        expect(fun(30)).toEqual({
            type: 'ok',
            value: 30
        });
        expect(fun(31)).toEqual({
            type: 'ok',
            value: 31
        });
        expect(fun(32)).toEqual({
            type: 'ok',
            value: 'aaa'
        });
    });

    it('grupa', () => {
        const input1 = FormInputState.new('');
        const field1 = input1
            .map(convertToNumber('Input1: Not number'))
            .map((value): Result<number> => {
                if (value > 10) {
                    return {
                        type: 'error',
                        message: ['Input1: Za duża liczba'],
                    };
                } else {
                    return {
                        type: 'ok',
                        value
                    };
                }
            });

        const input2 = FormInputState.new('');
        const field2 = input2
            .map(convertToNumber('Input2: Not number'))
            .map((value): Result<number> => {
                if (value > 10) {
                    return {
                        type: 'error',
                        message: ['Input2: Za duża liczba'],
                    };
                } else {
                    return {
                        type: 'ok',
                        value
                    };
                }
            });

        const form =
            FormModel.group({
                field1,
                field2
            })
            .map((value) => {
                if (value.field1 + value.field2 > 10) {
                    return {
                        type: 'error',
                        message: ['Suma za duza'],
                    };
                } else {
                    return {
                        type: 'ok',
                        value
                    };
                }
            });

        input1.setAsVisited();
        input2.setAsVisited();

        expect(input1.value).toEqual('');
        expect(input2.value).toEqual('');
        expect(field1.errors).toEqual(['Input1: Not number']);
        expect(field2.errors).toEqual(['Input2: Not number']);
        expect(form.errors).toEqual(null);
        expect(form.result).toEqual({
            type: 'error',
            message: ['Not number'],
        });
        expect(form.errors).toEqual(null);

        input1.setValue('aa');

        expect(input1.value).toEqual('aa');
        expect(input2.value).toEqual('');
        expect(field1.errors).toEqual('Not number');
        expect(field2.errors).toEqual('Not number');
        expect(form.errors).toEqual(null);
        expect(form.result).toEqual({
            type: 'error',
            message: ['Not number'],
        });
        expect(form.errors).toEqual(null);

        input1.setValue('8');

        expect(input1.value).toEqual('8');
        expect(input2.value).toEqual('');
        expect(field1.errors).toEqual(null);
        expect(field2.errors).toEqual('Not number');
        expect(form.errors).toEqual(null);
        expect(form.result).toEqual({
            type: 'error',
            message: ['Not number'],
        });
        expect(form.errors).toEqual(null);


        input1.setValue('11');

        expect(input1.value).toEqual('11');
        expect(input2.value).toEqual('');
        expect(field1.errors).toEqual('Za duża liczba');
        expect(field2.errors).toEqual('Not number');
        expect(form.errors).toEqual(null);
        expect(form.result).toEqual({
            type: 'error',
            message: ['Za duża liczba'],
        });
        expect(form.errors).toEqual(null);


        input1.setValue('8');


        expect(input1.value).toEqual('8');
        expect(input2.value).toEqual('');
        expect(field1.errors).toEqual(null);
        expect(field2.errors).toEqual('Not number');
        expect(form.errors).toEqual(null);
        expect(form.result).toEqual({
            type: 'error',
            message: ['Not number'],
        });
        expect(form.errors).toEqual(null);


        input2.setValue('1');

        expect(input1.value).toEqual('8');
        expect(input2.value).toEqual('1');
        expect(field1.errors).toEqual(null);
        expect(field2.errors).toEqual(null);
        expect(form.errors).toEqual(null);
        expect(form.result).toEqual({
            type: 'ok',
            value: {field1: 8, field2: 1},
        });
        expect(form.errors).toEqual(null);

        
        input2.setValue('3');

        expect(input1.value).toEqual('8');
        expect(input2.value).toEqual('3');
        expect(field1.errors).toEqual(null);
        expect(field2.errors).toEqual(null);
        expect(form.errors).toEqual("Suma za duza");
        expect(form.result).toEqual({
            type: 'error',
            message: ['Suma za duza'],
        });
        expect(form.errors).toEqual("Suma za duza");

    });
})