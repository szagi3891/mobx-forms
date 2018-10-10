import { observable, computed, action } from "mobx";
import { ConversionFn, FormMap } from "./Value";

export class FormValue<K> {
    private readonly initValue: K;
    @observable private value: K;
    @observable private isVisitedInner: boolean;

    constructor(value: K) {
        this.initValue = value;
        this.value = value;
        this.isVisitedInner = false;
    }

    static init<T>(value: T): FormValue<T> {
        return new FormValue(value);
    }

    @action setValue(value: K) {
        this.value = value;
    }

    @action setAsVisited() {
        this.isVisitedInner = true;
    }

    map<C>(conv: ConversionFn<K, C>): FormMap<C> {
        return new FormMap(this).map(conv);
    }

    @computed get valueView(): K {
        return this.value;
    }

    @computed get valueModel(): K | Error {
        return this.value;
    }

    @computed get modifiedStatus(): boolean {
        return this.initValue !== this.value;
    }

    @computed get errorMessage(): string | null {
        return null;
    }

    get isVisited(): boolean {
        return this.isVisitedInner;
    }
}

