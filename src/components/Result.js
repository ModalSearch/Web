import React from 'react';

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
                    {schema.required.map(prop_name => {
                        return (
                            <tr key={prop_name}>
                                <td style={{color: theme.base04}}>
                                    {prop_name}
                                </td>
                                <td style={{color: theme.base05}}>
                                    {JSON.stringify(item.data[prop_name])}
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
