import { validateRange, convertToNumber } from "../validators";
import { FormInputState } from "../FormInputState";
import { FormModel, Result } from "../FormModel";

describe('App', () => {
    it('validateRange', () => {
        //expect(true).toBe(true);

        const fun = validateRange(1, 31, "aaa");

        expect(fun(0)).toEqual(Result.createError('aaa'));
        expect(fun(1)).toEqual(Result.createOk(1));
        expect(fun(2)).toEqual(Result.createOk(2));
        expect(fun(20)).toEqual(Result.createOk(20));
        expect(fun(30)).toEqual(Result.createOk(30));
        expect(fun(31)).toEqual(Result.createOk(31));
        expect(fun(32)).toEqual(Result.createError('aaa'));
    });

    it('grupa', () => {
        const field1 = FormInputState.new('')
            .map(convertToNumber('Input1: Not number'))
            .map((value): Result<number> => {
                if (value > 10) {
                    return Result.createError('Input1: Za duża liczba');
                } else {
                    return Result.createOk(value);
                }
            });

        const field2 = FormInputState.new('')
            .map(convertToNumber('Input2: Not number'))
            .map((value): Result<number> => {
                if (value > 10) {
                    return Result.createError('Input2: Za duża liczba');
                } else {
                    return Result.createOk(value);
                }
            });

        const form =
            FormModel.group({
                field1: field1,
                field2: field2,
            })
            .map((value) => {
                if (value.field1 + value.field2 > 10) {
                    return Result.createError('Suma za duza');
                } else {
                    return Result.createOk(value);
                }
            });

        expect(form.errors).toEqual([]);

        field1.setAsVisited();
        field2.setAsVisited();

        expect(field1.value).toEqual('');
        expect(field2.value).toEqual('');
        expect(field1.errors).toEqual(['Input1: Not number']);
        expect(field2.errors).toEqual(['Input2: Not number']);
        expect(form.errors).toEqual(["Input1: Not number", "Input2: Not number"]);
        expect(form.result).toEqual(Result.createErrorList(["Input1: Not number", "Input2: Not number"]));

        field1.setValue('aa');

        expect(field1.value).toEqual('aa');
        expect(field2.value).toEqual('');
        expect(field1.errors).toEqual(['Input1: Not number']);
        expect(field2.errors).toEqual(['Input2: Not number']);
        expect(form.errors).toEqual(["Input1: Not number", "Input2: Not number"]);
        expect(form.result).toEqual(Result.createErrorList(["Input1: Not number", "Input2: Not number"]));

        field1.setValue('8');

        expect(field1.value).toEqual('8');
        expect(field2.value).toEqual('');
        expect(field1.errors).toEqual([]);
        expect(field2.errors).toEqual(['Input2: Not number']);
        expect(form.errors).toEqual(['Input2: Not number']);
        expect(form.result).toEqual(Result.createErrorList(['Input2: Not number']));


        field1.setValue('11');

        expect(field1.value).toEqual('11');
        expect(field2.value).toEqual('');
        expect(field1.errors).toEqual(['Input1: Za duża liczba']);
        expect(field2.errors).toEqual(['Input2: Not number']);
        expect(form.errors).toEqual(["Input1: Za duża liczba", "Input2: Not number"]);
        expect(form.result).toEqual(Result.createErrorList(["Input1: Za duża liczba", "Input2: Not number"]));


        field1.setValue('8');


        expect(field1.value).toEqual('8');
        expect(field2.value).toEqual('');
        expect(field1.errors).toEqual([]);
        expect(field2.errors).toEqual(['Input2: Not number']);
        expect(form.errors).toEqual(['Input2: Not number']);
        expect(form.result).toEqual(Result.createErrorList(['Input2: Not number']));

        field2.setValue('1');

        expect(field1.value).toEqual('8');
        expect(field2.value).toEqual('1');
        expect(field1.errors).toEqual([]);
        expect(field2.errors).toEqual([]);
        expect(form.errors).toEqual([]);
        expect(form.result).toEqual(Result.createOk({field1: 8, field2: 1}));
        expect(form.errors).toEqual([]);

        field2.setValue('3');

        expect(field1.value).toEqual('8');
        expect(field2.value).toEqual('3');
        expect(field1.errors).toEqual([]);
        expect(field2.errors).toEqual([]);
        expect(form.errors).toEqual(["Suma za duza"]);
        expect(form.result).toEqual(Result.createErrorList(['Suma za duza']));
        expect(form.errors).toEqual(["Suma za duza"]);
    });
})