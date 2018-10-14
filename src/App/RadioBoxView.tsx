import * as React from 'react';
import { FormInputState } from 'Form';
import { observer } from 'mobx-react';

interface PropsType<T> {
    state: FormInputState<T>,
    value: T,
}

@observer
export class RadioBoxView<T> extends React.Component<PropsType<T>> {
    render() {
        const { state, value } = this.props;
        const checked = state.valueView === value;

        return (
            <input type="radio" checked={checked} onClick={this.onClick} onChange={this.onChange} />
        );
    }

    onChange = () => {}

    onClick = () => {
        const { state, value } = this.props;
        state.setValue(value);
    }
}

