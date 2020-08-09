
import React from 'react';


class JobForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            instructions: ''
        }
    }

    render() {
        return (
            <div style={{
                backgroundColor: 'var(--base01)',
                padding: 5,
                marginTop: 10,
                marginBottom: 10
            }}>
                <h2>New Job:</h2>
                <form onSubmit={(evt) => {
                    fetch(`http://localhost:5000/add_job?instructions=${encodeURIComponent(this.state.instructions)}`);
                    evt.preventDefault();
                }}>
                    <input type="text" placeholder="Instructions" onChange={(e) => { this.setState({ instructions: e.target.value }) }} value={this.state.instructions} />
                    <input type="submit" value="Submit"></input>
                </form>
            </div>
        );
    }
}


function Job(jid, instructions, status, timestamp) {
    const status_colors = {
        todo: 'var(--base0B)',
        done: 'var(--base0E)',
        error: 'var(--base08)',
        cancelled: 'var(--base08)',
        in_progress: 'var(--base0A)',
    }
    return (
        <tr key={jid}>
            <td style={{ ...styles.table_cell, color: 'var(--base0D)' }}>{jid}</td>
            <td style={{ ...styles.table_cell, color: 'var(--base05)' }}>{instructions}</td>
            <td style={{ ...styles.table_cell, color: status_colors[status] }}>{status}</td>
            <td style={{ ...styles.table_cell, color: 'var(--base05)' }}>{timestamp}</td>

            <td>
                {status == 'todo' ?
                    <input style={{ width: 75, color: 'var(--base08)' }} type="button" value="Cancel" onClick={() => {
                        fetch(`http://localhost:5000/cancel_job/${jid}`);
                    }}></input> :
                    <input style={{ width: 75, color: 'var(--base0D)' }} type="button" value="Clone" onClick={() => {
                        fetch(`http://localhost:5000/add_job?instructions=${encodeURIComponent(instructions)}`);
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
        fetch(`http://localhost:5000/all_jobs`).then(response => response.json()).then(data => this.setState({ data }));
    }

    render() {
        return (
            <div>
                <h1>Jobs</h1>
                <JobForm></JobForm>
                {this.state.data === undefined ? <div>Loading Jobs...</div> :
                    <table style={{
                        borderCollapse: 'collapse',
                        backgroundColor: 'var(--base01)',
                        width: '100%'
                    }}>
                        <thead style={{
                            color: 'var(--base04)',
                            textAlign: 'left',
                        }}>
                            <tr>
                                <th style={styles.table_cell}>ID</th>
                                <th style={styles.table_cell}>Instructions</th>
                                <th style={styles.table_cell}>Status</th>
                                <th style={styles.table_cell}>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>{this.state.data.map((x) => Job(x.job_id, x.instructions, x.status, x.timestamp))}</tbody>
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
