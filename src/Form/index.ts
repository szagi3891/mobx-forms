import { FormGroup, Model } from "./FormGroup";
import { FormModel } from "./FormModel";
import { FormInputState } from "./FormInputState";
import { FormGroupArray } from "./FormGroupArray";

export const input = <T>(value: T, isVisited: boolean = false): FormInputState<T> => {
    return new FormInputState(value, isVisited);
};

export const group = <M>(value: M): FormModel<Model<M>> => {
    return FormGroup.create(value);
};

export const groupArray = <K>(value: Array<FormModel<K> | FormInputState<K>>): FormModel<Array<K>> => {
    return FormGroupArray.create(value);
};

export {
    FormInputState,
    FormModel
}