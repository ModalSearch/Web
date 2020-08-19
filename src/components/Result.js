import React from 'react';
import ReactJson from 'react-json-view'


const format_item_value = (value, theme) => {
    console.log('>>>', value);
    if (typeof value === 'string') {
        return <span style={{color: theme.base0B}}>{value}</span>
    } else if (value instanceof Number) {
        return <span style={{color: theme.base09}}>{value}</span>
    } else if (value instanceof Array) {
        return <span><pre style={{whiteSpace: 'normal', color: theme.base0C}}>{JSON.stringify(value)}</pre></span>
    }
};


const Result = ({item, theme, schema}) => {
    return (
        <div style={{
            backgroundColor: theme.base01,
            padding: 10,
            marginBottom: 10,
            display: 'flex',
            flexWrap: 'wrap',
            border: 'solid 1px',
            borderColor: theme.base00,
            borderRadius: 3,
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
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
            <table style={{display: 'flex'}}>
                <tbody>
                    {Object.keys(schema.properties).map(prop_name => {
                        console.log(item.data[prop_name]);
                        return (
                            <tr key={prop_name} style={{padding: 0, maxHeight: 300, overflow: 'scroll' }}>
                                <td style={{color: theme.base04}}>
                                    {prop_name}
                                </td>
                                <td style={{minWidth: 10, wordBreak: 'break-word'}}>
                                    {format_item_value(item.data[prop_name], theme)}
                                    {/* <JSONPretty id="json-pretty" data={item.data[prop_name]}></JSONPretty> */}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <span style={{alignSelf: 'flex-end', whiteSpace: 'nowrap', minWidth: 300, flex: 1, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                <a style={{color: theme.base09, textOverflow: 'ellipsis'}} href={`/?q=${item.source}`}>{item.source}</a>
            </span>
        </div>
    );
}

export default Result;
