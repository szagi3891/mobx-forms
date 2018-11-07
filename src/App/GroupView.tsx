import * as React from 'react';
import { observer } from "mobx-react";
import { FormModel, FormInputState } from '../Form';

import styled from 'react-emotion';
import { ResultValue } from '../Form/type';

interface WrapperPropsType {
    error: boolean,
}

const Wrapper = styled('div')<WrapperPropsType>`
    border: 1px solid ${props => props.error ? 'red' : '#e0e0e0'};
    padding: 5px;
    margin-bottom: 5px;
`;

const ErrorWrapper = styled('div')`
    color: red;
    font-weight: bold;
`;

interface GroupViewPropsType<T> {
    label: string,
    group: FormModel<T> | FormInputState<T>,
    children: React.ReactNode,
}

@observer
export class GroupView<T> extends React.Component<GroupViewPropsType<T>> {
    render() {
        const { label, children } = this.props;

        return (
            <Wrapper error={this.hasError()}>
                <div>{label}</div>
                { children }
                { this.renderError() }
                { this.renderValue() }
            </Wrapper>
        );
    }

    hasError(): boolean {
        const { group } = this.props;
        if (group instanceof FormModel) {
            const error = group.errorMessage;
            return error !== null;
        }

        return false;
    }

    renderError() {
        const { group } = this.props;

        if (group instanceof FormModel) {
            const error = group.errorMessage;

            if (error === null) {
                return null;
            }

            return (
                <ErrorWrapper>{error}</ErrorWrapper>
            );
        }

        return null;
    }

    renderValue() {
        const valueModel = this.props.group.value;

        if (valueModel instanceof ResultValue) {
            return (
                <pre>
                    { JSON.stringify(valueModel.value) }
                </pre>
            );
        }

        return null;
    }
}
