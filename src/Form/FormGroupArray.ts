import { FormModel } from "./FormModel";
import { action, computed } from "mobx";
import { FormInputState } from ".";

type FormBox<K> = FormInputState<K> | FormModel<K>;

export class FormGroupArray<K> {

    readonly fields: ReadonlyArray<FormBox<K>>;

    constructor(fields: ReadonlyArray<FormBox<K>>) {
        this.fields = fields;
    }

    @action setAsVisited() {
        for (const item of this.fields) {
            item.setAsVisited();
        }
    }

    @action reset() {
        for (const item of this.fields) {
            item.reset();
        }
    }

    @computed get modifiedStatus(): boolean {
        for (const item of this.fields) {
            if (item.modifiedStatus) {
                return true;
            }
        }

        return false;
    }

    @computed get isVisited(): boolean {
                                                    //wszystkie musza być odwiedzone żeby ta grupa była traktowana jako odwiedzona
        for (const item of this.fields) {
            if (item.isVisited === false) {
                return false;
            }
        }

        return true;
    }
}
