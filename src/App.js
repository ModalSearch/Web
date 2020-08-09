import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, useLocation, useHistory } from "react-router-dom";
import queryString from 'query-string';

import JobsView from './components/JobsView';
import QueryView from './components/QueryView';


function App() {
    return (
        <div className="App">
            <div style={{
                paddingBottom: 10,
                textAlign: 'right',
                fontSize: 22
            }}>
                <a href='/q?query=true' style={styles.headerLink}>All Data</a>
                <a href='/jobs' style={styles.headerLink}>Jobs</a>
            </div>
            <Router>
                <Route path="/" exact render={() => <div>Home page</div>} />
                <Route path="/q" render={() => <QueryView/>} />
                <Route path="/jobs" exact render={() => <JobsView/>} />
            </Router>
        </div>
    );
}

const styles = {
    headerLink: {
        marginRight: 20,
    }
}

export default App;
