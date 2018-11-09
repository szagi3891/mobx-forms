import { FormModel } from "./FormModel";
import { action, computed } from "mobx";
import { Result, ResultValue, ResultError } from "./type";
import { FormInputState } from ".";

type Value<T> = FormInputState<T> | FormModel<T>;

export class FormGroupArray<K> {

    readonly fields: ReadonlyArray<Value<K>>;

    constructor(fields: ReadonlyArray<Value<K>>) {
        this.fields = fields;
    }

    static create<IN>(fields: Array<Value<IN>>): FormModel<Array<IN>> {
        return new FormModel(new FormGroupArray(fields));
    }

    @action setAsVisited() {
        for (const item of this.fields) {
            item.setAsVisited();
        }
    }

    @action reset() {
        for (const item of this.fields) {
            item.reset();
        }
    }

    @computed get modifiedStatus(): boolean {
        for (const item of this.fields) {
            if (item.modifiedStatus) {
                return true;
            }
        }

        return false;
    }

    @computed get result(): Result<Array<K>> {
        const modelOut: Array<K> = [];

        for (const item of this.fields) {
            if (item instanceof FormInputState) {
                modelOut.push(item.value);

            } else {
                const value = item.result;
                if (value instanceof ResultValue) {
                    modelOut.push(value.value);
                } else {
                    return value;
                }
            }
        }

        return new ResultValue(modelOut);
    }

    @computed get isVisited(): boolean {
                                                    //wszystkie musza być odwiedzone żeby ta grupa była traktowana jako odwiedzona
        for (const item of this.fields) {
            if (item.isVisited === false) {
                return false;
            }
        }

        return true;
    }

    get error(): ResultError | null {
        return null;
    }
}
