import React from 'react';
import Cookies from 'universal-cookie';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";

import JobsView from './components/JobsView';
import QueryView from './components/QueryView';
import SearchView from './components/SearchView';

import themes from './styles/base16-themes';


const cookies = new Cookies();

class App extends React.Component {

    constructor(props) {

        let currTheme = cookies.get('modalsearch_theme');

        super(props);
        console.log(window.location.href);
        this.state = {
            api_url: window.location.href.startsWith('http://localhost') ? 'http://localhost:5000' : 'https://api.modalsearch.com',
            theme_name: currTheme !== undefined ? currTheme : 'mexico-light'
        };

    }

    render() {
        const { api_url, theme_name } = this.state;
        const theme = themes[theme_name];
    
        const headerLinkStyle = {
            marginRight: 20,
            color: theme.base0A
        }

        return (
            <div className="App" style={{
                backgroundColor: theme.base00,
                color: theme.base05,
            }}>
                <div style={{
                    paddingBottom: 10,
                    fontSize: 22,
                    width: '100%',
                    display: 'inline-flex',
                }}>
                    <span style={{
                        flex: 1,
                        color: themes.base03,
                        fontSize: 14
                    }}>
                        <span>Endpoint: <a href={api_url} style={{color: theme.base03}}>{api_url}</a></span>
                        <span>Theme: 
                            <select value={theme_name} onChange={(e) => {
                                this.setState({theme_name: e.target.value});
                                cookies.set('modalsearch_theme', e.target.value, { path: '/' });
                                }}>
                                {/* <option value="lime">Lime</option>
                                <option value="coconut">Coconut</option>
                                <option value="mango">Mango</option> */}
                                {Object.keys(themes).map(name => <option value={name}>{name}</option>)}
                            </select>
                        </span>
                    </span>
                    <span style={{
                        textAlign: 'right',
                    }}>
                        <a href='/' style={headerLinkStyle}>Search</a>
                        <a href='/q?query=true' style={headerLinkStyle}>All Data</a>
                        <a href='/jobs' style={headerLinkStyle}>Jobs</a>
                    </span>
                </div>
                <Router>
                    <Route path="/" exact render={() => <SearchView theme={theme} api_url={api_url} />} />
                    <Route path="/q" render={() => <QueryView theme={theme} api_url={api_url}/>} />
                    <Route path="/jobs" exact render={() => <JobsView theme={theme} api_url={api_url}/>} />
                </Router>
            </div>
        );
    }
}

export default App;
