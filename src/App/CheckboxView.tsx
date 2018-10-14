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
                checked={state.valueView}
                onClick={this.onClick}
                onBlur={this.onBlur}
                onChange={this.onChange}
            />
        )
    }

    onClick = () => {
        const { state } = this.props;
        state.setValue(!state.valueView);
    }

    onBlur = () => {
        this.props.state.setAsVisited();
    }

    onChange = () => {}
}
