import { action, computed } from "mobx";
import { FormInputState } from "./FormInputState";
import { FormModel } from "./FormModel";
import { Result, ResultValue, ResultError } from "./type";

type Value<T> = FormInputState<T> | FormModel<T>;


export type Model<T> = {
    readonly [P in keyof T]:
        T[P] extends FormInputState<infer O1> ? O1 :
        T[P] extends FormModel<infer O2> ? O2 :
        T[P];
}

export class FormGroup<IN> {
    private fields: IN;

    constructor(fields: IN) {
        this.fields = fields;
    }

    iterateValues(): Array<Value<unknown>> {
        const out: Array<Value<unknown>> = [];

        for (const item of Object.values(this.fields)) {
            if (item instanceof FormInputState || item instanceof FormModel) {
                out.push(item);
            }
        }
        return out;
    }

    @action setAsVisited() {
        for (const item of this.iterateValues()) {
            item.setAsVisited();
        }
    }

    @action reset() {
        for (const item of this.iterateValues()) {
            item.reset();
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

    @computed get result(): Result<Model<IN>> {
        //@ts-ignore
        const modelOut: Model<IN> = {};

        for (const [key, item] of Object.entries(this.fields)) {

            if (item instanceof FormInputState) {

                const value = item.value;
                //@ts-ignore
                modelOut[key] = value;

            } else if (item instanceof FormModel) {

                const value = item.result;
                if (value instanceof ResultValue) {
                    const innerValue = value.value;
                    //@ts-ignore
                    modelOut[key] = innerValue;
                } else {
                    return value;
                }

            } else {
                //@ts-ignore
                modelOut[key] = item;
            }
        }

        return new ResultValue(modelOut);
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

    get error(): ResultError | null {
        return null;
    }
}