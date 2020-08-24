import React from 'react';
import Result from './Result';
import Annotations from './Annotations';
import moment from 'moment';


function pretty_date(timestamp) {
    // const curr_time = new
    const curr_time = moment(new Date().getTime());
    const ts = moment(new Date(timestamp));
    return ts.from(curr_time);
}


function Prop_val_list({ values, theme }) {
    let parsed = values.map(v => [v[0], Date.parse(v[1])]);
    parsed.sort((a, b) => b[1] - a[1]);
    console.log('PARSED:', parsed);
    let last_val = null;
    return (
        parsed.map(val_and_time => {
            const val = JSON.stringify(val_and_time[0]);
            const timestamp = val_and_time[1];
            if (val !== last_val) {
                last_val = val;
                return (
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <span style={{
                            color: theme.base0B,
                            textAlign: 'left'
                        }}>
                            {val}
                        </span>
                        <span style={{
                            paddingLeft: 10,
                            whiteSpace: 'nowrap',
                            color: theme.base03,
                            textAlign: 'right',
                        }}>
                            {pretty_date(timestamp)}
                        </span>
                    </div>
                );
            } else {
                return null;
            }
        })
    );
}


export default class CollapsedResult extends React.Component {

    render() {
        const { data, theme } = this.props;
        return (
            <div style={{
                padding: 5,
                backgroundColor: theme.base01,
                flex: 1,
            }}>
                <table style={{width: '100%', flex: 1}}>
                    {Object.keys(data).map(prop_name => {
                        return (
                            <tr style={{
                                verticalAlign: 'top',
                            }}>
                                <td style={{ width: 0.1, whiteSpace: 'nowrap' }}>{prop_name}</td>
                                <td style={{display: 'block', width: '100%'}}>
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