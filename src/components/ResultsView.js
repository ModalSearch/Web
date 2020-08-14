import React from 'react';
import SchemaControls from './SchemaControls';
import Result from './Result';

export default class ResultsView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // activeSchema: props.schema
            activeSchema: JSON.parse(JSON.stringify(props.schema))
        };
    }

    render() {
        const { schema, data, theme } = this.props;
        const { activeSchema } = this.state;
        return (
            <div style={{
                height: '100%',
                padding: 10,
            }}>
                <SchemaControls
                    baseSchema={schema}
                    activeSchema={activeSchema}
                    theme={theme}
                    onChange={(e) => {
                        if (e.target.checked) {
                            let newSchema = activeSchema;
                            newSchema.properties[e.target.name] = schema.properties[e.target.name];
                            newSchema.required.push(e.target.name);
                            this.setState({
                                activeSchema: newSchema
                            });
                        } else {
                            let newSchema = activeSchema;
                            delete newSchema.properties[e.target.name];
                            console.log('>>>', schema);
                            newSchema.required = newSchema.required.filter(x => x !== e.target.name);
                            this.setState({
                                activeSchema: newSchema
                            });
                        }
                    }}/>
                {data.map((item) => <Result key={item.id} item={item} theme={theme} schema={activeSchema}></Result>)}
            </div>
        );
    }
}


