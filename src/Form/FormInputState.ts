import { observable, computed, action } from "mobx";
import { FormModel } from "./FormModel";
import { ConversionFn, Result, ResultError } from "./type";

export class FormInputState<K> {
    private readonly initValue: K;
    @observable private innerValue: K;
    @observable private isVisitedInner: boolean;

    constructor(value: K) {
        this.initValue = value;
        this.innerValue = value;
        this.isVisitedInner = false;
    }

    @action setValue(value: K) {
        this.innerValue = value;
    }

    @action setAsVisited() {
        this.isVisitedInner = true;
    }

    map<C>(conv: ConversionFn<K, C>): FormModel<C> {
        const inner = this;

        const newFormMap = {
            setAsVisited: () => {
                inner.setAsVisited();
            },
            get value(): Result<C> {
                const valueModel = inner.value;
                return conv(valueModel);
            },
            get modifiedStatus(): boolean {
                return inner.modifiedStatus;
            },
            get error(): ResultError | null {
                if (inner.isVisited === false) {
                    return null;
                }

                const newValue = conv(inner.value);
                return newValue instanceof ResultError ? newValue : null;
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

    @computed get value(): K {
        return this.innerValue;
    }

    @computed get modifiedStatus(): boolean {
        return this.initValue !== this.innerValue;
    }

    get isVisited(): boolean {
        return this.isVisitedInner;
    }

    @action reset() {
        this.innerValue = this.initValue;
        this.isVisitedInner = false;
    }
}

