import * as React from 'react';
import { FormInputState } from 'src/Form/FormInputState';
import { observer } from 'mobx-react';

export interface OptionType<T> {
    label: string,
    value: T
}

interface OptionItemPropsType<T> {
    //state: FormInputState<T>,
    value: T,
    label: string,
}

@observer
class OptionItem<T> extends React.Component<OptionItemPropsType<T>> {
    render() {
        const { value, label } = this.props;

        return (
            <option /*onClick={this.onClick}*/ value={JSON.stringify(value)}>
                { label }
            </option>
        );
    }

    /*onClick = (e: React.SyntheticEvent) => {
        e.stopPropagation();
        this.props.state.setValue(this.props.value);
    }*/
}

interface PropsType<T> {
    state: FormInputState<T, unknown>,
    options: Array<OptionType<T>>
}

@observer
export class SelectView<T> extends React.Component<PropsType<T>> {
    render() {
        const { options, state } = this.props;
        const value = JSON.stringify(state.value);                              //Hack

        return (
            <select value={value} onChange={this.onChange}>
                { options.map((item: OptionType<T>) => {
                    //const { state } = this.props;
                    const { value, label } = item;

                    return (
                        <OptionItem
                            key={label}
                            //state={state}
                            value={value}
                            label={label}
                        />
                    );
                }) }
            </select>
        );
    }

    onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectValue: T = JSON.parse(e.currentTarget.value);               //Hack

        this.props.state.setValue(selectValue);
        //console.info('onChange');
    }
}
