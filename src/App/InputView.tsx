import * as React from 'react';
import { FormInputState } from '../Form';
import { observer } from 'mobx-react';

interface InputViewPropsType {
    input: FormInputState<string>,
}

@observer
export class InputView extends React.Component<InputViewPropsType> {
    render() {
        const { input } = this.props;
        return (
            <input
                value={input.value}
                onChange={this.onChange}
                onBlur={this.onBlur}
            />
        )
    }

    onChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.props.input.setValue(event.currentTarget.value);
    }

    onBlur = () => {
        this.props.input.setAsVisited();
    }
}
