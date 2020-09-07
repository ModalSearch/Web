import React from 'react';
import { BrowserRouter as Router, Route, Link, useHistory, useLocation, RouteComponentProps } from "react-router-dom";// import logo from './logo.svg';
// import Table from './Components/Table';
// import { CellType } from './Components/Table';
import { parse } from 'querystring';
import themes from './styles/base16-themes';
import TableView from './Components/TableView';
// import { AiOutlineArrowRight } from 'react-icons/ai';
// import DataTable from 'react-data-table-component';
// import { useTable, useBlockLayout, useResizeColumns } from 'react-table'


interface IProps {
}

interface IState {
    // col_names: Array<string>;
    // col_types: Array<CellType>;
    // row_data: Array<Array<string>>;
    // schema_props: Array<string>;
    // search_text: string;
    // limit: number;
    // skip: number;
    theme: { [k: string]: string; };
}


class App extends React.Component<IProps, IState> {


    constructor(props: IProps) {
        const theme = themes["solarized-dark"];
        // const current_query = parse(window.location.search.slice(1));

        super(props);
        this.state = {
            theme: theme
        };
    }

    render() {
        const { theme } = this.state;
        return (
            <div className="App" style={{
                backgroundColor: theme.base00,
                display: 'flex',
                flex: 1,
                height: '100%',
                overflow: 'hidden',
                maxWidth: '100%'
                }}>
                <TableView theme={theme}></TableView>
            </div>
        );
    }

}

export default App;