import { computed, action } from "mobx";
import { ConversionFn, Result, ResultError, ResultValue } from "./type";

export interface Value<T> {
    setAsVisited: () => void,
    result: Result<T>,
    modifiedStatus: boolean,
    error: ResultError | null,
    isVisited: boolean,
    reset: () => void,
}

export class FormModel<V> {

    protected inner: Value<V>;

    constructor(prev: Value<V>) {
        this.inner = prev;
    }

    map<C>(conv: ConversionFn<V, C>): FormModel<C> {
        const inner = this.inner;

        const newFormMap = {
            setAsVisited: () => {
                inner.setAsVisited();
            },
            get result(): Result<C> {
                const valueModel = inner.result;
                return valueModel instanceof ResultValue ? conv(valueModel.value) : valueModel;
            },
            get modifiedStatus(): boolean {
                return inner.modifiedStatus;
            },
            get error(): ResultError | null {
                if (inner.isVisited === false) {
                    return null;
                }

                const error = inner.error;
                if (error !== null) {
                    return error;
                }

                const valueModel = inner.result;
                if (valueModel instanceof ResultValue) {
                    const newValue = conv(valueModel.value);
                    if (newValue instanceof ResultError) {
                        return newValue;
                    }
                }

                return null;
            },
            get isVisited(): boolean {
                return inner.isVisited;
            },
            reset: () => {
                inner.reset();
            }
        };

        return new FormModel(newFormMap);
    }

    @action setAsVisited() {
        this.inner.setAsVisited();
    }

    @computed get result(): Result<V> {
        return this.inner.result;
    }

    @computed get modifiedStatus(): boolean {
        return this.inner.modifiedStatus;
    }

    @computed get errorMessage(): string | null {
        const error = this.inner.error;
        return error instanceof ResultError ? error.message : null;
    }

    get isVisited(): boolean {
        return this.inner.isVisited;
    }

    @action reset() {
        this.inner.reset();
    }
}
