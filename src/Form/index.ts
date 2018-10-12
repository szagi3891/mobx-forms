import { FormGroup, Model } from "./FormGroup";
import { FormGroupModel } from "./FormGroupModel";
import { FormInputState } from "./FormInputState";

export const input = <T>(value: T): FormInputState<T> => {
    return new FormInputState(value);
}

export const group = <M>(value: M): FormGroupModel<Model<M>> => {
    return new FormGroupModel(new FormGroup(value))
}

export {
    FormInputState,
    FormGroupModel
}