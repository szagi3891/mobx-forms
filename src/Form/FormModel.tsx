import { computed, action } from "mobx";
import { ConversionFn, Result, ResultError, ResultValue } from "./type";

export interface Value<T> {
    setAsVisited: () => void,
    valueModel: Result<T>,
    modifiedStatus: boolean,
    errorMessage: string | null,
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
            get valueModel(): Result<C> {
                const valueModel = inner.valueModel;
                return valueModel instanceof ResultValue ? conv(valueModel.value) : valueModel;
            },
            get modifiedStatus(): boolean {
                return inner.modifiedStatus;
            },
            get errorMessage(): string | null {
                if (inner.isVisited === false) {
                    return null;
                }

                const errorMessage = inner.errorMessage;
                if (errorMessage !== null) {
                    return errorMessage;
                }

                const valueModel = inner.valueModel;
                if (valueModel instanceof ResultValue) {
                    const newValue = conv(valueModel.value);
                    if (newValue instanceof ResultError) {
                        return newValue.message;
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

    @computed get valueModel(): Result<V> {
        return this.inner.valueModel;
    }

    @computed get modifiedStatus(): boolean {
        return this.inner.modifiedStatus;
    }

    @computed get errorMessage(): string | null {
        return this.inner.errorMessage;
    }

    get isVisited(): boolean {
        return this.inner.isVisited;
    }

    @action reset() {
        this.inner.reset();
    }
}
