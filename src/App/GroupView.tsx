import * as React from 'react';
import { observer } from "mobx-react";
import { FormModelType } from 'src/Form/FormModel';

import styled from '@emotion/styled';

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
    group: FormModelType<T>,
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
        const error = group.errors;
        return error.length > 0;
    }

    renderError() {
        const { group } = this.props;

        const error = group.errors;

        if (error === null) {
            return null;
        }

        return (
            <ErrorWrapper>{error}</ErrorWrapper>
        );
    }

    renderValue() {
        const valueModel = this.props.group.result.value;

        if (valueModel.type === 'ok') {
            return (
                <pre>
                    { JSON.stringify(valueModel.data) }
                </pre>
            );
        }

        return null;
    }
}
