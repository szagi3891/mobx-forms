import { observable, computed, action } from 'mobx';
import { FormModel, FormModelType, Result } from './FormModel';

class BoxValue<K> {
    private readonly initValue: K;
    @observable public value: K;
    @observable private visited: boolean;

    public constructor(value: K) {
        this.initValue = value;
        this.value = value;
        this.visited = false;
    }

    @action public setAsVisited(): void {
        this.visited = true;
    }

    public isVisited(): boolean {
        return this.visited;
    }

    @action public reset(): void {
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

    public static new<K>(value: K): FormInputState<K, K> {
        const box = new BoxValue(value);
        const model = new FormModel(
            [box],
            (): Result<K> => Result.createOk(box.value)
        );

        return new FormInputState(box, model);
    }

    @action public setValue(value: K): void {
        this.box.value = value;
    }

    @computed public get value(): K {
        return this.box.value;
    }

    public isVisited(): boolean {
        return this.box.isVisited();
    }

    /**
     * @deprecated
     */
    public toModel(): FormModel<M> {
        return this.model;
    }

    public map<M2>(convert: (value: M) => Result<M2>): FormInputState<K, M2> {
        const model2 = new FormModel(
            [this.box],
            (): Result<M2> => this.model.result.map(convert)
        );

        return new FormInputState(this.box, model2);
    }

    //implements FormModelType
    public get result(): Result<M> {
        const result = this.model.result;

        if (this.box.isVisited()) {
            return result;
        }

        return result.muteErrors();
    }

    @computed public get errors(): Array<string> {
        return this.result.errors();
    }

    @action public setAsVisited(): void {
        this.model.setAsVisited();
    }

    @action public reset(): void {
        this.model.reset();
    }
}
