
import React from 'react';
import Inspector from 'react-json-inspector';
import '../styles/json_inspector.css';

function DataItem(data_obj) {
    const { data_id, timestamp, url, json_data } = data_obj;
    return (
        <div key={data_id} style={{
            // marginTop: 10,
            backgroundColor: 'var(--base01)',
            padding: 10,
            color: 'var(--base05)',
            border: 'solid 1px var(--base02)',
            borderBottom: 'none',
            borderCollapse: 'collapse'
        }}>
            <div>
                <a aria-label="id" style={{color: 'var(--base0D)', textDecoration: 'none'}} href={`/q?query=data_id = ${data_id}`}>@{data_id}</a><br />
                <span aria-label="timestamp">{timestamp}</span><br />
                <a aria-label="url" href={`/q?query=url = '${url}'`}>{url}</a>
            </div>
            <div style={{
                padding: 10,
                backgroundColor: 'var(--base00)',
                overflow: "hidden"
            }}>
                <Inspector data={json_data} search={false} />
            </div>
        </div>
    )
}


export default function ItemList (props) {

        if (props.data === undefined) {
            return <div>Loading Data</div>
        }
        return (
            <div>
                {props.data.map(DataItem)}
            </div>
        );
}