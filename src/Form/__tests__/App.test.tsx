import { validateRange, convertToNumber } from "../validators";
import { input, group } from "../index";

describe('App', () => {
    it('validateRange', () => {
        //expect(true).toBe(true);

        const fun = validateRange(1, 31, "aaa");

        expect(fun(0)).toEqual(new Error("aaa"));
        expect(fun(1)).toEqual(1);
        expect(fun(2)).toEqual(2);
        expect(fun(20)).toEqual(20);
        expect(fun(30)).toEqual(30);
        expect(fun(31)).toEqual(31);
        expect(fun(32)).toEqual(new Error("aaa"));
    });

    it('grupa', () => {
        const input1 = input('');
        const field1 = input1
            .map(convertToNumber)
            .map((value): Error | number => value > 10 ? Error('Za duża liczba') : value);

        const input2 = input('');
        const field2 = input2
            .map(convertToNumber)
            .map((value): Error | number => value > 10 ? Error('Za duża liczba') : value);

        const form =
            group({
                field1,
                field2
            })
            .map(
                (value) => value.field1 + value.field2 > 10 ? Error('Suma za duza') : value
            );

        expect(input1.valueView).toEqual('');
        expect(input2.valueView).toEqual('');
        expect(field1.errorMessage).toEqual('Not number');
        expect(field2.errorMessage).toEqual('Not number');
        expect(form.errorMessage).toEqual(null);
        expect(form.valueModel).toEqual(Error('Not number'));

        input1.setValue('aa');

        expect(input1.valueView).toEqual('aa');
        expect(input2.valueView).toEqual('');
        expect(field1.errorMessage).toEqual('Not number');
        expect(field2.errorMessage).toEqual('Not number');
        expect(form.errorMessage).toEqual(null);
        expect(form.valueModel).toEqual(Error('Not number'));

        input1.setValue('8');

        expect(input1.valueView).toEqual('8');
        expect(input2.valueView).toEqual('');
        expect(field1.errorMessage).toEqual(null);
        expect(field2.errorMessage).toEqual('Not number');
        expect(form.errorMessage).toEqual(null);
        expect(form.valueModel).toEqual(Error('Not number'));


        input1.setValue('11');

        expect(input1.valueView).toEqual('11');
        expect(input2.valueView).toEqual('');
        expect(field1.errorMessage).toEqual('Za duża liczba');
        expect(field2.errorMessage).toEqual('Not number');
        expect(form.errorMessage).toEqual(null);
        expect(form.valueModel).toEqual(Error('Za duża liczba'));


        input1.setValue('8');

        expect(input1.valueView).toEqual('8');
        expect(input2.valueView).toEqual('');
        expect(field1.errorMessage).toEqual(null);
        expect(field2.errorMessage).toEqual('Not number');
        expect(form.errorMessage).toEqual(null);
        expect(form.valueModel).toEqual(Error('Not number'));


        input2.setValue('1');

        expect(input1.valueView).toEqual('8');
        expect(input2.valueView).toEqual('1');
        expect(field1.errorMessage).toEqual(null);
        expect(field2.errorMessage).toEqual(null);
        expect(form.errorMessage).toEqual(null);
        expect(form.valueModel).toEqual({field1: 8, field2: 1});

        
        input2.setValue('3');

        expect(input1.valueView).toEqual('8');
        expect(input2.valueView).toEqual('3');
        expect(field1.errorMessage).toEqual(null);
        expect(field2.errorMessage).toEqual(null);
        expect(form.errorMessage).toEqual("Suma za duza");
        expect(form.valueModel).toEqual(Error("Suma za duza"));
    });
})