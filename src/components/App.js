import React from 'react';
import Cookies from 'universal-cookie';
import '../styles/App.css';
import { ReactComponent as Tarot } from '../tarot.svg';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Select from 'react-select'

import JobsView from './JobsView';
import SearchView from './SearchView';

import themes from '../styles/base16-themes';
import { GiSettingsKnobs } from 'react-icons/gi';


const cookies = new Cookies();

class App extends React.Component {

    constructor(props) {

        let currTheme = cookies.get('modalsearch_theme');

        super(props);
        console.log(window.location.href);
        this.state = {
            api_url: window.location.href.startsWith('http://localhost') ? 'http://localhost:5000' : 'https://api.modalsearch.com',
            theme_name: currTheme !== undefined ? currTheme : 'solarflare',
            settingsOpen: false,
        };
    }

    render() {
        const { api_url, theme_name } = this.state;
        const theme = themes[theme_name];

        let theme_options = [];
        Object.keys(themes).sort().forEach((theme_name) => {
            theme_options.push({ value: theme_name, label: theme_name });
        });

        const customSelectStyles = {
            menu: (provided, state) => ({
                ...provided,
                width: state.selectProps.width,
                border: '1px solid',
                borderColor: theme.base00,
                color: theme.base05,
                padding: 0,
                margin: 0,
                backgroundColor: theme.base00,
            }),
            control: styles => ({
                ...styles,
                width: 200,
                outline: 'none',
                '&:hover': { borderColor: theme.base03 },
                borderColor: theme.base00,
                backgroundColor: theme.base00,
                color: theme.base05,
                boxShadow: 'none',
                height: '2.4rem',
                minHeight: 'fit-content'
            }),
            input: (styles) => ({ ...styles, margin: 0 }),
            option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                return {
                    ...styles,
                    backgroundColor: isFocused ? theme.base01 : theme.base00,
                    color: theme.base05
                };
            },
            indicatorSeparator: state => ({
                display: 'none',
            }),
            indicatorsContainer: (styles, { data, isDisabled, isFocused, isSelected }) => {
                return {
                    ...styles,
                    // alignSelf: 'center',
                    padding: 0,
                };
            },
            singleValue: (provided, state) => {
                const opacity = state.isDisabled ? 0.5 : 1;
                const transition = 'opacity 300ms';
                return { ...provided, opacity, transition, color: theme.base05, padding: 0 };
            }
        };

        document.body.style = `background: ${theme.base00}`;

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
                    backgroundColor: theme.base01,
                    padding: 10
                }}>
                    <Tarot style={{ fill: theme.base0A }} height={30} width={35} />
                    <span style={{
                        fontSize: 18,
                        alignSelf: 'center',
                        cursor: 'pointer'
                    }}>
                        <a href='/' style={headerLinkStyle}>Search</a>
                        <a href='/jobs' style={headerLinkStyle}>Jobs</a>
                        <GiSettingsKnobs style={{
                            fill: this.state.settingsOpen ? theme.base08 : theme.base03,
                            verticalAlign: 'middle'
                        }} onClick={(e) => this.setState({settingsOpen: !this.state.settingsOpen})}/>
                        {/* <span onClick={(e) => this.setState({settingsOpen: !this.state.settingsOpen})} style={headerLinkStyle}>Settings</span> */}
                    </span>
                </div>
                <div style={{
                    // minWidth: 300,
                    padding: 10,
                    // position: 'fixed',
                    // top: '10%',
                    // left: '50%',
                    // transform: 'translate(-50%, -50%)',
                    backgroundColor: theme.base01,
                    margin: 5,
                    // border: 'solid 1px',
                    // borderColor: theme.base01,
                    // zIndex: 1000,
                    display: this.state.settingsOpen ? 'inline-block' : 'none'
                }}>
                    {/* <input type="button" value="Close" onClick={(e) => this.setState({settingsOpen: false})} /> */}
                        <span style={{ alignSelf: 'center', marginRight: 10 }}>Endpoint: <a href={api_url} style={{ color: theme.base03 }}>{api_url}</a></span>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
                            <span style={{ display: 'inline-block', alignSelf: 'center' }}>Theme: </span>
                            <Select
                                value={theme_options.filter(option => option.label === theme_name)}
                                styles={customSelectStyles} options={theme_options} onChange={(e) => {
                                    this.setState({ theme_name: e.value });
                                    cookies.set('modalsearch_theme', e.value, { path: '/' });
                                }} />
                        </div>
                </div>
                <Router>
                    <Route path="/" exact render={() => <SearchView theme={theme} api_url={api_url} />} />
                    <Route path="/jobs" exact render={() => <JobsView theme={theme} api_url={api_url} />} />
                </Router>
            </div>
        );
    }
}

export default App;
