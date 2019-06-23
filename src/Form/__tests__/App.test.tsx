import { validateRange, convertToNumber } from "../validators";
import { input, group } from "../index";
import { ResultValue, Result, ResultError } from "../../Form/type";

describe('App', () => {
    it('validateRange', () => {
        //expect(true).toBe(true);

        const fun = validateRange(1, 31, "aaa");

        expect(fun(0)).toEqual(new ResultError("aaa"));
        expect(fun(1)).toEqual(new ResultValue(1));
        expect(fun(2)).toEqual(new ResultValue(2));
        expect(fun(20)).toEqual(new ResultValue(20));
        expect(fun(30)).toEqual(new ResultValue(30));
        expect(fun(31)).toEqual(new ResultValue(31));
        expect(fun(32)).toEqual(new ResultError("aaa"));
    });

    it('grupa', () => {
        const input1 = input('');
        const field1 = input1
            .map(convertToNumber)
            .map((value): Result<number> => value > 10 ? new ResultError('Za duża liczba') : new ResultValue(value));

        const input2 = input('');
        const field2 = input2
            .map(convertToNumber)
            .map((value): Result<number> => value > 10 ? new ResultError('Za duża liczba') : new ResultValue(value));

        const form =
            group({
                field1,
                field2
            })
            .map(
                (value) => value.field1 + value.field2 > 10 ? new ResultError('Suma za duza') : new ResultValue(value)
            );

        input1.setAsVisited();
        input2.setAsVisited();

        expect(input1.value).toEqual('');
        expect(input2.value).toEqual('');
        expect(field1.errorMessage).toEqual('Not number');
        expect(field2.errorMessage).toEqual('Not number');
        expect(form.errorMessage).toEqual(null);
        expect(form.result).toEqual(new ResultError('Not number', false));
        expect(form.errorMessage).toEqual(null);

        input1.setValue('aa');

        expect(input1.value).toEqual('aa');
        expect(input2.value).toEqual('');
        expect(field1.errorMessage).toEqual('Not number');
        expect(field2.errorMessage).toEqual('Not number');
        expect(form.errorMessage).toEqual(null);
        expect(form.result).toEqual(new ResultError('Not number', false));
        expect(form.errorMessage).toEqual(null);

        input1.setValue('8');

        expect(input1.value).toEqual('8');
        expect(input2.value).toEqual('');
        expect(field1.errorMessage).toEqual(null);
        expect(field2.errorMessage).toEqual('Not number');
        expect(form.errorMessage).toEqual(null);
        expect(form.result).toEqual(new ResultError('Not number', false));
        expect(form.errorMessage).toEqual(null);


        input1.setValue('11');

        expect(input1.value).toEqual('11');
        expect(input2.value).toEqual('');
        expect(field1.errorMessage).toEqual('Za duża liczba');
        expect(field2.errorMessage).toEqual('Not number');
        expect(form.errorMessage).toEqual(null);
        expect(form.result).toEqual(new ResultError('Za duża liczba', false));
        expect(form.errorMessage).toEqual(null);


        input1.setValue('8');

        expect(input1.value).toEqual('8');
        expect(input2.value).toEqual('');
        expect(field1.errorMessage).toEqual(null);
        expect(field2.errorMessage).toEqual('Not number');
        expect(form.errorMessage).toEqual(null);
        expect(form.result).toEqual(new ResultError('Not number', false));
        expect(form.errorMessage).toEqual(null);


        input2.setValue('1');

        expect(input1.value).toEqual('8');
        expect(input2.value).toEqual('1');
        expect(field1.errorMessage).toEqual(null);
        expect(field2.errorMessage).toEqual(null);
        expect(form.errorMessage).toEqual(null);
        expect(form.result).toEqual(new ResultValue({field1: 8, field2: 1}));
        expect(form.errorMessage).toEqual(null);

        
        input2.setValue('3');

        expect(input1.value).toEqual('8');
        expect(input2.value).toEqual('3');
        expect(field1.errorMessage).toEqual(null);
        expect(field2.errorMessage).toEqual(null);
        expect(form.errorMessage).toEqual("Suma za duza");
        expect(form.result).toEqual(new ResultError("Suma za duza", true));
        expect(form.errorMessage).toEqual("Suma za duza");

    });
})