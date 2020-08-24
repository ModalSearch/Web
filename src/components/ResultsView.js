import React from 'react';
import Result from './Result';

import Annotations from './Annotations';
import CollapsedResult from './CollapsedResult';

const ResultsView = ({ data, theme }) => {
    if (data === undefined || data.length === 0) {
        return <div>Connecting...</div>
    }
    let annotation_elem = <Annotations data={data.annotation} theme={theme}></Annotations>
    let body = undefined;

    if (data.type === 'terminal') {

        
        let body_data = data.data.slice(0, 300);
        body = body_data.map((item, idx) => {
            let result_elem = undefined;
            
            if (item.type === 'abstract') {
                annotation_elem = null;
                let anno_elem = <Annotations data={data.annotation.slice(1)} theme={theme}></Annotations>
                result_elem = <CollapsedResult data={item.data} anno={anno_elem} relkey={data.key} theme={theme}></CollapsedResult>;
            } else if (item.type === 'item') {
                result_elem = <Result timestamp={item.timestamp} source={item.id} data={item.data} theme={theme}></Result>;
            }
            return (
                <div key={`item${idx}`} style={{
                    borderTop: 'solid 1px',
                    borderColor: item.type === 'abstract' ? theme.base00 : theme.base00,
                    borderRadius: item.type === 'abstract' ? 5 : 3,
                    padding: item.type === 'abstract' ? 0 : 5,
                    display: 'flex',
                
                    // border: 'solid 1px',
                    // borderColor: theme.base02,
                    backgroundColor: theme.base01}}>
                        {result_elem}
                </div>
            );
        });

    } else if (data.type === 'node') {
        let ms = data.members.slice(0, 150);
        body = ms.map((item, idx) => {
                        return (
                            <div key={`item${idx}`}
                                style={{
                                    backgroundColor: theme.base00,
                                    paddingTop: 5,
                                    paddingLeft: 5,
                                    borderRadius: 3,
                                    paddingBottom: idx === ms.length - 1 ? 5 : 0}}>
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
            // borderLeft: 'solid 2px',
            borderColor: data.type !== 'terminal' ? theme.base01 : theme.base00,
            flex: 1,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
            overflow: 'hidden'
        }}>
            {annotation_elem}
            <div style={{
                backgroundColor: theme.base00,
            }}>
                {body}
            </div>
        </div>
    );
}

export default ResultsView;

