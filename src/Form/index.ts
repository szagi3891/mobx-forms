import { FormGroup, Model } from "./FormGroup";
import { FormModel } from "./FormModel";
import { FormInputState } from "./FormInputState";

export const input = <T>(value: T): FormInputState<T> => {
    return new FormInputState(value);
}

export const group = <M>(value: M): FormModel<Model<M>> => {
    return new FormModel(new FormGroup(value))
}

export {
    FormInputState,
    FormModel
}