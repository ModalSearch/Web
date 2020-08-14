
import React from 'react';


let api_url = window.apiurl ? window.apiurl : 'http://localhost:5000'
window.api_url = api_url;


class JobForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            instructions: ''
        }
    }

    render() {
        const { theme } = this.props;
        return (
            <div style={{
                backgroundColor: 'var(--base01)',
                padding: 5,
                marginTop: 10,
                marginBottom: 10,
                display: 'flex',
                flexWrap: 'wrap'
            }}>
                <h2 style={{width: '100%' }}>New Job:</h2>
                <form style={{flex: 1,
                    backgroundColor: theme.base02,
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around'
                }} onSubmit={(evt) => {
                    fetch(`${this.props.api_url}/jobs/add?instructions=${encodeURIComponent(this.state.instructions)}`);
                    evt.preventDefault();
                }}>
                    <input style={{
                            flex: 10,
                            padding: 10,
                            width: '100%',
                            minWidth: 400,
                            display: 'block',
                            backgroundColor: theme.base01,
                            border: 'solid 1px',
                            borderColor: theme.base03,
                            fontSize: 16,
                            color: theme.base05
                        }}
                            type="text" placeholder="Instructions" onChange={(e) => { this.setState({ instructions: e.target.value }) }} value={this.state.instructions} />
                    <input style={{
                        flex: 1,
                        width: 75,
                        maxWidth: 500,
                        // margin: 10,
                        padding: 5,
                        // height: 30,
                        backgroundColor: theme.base00,
                        fontSize: 16,
                        color: theme.base05,
                        border: 'solid 1px',
                        borderColor: theme.base03
                        }} type="submit" value="Submit"></input>
                </form>
            </div>
        );
    }
}


function Job(jid, instructions, status, timestamp, theme) {
    const status_colors = {
        todo: theme.base0B,
        done: theme.base0E,
        error: theme.base08,
        cancelled: theme.base0F,
        in_progress: theme.base0A,
    }
    return (
        <tr key={jid}>
            <td style={{ ...styles.table_cell, color: theme.base0D }}>{jid}</td>
            <td style={{ ...styles.table_cell, color: theme.base05 }}>{instructions}</td>
            <td style={{ ...styles.table_cell, color: status_colors[status] }}>{status}</td>
            <td style={{ ...styles.table_cell, color: theme.base05 }}>{timestamp}</td>

            <td>
                {status === 'todo' ?
                    <input style={{ width: 75, color: theme.base08 }} type="button" value="Cancel" onClick={() => {
                        fetch(`${window.api_url}/jobs/cancel/${jid}`);
                    }}></input> :
                    <input style={{ width: 75, color: theme.base0D }} type="button" value="Clone" onClick={() => {
                        fetch(`${window.api_url}/jobs/add?instructions=${encodeURIComponent(instructions)}`);
                    }}></input>
                }
            </td>

        </tr>
    );
}


export default class JobsView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: undefined
        };
    }

    componentDidMount() {
        fetch(`${this.props.api_url}/jobs/all/50`).then(response => response.json()).then(data => this.setState({ data }));
    }

    render() {
        const {theme} = this.props;
        return (
            <div>
                <h1>Jobs</h1>
                <JobForm theme={theme} api_url={this.props.api_url}></JobForm>
                {this.state.data === undefined ? <div>Loading Jobs...</div> :
                    <table style={{
                        borderCollapse: 'collapse',
                        backgroundColor: theme.base01,
                        width: '100%'
                    }}>
                        <thead style={{
                            color: theme.base04,
                            textAlign: 'left',
                        }}>
                            <tr>
                                <th style={styles.table_cell}>ID</th>
                                <th style={styles.table_cell}>Instructions</th>
                                <th style={styles.table_cell}>Status</th>
                                <th style={styles.table_cell}>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>{this.state.data.map((x) => Job(x.job_id, x.instructions, x.status, x.timestamp, theme))}</tbody>
                    </table>
                }
            </div>
        );
    }
}

const styles = {
    table_cell: {
        padding: 10
    }
}
