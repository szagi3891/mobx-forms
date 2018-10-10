import { computed, action } from "mobx";

export type ConversionFn<T, K> = (value: T) => K | Error;

export interface Value<T> {
    setAsVisited: () => void,
    valueModel: T | Error,
    modifiedStatus: boolean,
    errorMessage: string | null,
    isVisited: boolean,
}

export class FormMap<V> {

    private inner: Value<V>;

    constructor(prev: Value<V>) {
        this.inner = prev;
    }

    map<C>(conv: ConversionFn<V, C>): FormMap<C> {
        const inner = this.inner;

        const newFormMap = {
            setAsVisited: () => {
                inner.setAsVisited();
            },
            get valueModel(): C | Error {
                const value = inner.valueModel;
                return value instanceof Error ? value : conv(value);
            },
            get modifiedStatus(): boolean {
                return inner.modifiedStatus;
            },
            get errorMessage(): string | null {
                const valueModel = inner.valueModel;
                return (valueModel instanceof Error) ? valueModel.message : null;
            },
            get isVisited(): boolean {
                return inner.isVisited;
            }
        };

        return new FormMap(newFormMap);
    }

    @action setAsVisited() {
        this.inner.setAsVisited();
    }

    @computed get valueModel(): V | Error {
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
}
