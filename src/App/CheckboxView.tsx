import * as React from 'react';
import { FormInputState } from '../Form';
import { observer } from 'mobx-react';

interface PropsType {
    state: FormInputState<boolean>,
}

@observer
export class CheckboxView extends React.Component<PropsType> {
    render() {
        const { state } = this.props;
        return (
            <input
                type="checkbox"
                checked={state.value}
                onClick={this.onClick}
                onBlur={this.onBlur}
                onChange={this.onChange}
            />
        )
    }

    onClick = () => {
        const { state } = this.props;
        state.setValue(!state.value);
    }

    onBlur = () => {
        this.props.state.setAsVisited();
    }

    onChange = () => {}
}
