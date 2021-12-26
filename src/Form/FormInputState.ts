import { observable, computed, action } from "mobx";
import { FormModel, FormModelType, Result } from "./FormModel";

class BoxValue<K> {
    private readonly initValue: K;
    @observable value: K;
    @observable visited: boolean;

    constructor(value: K) {
        this.initValue = value;
        this.value = value;
        this.visited = false;
    }

    @action setAsVisited() {
        this.visited = true;
    }

    @action reset() {
        this.value = this.initValue;
        this.visited = false;
    }
}

export class FormInputState<K, M> implements FormModelType<M> {
    private readonly box: BoxValue<K>;
    private readonly model: FormModel<M>;

    private constructor(box: BoxValue<K>, model: FormModel<M>) {
        this.box = box;
        this.model = model;
    }

    public static create<K>(value: K): FormInputState<K, K> {
        const box = new BoxValue(value);
        const model = new FormModel([box], (): Result<K> => {
            return {
                type: 'ok',
                value: box.value
            };
        });

        return new FormInputState(box, model);
    }

    @action public setValue(value: K) {
        this.box.value = value;
    }

    @computed public get value(): K {
        return this.box.value;
    }

    public get isVisited(): boolean {
        return this.box.visited;
    }

    /**
     * @deprecated
     */
     public toModel(): FormModel<M> {
        return this.model;
    }

    public map<M2>(conv: (value: M) => Result<M2>): FormInputState<K, M2> {
        const model2 = new FormModel([this.box], (): Result<M2> => {
            const current = this.model.result;

            if (current.type === 'ok') {
                return conv(current.value);
            }

            return current;
        });

        return new FormInputState(this.box, model2);
    }

    //implements FormModelType

    public get errors(): Array<string> {
        return this.model.errors;
    }

    public get result(): Result<M> {
        return this.model.result;
    }

    @action public setAsVisited() {
        this.model.setAsVisited();
    }

    @action public reset() {
        this.model.reset;
    }
}
