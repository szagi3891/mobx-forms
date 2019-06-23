import { computed, action } from "mobx";
import { ConversionFn, Result, ResultError, ResultValue } from "./type";

export interface Value {
    setAsVisited: () => void,
    modifiedStatus: boolean,
    isVisited: boolean,
    reset: () => void,
}

export class FormModel<V> {

    private inner: Value;
    private getValue: () => Result<V>

    constructor(prev: Value, getValue: () => Result<V>) {
        this.inner = prev;
        this.getValue = getValue;
    }

    map<C>(conv: ConversionFn<V, C>): FormModel<C> {
        return new FormModel(this, (): Result<C> => {
            const valueModel = this.getValue();
            return valueModel instanceof ResultValue ? conv(valueModel.value) : valueModel;
        });
    }

    @action setAsVisited() {
        this.inner.setAsVisited();
    }

    @computed get result(): Result<V> {
        return this.getValue();
    }

    @computed get modifiedStatus(): boolean {
        return this.inner.modifiedStatus;
    }

    @computed get errorMessage(): string | null {
        if (this.inner.isVisited === false) {
            return null;
        }

        const result = this.result;

        if (result instanceof ResultError && result.shouldBeShow) {
            return result.message;
        }

        return null;
    }

    get isVisited(): boolean {
        return this.inner.isVisited;
    }

    @action reset() {
        this.inner.reset();
    }
}

