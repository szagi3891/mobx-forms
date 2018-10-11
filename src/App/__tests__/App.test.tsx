import { validateRange } from "../App";

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
})