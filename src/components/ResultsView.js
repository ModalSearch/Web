import React from 'react';
import SchemaControls from './SchemaControls';
import Result from './Result';

export default class ResultsView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeSchema: props.schema,
            // baseSchema: props.schema
        };
    }

    render() {
        const { schema, data, theme } = this.props;
        const {activeSchema} = this.state;
        const baseSchema = this.props.schema;
        console.log('BASE SCHEMA:', baseSchema);
        return (
            <div style={{
                height: '100%',
                padding: 10,
            }}>
                <SchemaControls baseSchema={baseSchema} activeSchema={activeSchema}/>
            </div>
        );
    }
}


