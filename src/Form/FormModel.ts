import { computed, action } from 'mobx';

export type Result<T> = {
    type: 'ok',
    value: T
} | {
    type: 'loading',
} | {
    type: 'error',
    message: Array<string>,
};

export const createResultOk = <T>(value: T): Result<T> => ({
    type: 'ok',
    value: value
});

export const createResultLoading = <T>(): Result<T> => ({
    type: 'loading',
});

export const createResultError = <T>(message: string): Result<T> => ({
    type: 'error',
    message: [message]
});
interface ChildType {
    setAsVisited: () => void,
    reset: () => void,
}

export interface FormModelType<V> {
    get errors(): Array<string>;
    get result(): Result<V>;
    setAsVisited: () => void,
    reset: () => void,
}

type FormRecordBox = Record<string, FormModelType<unknown>>;

type Model<T extends FormRecordBox> = {
    readonly [P in keyof T]:
        T[P] extends FormModelType<infer O>
            ? O
            : never;
}

const hasLoading = (items: Array<FormModelType<unknown>>): boolean => {
    for (const item of items) {
        const value = item.result;
        if (value.type === 'loading') {
            return true;
        }
    }

    return false;
};

const getErrors = <R>(items: Array<FormModelType<unknown>>): Result<R> => {
    if (hasLoading(items)) {
        return {
            type: 'loading'
        };
    }

    const errors: Array<Array<string>> = [];

    for (const item of items) {
        errors.push(item.errors);
    }

    const empty: Array<string> = [];
    const message: Array<string> = empty.concat(...errors);

    return {
        type: 'error',
        message
    };
};


export class FormModel<V> implements FormModelType<V> {
    private child: Array<ChildType>;
    private getValue: () => Result<V>

    public constructor(child: Array<ChildType>, getValue: () => Result<V>) {
        this.child = child;
        this.getValue = getValue;
    }

    public map<C>(conv: (value: V) => Result<C>): FormModel<C> {
        return new FormModel([this], (): Result<C> => {
            const valueModel = this.getValue();
            if (valueModel.type === 'ok') {
                return conv(valueModel.value);
            }

            return valueModel;
        });
    }

    @computed public get errors(): Array<string> {
        const result = this.result;

        if (result.type === 'error') {
            return result.message;
        }
        return [];
    }

    @computed public get result(): Result<V> {
        return this.getValue();
    }

    @action public setAsVisited(): void {
        for (const child of this.child) {
            child.setAsVisited();
        }
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
                    const value = item.result;
                    if (value.type === 'ok') {
                        const innerValue = value.value;
                        //@ts-expect-error
                        modelOut[key] = innerValue;
                    } else {
                        return getErrors(fieldsValules);
                    }
                }

                return {
                    type: 'ok',
                    value: modelOut
                };
            }
        );
    };
}

