import { observable, computed, action } from 'mobx';
import { FormModel, FormModelType, Result } from './FormModel';

class BoxValue<K> {
    private readonly initValue: K;
    @observable private value: K;
    @observable private visited: boolean;

    public constructor(value: K) {
        this.initValue = value;
        this.value = value;
        this.visited = false;
    }

    public setValue(value: K): void {
        this.value = value;
    }

    public getValue(): K {
        return this.value;
    }

    @action public setAsVisited(): void {
        this.visited = true;
    }

    @action public isVisited(): boolean {
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
        const model = new FormModel([box], (): Result<K> => {
            return {
                type: 'ok',
                value: box.getValue()
            };
        });

        return new FormInputState(box, model);
    }

    @action public setValue(value: K): void {
        this.box.setValue(value);
    }

    @computed public get value(): K {
        return this.box.getValue();
    }

    public get isVisited(): boolean {
        return this.box.isVisited();
    }

    /**
     * @deprecated
     */
    public toModel(): FormModel<M> {
        return this.model;
    }

    public map<M2>(convert: (value: M) => Result<M2>): FormInputState<K, M2> {
        const model2 = new FormModel([this.box], (): Result<M2> => {
            const current = this.model.result;

            if (current.type === 'ok') {
                return convert(current.value);
            }

            return current;
        });

        return new FormInputState(this.box, model2);
    }

    //implements FormModelType
    public get result(): Result<M> {
        const result = this.model.result;

        if (result.type === 'error' && this.box.isVisited() == false) {
            return {
                type: 'error',
                message: []
            };
        }

        return result;
    }

    @computed public get errors(): Array<string> {
        const result = this.result;

        if (result.type === 'error') {
            return result.message;
        }
        return [];
    }

    @action public setAsVisited(): void {
        this.model.setAsVisited();
    }

    @action public reset(): void {
        this.model.reset();
    }
}
