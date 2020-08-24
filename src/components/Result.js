import React from 'react';
import { BsBoxArrowUpRight } from 'react-icons/bs';

const format_item_value = (value, theme) => {
    if (typeof value === 'string') {
        return <span style={{color: theme.base0B}}>{value}</span>
    } else if (value instanceof Number) {
        return <span style={{color: theme.base09}}>{value}</span>
    } else if (value instanceof Array) {
        return <span><pre style={{whiteSpace: 'normal', color: theme.base0C}}>{JSON.stringify(value)}</pre></span>
    }
};


const Result = ({timestamp, source, data, theme}) => {
    return (
        <div style={{
            backgroundColor: theme.base00,
            padding: 5,
            marginRight: 10,
            marginBottom: 10,
            display: 'flex',
            flexWrap: 'wrap',
            // border: 'solid 1px',
            // borderColor: theme.base01,
            flex: 1,
            borderRadius: 3,
            transitionDuration: 1
        }}
        onClick={() => {
            console.log(source);
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                // flexDirection: 'row-reverse',
                width: '100%',
            }}>
                <span style={{
                    color: theme.base03
                }}>
                    {timestamp}
                </span>
                <span style={{
                    color: theme.base0D
                }}>
                    <a style={{color: theme.base09, textOverflow: 'ellipsis'}} href={`/?q=${source}`}><BsBoxArrowUpRight/></a>
                </span>

            </div>
            <table style={{display: 'flex'}}>
                <tbody>
                    {Object.keys(data).map(prop_name => {
                        return (
                            <tr key={prop_name} style={{padding: 0, maxHeight: 300, overflow: 'scroll' }}>
                                <td style={{color: theme.base04}}>
                                    {prop_name}
                                </td>
                                <td style={{minWidth: 10, wordBreak: 'break-word'}}>
                                    {format_item_value(data[prop_name], theme)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {/* <span style={{alignSelf: 'flex-end', whiteSpace: 'nowrap', minWidth: 300, flex: 1, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                <a style={{color: theme.base09, textOverflow: 'ellipsis'}} href={`/?q=${source}`}>view source</a>
            </span> */}
        </div>
    );
}

export default Result;
