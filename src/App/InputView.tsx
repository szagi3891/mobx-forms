import * as React from 'react';
import { FormInputState } from 'src/Form/FormInputState';
import { observer } from 'mobx-react';
import { GroupView } from './GroupView';

interface InputViewPropsType {
    label: string,
    input: FormInputState<string, unknown>,
}

@observer
export class InputView extends React.Component<InputViewPropsType> {
    render() {
        const { label, input } = this.props;
        return (
            <GroupView label={label} group={input}>
                <input
                    value={input.value}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                />
            </GroupView>
        )
    }

    onChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.props.input.setValue(event.currentTarget.value);
    }

    onBlur = () => {
        this.props.input.setAsVisited();
    }
}
