
import React from 'react';
import Inspector from 'react-json-inspector';
// import '../styles/json_inspector.css';
import ReactJson from 'react-json-view'
// import JSONTree from 'react-json-tree'

function DataItem(data_obj, theme) {
    const { data_id, timestamp, url, json_data } = data_obj;
    return (
        <div key={data_id} style={{
            backgroundColor: theme.base01,
            padding: 10,
            color: theme.base05,
            border: 'solid 1px',
            borderColor: theme.base02,
            borderBottom: 'none',
            borderCollapse: 'collapse'
        }}>
            <div>
                <a aria-label="id" style={{color: theme.base0D, textDecoration: 'none'}} href={`/q?query=data_id = ${data_id}`}>@{data_id}</a><br />
                <span aria-label="timestamp">{timestamp}</span><br />
                <a aria-label="url" href={`/q?query=url = '${url}'`}>{url}</a>
            </div>
            <div style={{
                padding: 10,
                backgroundColor: theme.base00,
                overflow: "hidden"
            }}>
                <ReactJson name={false} enableClipboard={false} theme={theme} src={json_data}/>
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
                {props.data.map((x) => DataItem(x, props.theme))}
            </div>
        );
}