import * as React from 'react';
import { FormInputState } from 'src/Form/FormInputState';
import { observer } from 'mobx-react';

interface PropsType<T> {
    state: FormInputState<T, unknown>,
    value: T,
}

@observer
export class RadioBoxView<T> extends React.Component<PropsType<T>> {
    render() {
        const { state, value } = this.props;
        const checked = state.value === value;

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

