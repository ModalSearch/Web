import React from 'react';
import Result from './Result';
import Annotations from './Annotations';


function Prop_val_list({ values, theme }) {
    let parsed = values.map(v => [v[0], Date.parse(v[1])]);
    parsed.sort((a, b) => b[1] - a[1]);
    console.log('PARSED:', parsed);
    let last_val = null;
    return (
        parsed.map(val_and_time => {
            const val = val_and_time[0];
            const timestamp = val_and_time[1];
            if (val !== last_val) {
                last_val = val;
                return (<div style={{
                    color: theme.base0B,
                }}>{val}</div>);
            } else {
                return null;
            }
        })
    );
}


export default class CollapsedResult extends React.Component {

    render() {
        const { data, theme } = this.props;
        console.log('>>>', data);
        return (
            <div style={{
                margin: 5,
            }}>
                <h2>Abstract</h2>
                <table>
                    {Object.keys(data).map(prop_name => {
                        return (
                            <tr style={{
                                margin: 5,
                            }}>
                                <td style={{ color: theme.base04 }}>{prop_name}</td>
                                <td>
                                    <Prop_val_list values={data[prop_name]} theme={theme}></Prop_val_list>
                                </td>
                            </tr>
                        );
                    })}
                </table>
            </div>
        );
    }
}