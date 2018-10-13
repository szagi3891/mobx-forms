import { computed, action } from "mobx";

export type ConversionFn<T, K> = (value: T) => K | Error;

export interface Value<T> {
    setAsVisited: () => void,
    valueModel: T | Error,
    modifiedStatus: boolean,
    errorMessage: string | null,
    isVisited: boolean,
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
            get valueModel(): C | Error {
                const valueModel = inner.valueModel;
                return valueModel instanceof Error ? valueModel : conv(valueModel);
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
                if (!(valueModel instanceof Error)) {
                    const newValue = conv(valueModel);
                    if (newValue instanceof Error) {
                        return newValue.message;
                    }
                }
    
                return null;
            },
            get isVisited(): boolean {
                return inner.isVisited;
            }
        };

        return new FormModel(newFormMap);
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
