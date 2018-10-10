import { action, computed } from "mobx";
import { FormValue } from "./FormValue";
import { FormMap } from "./Value";

export type ConversionFn<T, K> = (value: T) => K | Error;

type Value<T> = FormGroup<T> | FormMap<T> | FormValue<T>;

type InType<T> = {
    readonly [P in keyof T]: Value<T[P]>;
};

export class FormGroup<T> {
    private fields: InType<T>;

    constructor(fields: InType<T>) {
        this.fields = fields;
    }

    static init<T>(value: InType<T>): FormGroup<T> {
        return new FormGroup(value);
    }

    iterate(): Array<[string, Value<unknown>]> {
        const out: Array<[string, Value<unknown>]> = [];

        for (const [key, item] of Object.entries(this.fields)) {
            if (item instanceof FormValue || item instanceof FormGroup) {
                out.push([key, item]);
            } else {
                throw Error('Nieprawidłowe odgałęzenie');
            }
        }
        return out;
    }

    iterateValues(): Array<Value<unknown>> {
        return this.iterate().map(([_key, item]) => item);
    }

    @action setAsVisited() {
        for (const item of this.iterateValues()) {
            item.setAsVisited();
        }
    }

    @computed get modifiedStatus(): boolean {
        for (const item of this.iterateValues()) {
            if (item.modifiedStatus) {
                return true;
            }
        }

        return false;
    }

    map<C>(conv: ConversionFn<T, C>): FormMap<C> {
        return new FormMap(this).map(conv);
    }

    @computed get valueModel(): T | Error {
        const modelOut = {};

        for (const [key, item] of this.iterate()) {
            const value = item.valueModel;
            if (value instanceof Error) {
                return value;
            }

            //@ts-ignore
            modelOut[key] = value;
        }

        //@ts-ignore
        return modelOut;
    }

    @computed get isVisited(): boolean {
                                                                //wszystkie musza być odwiedzone żeby ta grupa była traktowana jako odwiedzona
        for (const item of this.iterateValues()) {
            if (item.isVisited === false) {
                return false;
            }
        }

        return true;
    }

    @computed get errorMessage(): string | null {
                                                                //interesują nas błędy tylko grupy, nie poszczególnych pól formularza
        return null;
    }
}