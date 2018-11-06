import { observable, computed, action } from "mobx";
import { FormModel } from "./FormModel";
import { ConversionFn, Result, ResultValue } from "./type";

export class FormInputState<K> {
    private readonly initValue: K;
    @observable private value: K;
    @observable private isVisitedInner: boolean;

    constructor(value: K) {
        this.initValue = value;
        this.value = value;
        this.isVisitedInner = false;
    }

    @action setValue(value: K) {
        this.value = value;
    }

    @action setAsVisited() {
        this.isVisitedInner = true;
    }

    map<C>(conv: ConversionFn<K, C>): FormModel<C> {
        return new FormModel(this).map(conv);
    }

    @computed get valueView(): K {
        return this.value;
    }

    @computed get valueModel(): Result<K> {
        return new ResultValue(this.value);
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

    @action reset() {
        this.value = this.initValue;
        this.isVisitedInner = false;
    }
}

