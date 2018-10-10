import { action, computed } from "mobx";
import { FormValue } from "./FormValue";

export type ConversionFn<T, K> = (value: T) => K | Error;

const mergeConversion = <A,B,C>(conv1: ConversionFn<A,B>, conv2: ConversionFn<B,C>): ConversionFn<A, C> => {
    return (data: A): C | Error => {

        const result1 = conv1(data);
        if (result1 instanceof Error) {
            return result1;
        }

        return conv2(result1);
    };
};

type InType<T> = {
    readonly [P in keyof T]: FormValue<any, T[P]> | FormGroup<any, T[P]>;
};


export class FormGroup<T, M> {
    private fields: InType<T>;
    private readonly conversion: ConversionFn<T, M>;

    constructor(fields: InType<T>, conversion: ConversionFn<T, M>) {
        this.fields = fields;
        this.conversion = conversion;
    }

    static init<T>(value: InType<T>): FormGroup<T, T> {
        return new FormGroup(value, (value: T): T => value);
    }

    @action setAsVisited() {
        for (const item of Object.values(this.fields)) {
            if (item instanceof FormValue || item instanceof FormGroup) {
                item.setAsVisited();
            } else {
                throw Error('Nieprawidłowe odgałęzenie');
            }
        }
    }

    @computed get modifiedStatus(): boolean {
        for (const item of Object.values(this.fields)) {
            if (item instanceof FormValue || item instanceof FormGroup) {
                if (item.modifiedStatus) {
                    return true;
                }
            } else {
                throw Error('Nieprawidłowe odgałęzenie');
            }
        }

        return false;
    }

    map<C>(conv2: ConversionFn<M, C>): FormGroup<T, C> {
        return new FormGroup(
            this.fields,
            mergeConversion(this.conversion, conv2)
        );
    }

    @computed private get innerModel(): T | Error {
        const modelOut = {};

        for (const [key, item] of Object.entries(this.fields)) {
            if (item instanceof FormValue || item instanceof FormGroup) {
                const value = item.valueModel;
                if (value instanceof Error) {
                    return value;
                }

                //@ts-ignore
                modelOut[key] = value;
            } else {
                throw Error('Nieprawidłowe odgałęzenie');
            }
        }

        //@ts-ignore
        return modelOut;
    }

    @computed get isVisited(): boolean {
                                                                //wszystkie musza być odwiedzone żeby ta grupa była traktowana jako odwiedzona
        for (const item of Object.values(this.fields)) {
            if (item instanceof FormValue || item instanceof FormGroup) {
                if (item.isVisited === false) {
                    return false;
                }
            } else {
                throw Error('Nieprawidłowe odgałęzenie');
            }
        }

        return true;
    }

    @computed get valueModel(): M | Error {
        const innerModel = this.innerModel;

                                                            //interesują nas błędy tylko grupy, nie poszczególnych pól formularza
        if (innerModel instanceof Error) {
            return innerModel;
        }

        return this.conversion(innerModel);
    }

    @computed get errorMessage(): string | null {
        if (this.isVisited) {
            const model = this.valueModel;
            return (model instanceof Error) ? model.message : null;
        }

        return null;
    }
}