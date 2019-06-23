import { FormModel } from "./FormModel";
import { FormInputState } from "./FormInputState";
import { Result, ResultValue, ResultLoading, ResultError, ConversionFn } from "./type";
import { FormGroupArray } from "./FormGroupArray";

type FormBox<K> = FormInputState<K> | FormModel<K>;
export type FormRecordBox = Record<string, FormBox<unknown>>;

export type Model<T extends FormRecordBox> = {
    readonly [P in keyof T]:
        T[P] extends FormInputState<infer O1> ? O1 :
        T[P] extends FormModel<infer O2> ? O2 :
        never;
}

const muteError = (error: ResultError | ResultLoading): ResultError | ResultLoading => {
    if (error instanceof ResultError) {
        return new ResultError(error.message, false);
    }

    return error;
};

export const group = <IN extends FormRecordBox>(fields: IN): FormModel<Model<IN>> => {

    const fieldsValules: Array<FormBox<unknown>> = [];
    for (const item of Object.values(fields)) {
        fieldsValules.push(item);
    }

    return new FormModel(
        new FormGroupArray(fieldsValules),
        (): Result<Model<IN>> => {
            //@ts-ignore
            const modelOut: Model<IN> = {};
    
            for (const [key, item] of Object.entries(fields)) {
    
                if (item instanceof FormInputState) {
    
                    const value = item.value;
                    //@ts-ignore
                    modelOut[key] = value;
    
                } else {
                    const value = item.result;
                    if (value instanceof ResultValue) {
                        const innerValue = value.value;
                        //@ts-ignore
                        modelOut[key] = innerValue;
                    } else {
                        return muteError(value);
                    }
                }
            }

            return new ResultValue(modelOut);
        }
    );
};

export const groupArray = <C>(fields: ReadonlyArray<FormBox<C>>): FormModel<Array<C>> => {
    return new FormModel(
        new FormGroupArray(fields),
        (): Result<Array<C>> => {

            const modelOut: Array<C> = [];
        
            for (const item of fields) {
                if (item instanceof FormInputState) {
                    modelOut.push(item.value);
    
                } else {
                    const value = item.result;
                    if (value instanceof ResultValue) {
                        modelOut.push(value.value);
                    } else {
                        return muteError(value);
                    }
                }
            }

            return new ResultValue(modelOut);
        }
    );
};

export const input = <T>(value: T, isVisited: boolean = false): FormInputState<T> => {
    return new FormInputState(value, isVisited);
};

export {
    FormInputState,
    FormModel,
    Result,
    ResultValue,
    ResultLoading,
    ResultError,
    ConversionFn
}