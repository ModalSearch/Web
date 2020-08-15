import React from 'react';
import Cookies from 'universal-cookie';
import '../styles/App.css';
import {ReactComponent as Tarot} from '../tarot.svg';
import { BrowserRouter as Router, Route } from "react-router-dom";

import JobsView from './JobsView';
import SearchView from './SearchView';

import themes from '../styles/base16-themes';


const cookies = new Cookies();

class App extends React.Component {

    constructor(props) {

        let currTheme = cookies.get('modalsearch_theme');

        super(props);
        console.log(window.location.href);
        this.state = {
            api_url: window.location.href.startsWith('http://localhost') ? 'http://localhost:5000' : 'https://api.modalsearch.com',
            theme_name: currTheme !== undefined ? currTheme : 'materia'
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
                minHeight: '100%'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap-reverse',
                    justifyContent: 'space-between',
                    backgroundColor: theme.base01
                }}>
                    <span style={{
                        flex: 1,
                        color: themes.base03,
                        fontSize: 14,
                        margin: 10,
                    }}>
                        <span>Endpoint: <a href={api_url} style={{color: theme.base03}}>{api_url}</a></span>

                        <span>Theme: 
                            <select value={theme_name} onChange={(e) => {
                                this.setState({theme_name: e.target.value});
                                cookies.set('modalsearch_theme', e.target.value, { path: '/' });
                                }}>
                                {Object.keys(themes).sort().map(name => <option key={name} value={name}>{name}</option>)}
                            </select>
                        </span>
                        
                    </span>
                    <span style={{
                        fontSize: 22,
                        margin: 10,
                    }}>
                        <a href='/' style={headerLinkStyle}>Search</a>
                        <a href='/jobs' style={headerLinkStyle}>Jobs</a>
                    </span>
                </div>
                <Router>
                    <Route path="/" exact render={() => <SearchView theme={theme} api_url={api_url} />} />
                    <Route path="/jobs" exact render={() => <JobsView theme={theme} api_url={api_url}/>} />
                </Router>
            </div>
        );
    }
}

export default App;
