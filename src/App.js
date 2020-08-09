import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, useLocation, useHistory } from "react-router-dom";
import queryString from 'query-string';

import JobsView from './components/JobsView';
import QueryView from './components/QueryView';


class App extends React.Component {

    constructor(props) {
        super(props);
        console.log(window.location.href);
        this.state = {
            api_url: window.location.href.startsWith('http://localhost') ? 'http://localhost:5000' : 'https://modalsearchlb-2065190492.us-west-2.elb.amazonaws.com'
        };

    }

    render() {
        const { api_url } = this.state;
    
        return (
            <div className="App">
                <div style={{
                    paddingBottom: 10,
                    fontSize: 22,
                    width: '100%',
                    display: 'inline-flex'
                }}>
                    <span style={{
                        flex: 1,
                        color: 'var(--base03)',
                        fontSize: 14
                    }}>
                        Endpoint: <a href={api_url} style={{color: 'var(--base03)'}}>{api_url}</a>
                    </span>
                    <span style={{
                        textAlign: 'right',
                    }}>
                        <a href='/q?query=true' style={styles.headerLink}>All Data</a>
                        <a href='/jobs' style={styles.headerLink}>Jobs</a>
                    </span>
                </div>
                <Router>
                    <Route path="/" exact render={() => <div>Home page</div>} />
                    <Route path="/q" render={() => <QueryView api_url={api_url}/>} />
                    <Route path="/jobs" exact render={() => <JobsView api_url={api_url}/>} />
                </Router>
            </div>
        );
    }
}

const styles = {
    headerLink: {
        marginRight: 20,
    }
}

export default App;
