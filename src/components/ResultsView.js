import React from 'react';
import SchemaControls from './SchemaControls';
import Result from './Result';


const ResultsView = ({ data, theme }) => {
    if (data === undefined || data.length === 0) {
        return <div>Connecting...</div>
    }

    if (data.type === 'terminal') {
        return (
            <div style={{ backgroundColor: theme.base01, flex: 1, marginTop: 10 }}>
                <div style={{ backgroundColor: theme.base02, padding: 5 }}>{data.annotation}</div>
                <div style={{ padding: 5 }}>
                    {data.data.map(item => <Result source={item.id} timestamp={item.timestamp} key={item.id} data={item.data} theme={theme}></Result>)}
                </div>
            </div>
        );

    }
    if (data.type === 'node') {

        return (
            <div style={{
                flex: 1,
                backgroundColor: theme.base01,
                paddingLeft: 10,
                paddingTop: 10
            }}>
                <span style={{
                    width: '100%',
                    flex: 1,
                    backgroundColor: theme.base02
                }}>
                    {data.annotation}
                </span>
                <div>
                    {data.members.map(item => {
                        return (
                            <div>
                                <ResultsView data={item} theme={theme}></ResultsView>

                            </div>
                        );
                    })}
                </div>
            </div>
        );
    } else {
        throw Error('Unknown item type in results view! Input data:', data)
    }
}

export default ResultsView;

