import { observable, computed, action } from "mobx";

export type ConversionFn<T, K> = (value: T) => K | Error;

const mergeConversion = <A,B,C>(conv1: ConversionFn<A,B>, conv2: ConversionFn<B,C>): ConversionFn<A, C> => {
    return (data: A): C | Error => {

        const result1 = conv1(data);
        if (result1 instanceof Error) {
            return result1;
        }

        return conv2(result1);
    };
};

export class FormValue<K, V> {
    private readonly initValue: K;
    @observable private value: K;
    @observable private isVisitedInner: boolean;
    private readonly conversion: ConversionFn<K, V>;

    constructor(value: K, isVisited: boolean, conversion: ConversionFn<K, V>) {
        this.initValue = value;
        this.value = value;
        this.isVisitedInner = isVisited;
        this.conversion = conversion;
    }

    static init<T>(value: T): FormValue<T, T> {
        return new FormValue(value, false, (value) => value);
    }

    @action setValue(value: K) {
        this.value = value;
    }

    @action setAsVisited() {
        this.isVisitedInner = true;
    }

    map<C>(conv2: ConversionFn<V, C>): FormValue<K, C> {
        return new FormValue(
            this.value,
            this.isVisitedInner,
            mergeConversion(this.conversion, conv2)
        );
    }

    @computed get valueView(): K {
        return this.value;
    }

    @computed get valueModel(): V | Error {
        const result = this.conversion(this.value);

        if (result instanceof Error) {
            return result;
        }

        return result;
    }

    @computed get modifiedStatus(): boolean {
        return this.initValue !== this.value;
    }

    @computed get errorMessage(): string | null {
        if (this.isVisitedInner) {
            const result = this.conversion(this.value);
            return (result instanceof Error) ? result.message : null;
        }

        return null;
    }

    isVisited(): boolean {
        return this.isVisitedInner;
    }
}

