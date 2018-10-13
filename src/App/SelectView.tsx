import * as React from 'react';
import { FormInputState } from 'Form';
import { observer } from 'mobx-react';

export interface OptionType<T> {
    label: string,
    value: T,
}

interface PropsType<T> {
    state: FormInputState<T>,
    options: Array<OptionType<T>>,
    serialize: (value: T) => string,
    deserialize: (value: string) => T,
}

@observer
export class SelectView<T> extends React.Component<PropsType<T>> {
    render() {
        const { state, options, serialize } = this.props;

        return (
            <select value={serialize(state.valueView)} onChange={this.handleChange}>
                { options.map(this.renderItem) }
            </select>
        );
    }

    handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { state, deserialize } = this.props;
        const valueSerialize = event.currentTarget.value;
        const value = deserialize(valueSerialize);
        state.setValue(value);
    }

    private renderItem = (item: OptionType<T>) => {
        const { serialize } = this.props;
        const valueString = serialize(item.value);

        return (
            <option key={valueString} value={valueString}>
                { item.label }
            </option>
        );
    }
}