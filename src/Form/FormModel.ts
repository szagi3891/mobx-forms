import { computed, action } from 'mobx';

type ResultType<T> = {
    type: 'ok',
    data: T
} | {
    type: 'error',
    message: 'loading' | Array<string>,
};

export class Result<T> {
    readonly value: ResultType<T>;

    constructor(value: ResultType<T>) {
        this.value = value;
    }

    public static createLoading = <K>(): Result<K> => new Result({
        type: 'error',
        message: 'loading',
    });

    public static createError<K>(value: string): Result<K> {
        return new Result({
            type: 'error',
            message: [value]
        });
    }

    public static createErrorList<K>(message: Array<string>): Result<K> {
        return new Result({
            type: 'error',
            message
        });
    }

    static createOk = <K>(data: K) => new Result({
        type: 'ok',
        data
    });

    public map<K>(convert: (value: T) => Result<K>): Result<K> {
        if (this.value.type === 'ok') {
            return convert(this.value.data);
        }

        return new Result(this.value);
    }

    public errors(): Array<string> {
        if (this.value.type === 'error') {
            const message = this.value.message;
            return message === 'loading' ? [] : message;
        }

        return [];
    }

    public muteErrors(): Result<T> {
        if (this.value.type === 'error') {
            const message = this.value.message;

            if (message === 'loading') {
                return Result.createLoading();
            }

            return Result.createErrorList([]);
        }

        return this;
    }
}


interface ChildType {
    isVisited: () => boolean,
    setAsVisited: () => void,
    reset: () => void,
}

export interface FormModelType<V> {
    get errors(): Array<string>;
    get result(): Result<V>;
    setAsVisited: () => void,
    isVisited: () => boolean,
    reset: () => void,
}

type FormRecordBox = Record<string, FormModelType<unknown>>;

type Model<T extends FormRecordBox> = {
    readonly [P in keyof T]:
        T[P] extends FormModelType<infer O>
            ? O
            : never;
}

const getErrors = <R>(items: Array<FormModelType<unknown>>): Result<R> => {
    const errors: Array<Array<string>> = [];

    for (const item of items) {
        const result = item.result;

        if (result.value.type === 'error') {
            const message = result.value.message;
            if (message === 'loading') {
                return Result.createLoading();
            }

            errors.push(message);
        }
    }

    const empty: Array<string> = [];
    const message: Array<string> = empty.concat(...errors);

    return Result.createErrorList(message);
};


export class FormModel<V> implements FormModelType<V> {
    private child: Array<ChildType>;
    private getValue: () => Result<V>

    public constructor(child: Array<ChildType>, getValue: () => Result<V>) {
        this.child = child;
        this.getValue = getValue;
    }

    public map<C>(conv: (value: V) => Result<C>): FormModel<C> {
        return new FormModel([this], (): Result<C> => this.getValue().map(conv));
    }

    @computed public get result(): Result<V> {
        const result = this.getValue();

        if (this.isVisited()) {
            return result;
        }

        return result.muteErrors();
    }

    @computed public get errors(): Array<string> {
        return this.result.errors();
    }

    @action public setAsVisited(): void {
        for (const child of this.child) {
            child.setAsVisited();
        }
    }

    public isVisited(): boolean {
        for (const item of this.child) {
            if (item.isVisited() === false) {
                return false;
            }
        }

        return true;
    }

    @action public reset(): void {
        for (const child of this.child) {
            child.reset();
        }
    }

    public static group = <IN extends FormRecordBox>(fields: IN): FormModel<Model<IN>> => {
        const fieldsValules: Array<FormModelType<unknown>> = [];

        for (const item of Object.values(fields)) {
            fieldsValules.push(item);
        }

        return new FormModel(
            fieldsValules,
            (): Result<Model<IN>> => {
                //@ts-expect-error
                const modelOut: Model<IN> = {};
        
                for (const [key, item] of Object.entries(fields)) {
                    const result = item.result;
                    if (result.value.type === 'ok') {
                        const innerValue = result.value.data;
                        //@ts-expect-error
                        modelOut[key] = innerValue;
                    } else {
                        return getErrors(fieldsValules);
                    }
                }

                return Result.createOk(modelOut);
            }
        );
    };

    public muteErrors(): FormModel<V> {
        return new FormModel([this], (): Result<V> => this.result.muteErrors());
    }
}

