import * as React from 'react';
import { observer } from "mobx-react";
import { FormGroupModel } from '../Form';

interface GroupViewPropsType {
    label: string,
    group: FormGroupModel<any>,
    children: React.ReactNode,
}

@observer
export class GroupView extends React.Component<GroupViewPropsType> {
    render() {
        const { label, children } = this.props;

        return (
            <div style={{border: '1px solid black', padding: '5px', marginBottom: '5px'}}>
                <div>{label}</div>
                { children }
                { this.renderError() }
                { this.renderValue() }
            </div>
        );
    }

    renderError() {
        const { group } = this.props;

        const error = group.errorMessage;

        if (error === null) {
            return null;
        }

        return (
            <div style={{color: 'red', fontWeight: 'bold'}}>{error}</div>
        );
    }

    renderValue() {
        const aa = this.props.group.valueModel;

        if (aa instanceof Error) {
            return null;
        }

        return (
            <pre>
                { JSON.stringify(aa) }
            </pre>
        );
    }
}
