import React from 'react';
import ReactJson from 'react-json-view'


const format_item_value = (value, theme) => {
    console.log('>>>', value);
    if (typeof value === 'string') {
        return <span style={{color: theme.base0B}}>{value}</span>
    } else if (value instanceof Number) {
        return <span style={{color: theme.base09}}>{value}</span>
    } else if (value instanceof Array) {
        return <span><pre style={{color: theme.base0C}}>{JSON.stringify(value)}</pre></span>
    }
};


const Result = ({item, theme, schema}) => {
    return (
        <div style={{
            backgroundColor: theme.base01,
            padding: 5,
            marginBottom: 10
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <span style={{
                    color: theme.base0D
                }}>
                    @{item.id}
                </span>
                <span style={{
                    color: theme.base03
                }}>
                    {item.timestamp}
                </span>
            </div>
            <table>
                <tbody>
                    {Object.keys(schema.properties).map(prop_name => {
                        console.log(item.data[prop_name]);
                        return (
                            <tr key={prop_name}>
                                <td style={{color: theme.base04}}>
                                    {prop_name}
                                </td>
                                <td>
                                    {format_item_value(item.data[prop_name], theme)}
                                    {/* <JSONPretty id="json-pretty" data={item.data[prop_name]}></JSONPretty> */}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default Result;
