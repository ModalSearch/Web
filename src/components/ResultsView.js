import React from 'react';
import SchemaControls from './SchemaControls';
import Result from './Result';
import Annotations from './Annotations';

const ResultsView = ({ data, theme }) => {
    if (data === undefined || data.length === 0) {
        return <div>Connecting...</div>
    }

    const annotation_elem = <Annotations data={data.annotation} theme={theme}></Annotations>
    let body = undefined;

    if (data.type === 'terminal') {
        body = data.data.slice(0,20).map((item, idx) => <Result key={`item${idx}`} source={item.id} timestamp={item.timestamp} key={item.id} data={item.data} theme={theme}></Result>);

    } else if (data.type === 'node') {
        body = data.members.slice(0, 20).map((item, idx) => {
                        return (
                            <div key={`item${idx}`}>
                                <ResultsView data={item} theme={theme}></ResultsView>
                            </div>
                        );
                    });
    } else {
        throw Error('Unknown item type in results view! Input data:', data)
    }

    return (
        <div style={{
            flex: 1,
            backgroundColor: theme.base01,
            borderLeft: 'solid 1px',
            borderColor: theme.base03,
        }}>
            {annotation_elem}
            <div style={{
                paddingTop: 5,
                paddingBottom: 5,
                paddingLeft: 10,
                backgroundColor: theme.base00
            }}>
                {body}
            </div>
        </div>
    );
}

export default ResultsView;

