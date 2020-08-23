import React from 'react';
import Result from './Result';

import Annotations from './Annotations';
import CollapsedResult from './CollapsedResult';

const ResultsView = ({ data, theme }) => {
    if (data === undefined || data.length === 0) {
        return <div>Connecting...</div>
    }
    const annotation_elem = <Annotations data={data.annotation} theme={theme}></Annotations>
    let body = undefined;

    if (data.type === 'terminal') {
        let body_data = data.data.slice(0,20);
        body = body_data.map((item, idx) => {
            if (item.type === 'abstract') {
                return <CollapsedResult data={item.data} theme={theme}/>
            }
            return (
                <div key={`item${idx}`} style={{
                    paddingTop: idx === 0 ? 5 : 0,
                    paddingBottom: 5,
                    // borderLeft: 'solid 1px',
                    borderTop: 'solid 1px',
                    borderColor: theme.base00,
                    paddingLeft: 5,
                    backgroundColor: theme.base01}}>
                    <Result timestamp={item.timestamp} source={item.id} data={item.data} theme={theme}></Result>
                </div>
            );
        });

    } else if (data.type === 'node') {
        let ms = data.members.slice(0, 20);
        body = ms.map((item, idx) => {
                        return (
                            <div key={`item${idx}`} style={{backgroundColor: theme.base00, paddingTop: 5, paddingLeft: 5, borderRadius: 3, paddingBottom: idx === ms.length - 1 ? 0 : 5}}>
                                <ResultsView data={item} theme={theme}></ResultsView>
                            </div>
                        );
                    });
    } else {
        throw Error('Unknown item type in results view! Input data:', data)
    }

    return (
        <div style={{
            backgroundColor: theme.base01,
            // paddingBottom: 10,
            borderLeft: 'solid 1px',
            borderColor: theme.base01,
            flex: 1,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
            overflow: 'hidden'
        }}>
            {annotation_elem}
            <div style={{
                // paddingBottom: 5,
                // paddingLeft: 5,
                backgroundColor: theme.base00,
            }}>
                {body}
            </div>
        </div>
    );
}

export default ResultsView;

