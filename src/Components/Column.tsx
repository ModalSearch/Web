import React from 'react';
import TableCell, {CellType} from './TableCell';
import { Resizable } from "re-resizable";
import { Table } from 'react-virtualized';


interface IProps {
    name: string;
    type: CellType;
    data: Array<any>;
    theme: { [k: string]: string; };
    onCellClick: (value: string|Array<string>, type: CellType, idx: number) => void;
}

interface IState {
}

class Column extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { theme, name, type, data, onCellClick } = this.props;

        return (
            <Resizable
                enable={{ top: false, right: true, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
                defaultSize={{
                    width: window.innerWidth / 4,
                    height: '100%'
                }}
                minWidth={20}>
                <div style={{
                    // backgroundColor: theme.base00,
                    borderRight: 'solid 1px',
                    borderColor: theme.base01,
                    overflow: 'visible'
                }}>
                    <div style={{
                        // backgroundColor: theme.base01,
                        textDecoration: 'underline',
                        color: theme.base04,
                        padding: 5,
                    }}>
                        {name}
                    </div>
                    <div style={{position: 'relative'}}>
                        {data.map((row_data, idx) => (
                            <TableCell
                                key={idx}
                                theme={theme}
                                value={row_data}
                                type={type}
                                onCellClick={(val: string|Array<string>, type: CellType) => {
                                    onCellClick(val, type, idx);
                                }}></TableCell>))}
                    </div>
                </div>
            </Resizable>
        );
    }
}


export default Column;
