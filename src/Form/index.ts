import { InGroupType, FormGroup } from "./FormGroup";
import { FormGroupModel } from "./FormGroupModel";
import { FormInputState } from "./FormInputState";

export const input = <T>(value: T): FormInputState<T> => {
    return new FormInputState(value);
}

export const group = <M>(value: InGroupType<M>): FormGroupModel<M> => {
    return new FormGroupModel(new FormGroup(value))
}

export {
    FormInputState,
    FormGroupModel
}