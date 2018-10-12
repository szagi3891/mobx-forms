import { action, computed } from "mobx";
import { FormInputState } from "./FormInputState";
import { FormGroupModel } from "./FormGroupModel";

export type ConversionFn<T, K> = (value: T) => K | Error;

type Value<T> = FormInputState<T> | FormGroupModel<T>;

/*export type InGroupType<T> = {
    readonly [P in keyof T]: Value<T[P]>;
};*/

export type Model<T> = {
    readonly [P in keyof T]:
        T[P] extends FormInputState<infer O1> ? O1 :
        T[P] extends FormGroupModel<infer O2> ? O2 :
        T[P];
}

export class FormGroup<IN> {
    private fields: IN;

    constructor(fields: IN) {
        this.fields = fields;
    }

    iterate(): Array<[string, Value<unknown>]> {
        const out: Array<[string, Value<unknown>]> = [];

        for (const [key, item] of Object.entries(this.fields)) {
            if (item instanceof FormInputState || item instanceof FormGroupModel) {
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

    map<C>(conv: ConversionFn<Model<IN>, Model<C>>): FormGroupModel<Model<C>> {
        return new FormGroupModel<Model<IN>>(this).map(conv);
    }

    @computed get valueModel(): Model<IN> | Error {
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