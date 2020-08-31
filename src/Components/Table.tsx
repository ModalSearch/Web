import moment from 'moment';
import React, {useState} from 'react';
import Popup from "reactjs-popup";
import TableCell from './TableCell';
import { AiOutlinePlus, AiOutlineArrowRight } from 'react-icons/ai';


export enum CellType {
    String = 1,
    Int = 2,
    Float = 3,
    URL = 4,
    Time = 5,
    Array = 6,
}


type TableProps = {
    setText: (text: string) => void;
    add_col: (col_name: string) => void;
    remove_col: (col_name: string) => void;
    column_names: Array<string>;
    skip: number;
    limit: number;
    set_skip: (new_skip: number) => void;
    set_limit: (new_limit: number) => void;
    all_column_names: Array<string>;
    column_types: Array<CellType>;
    rows_data: Array<Array<string | Array<string>>>;
    theme: { [k: string]: string; };
};



const Table = ({ setText, add_col, set_skip, set_limit, remove_col, skip, limit, column_names, all_column_names, column_types, rows_data, theme }: TableProps) => {


    return (
        <div className="Table" style={{ padding: 10 }}>
            <div style={{
                backgroundColor: theme.base01,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 5
            }}>
                <div style={{color: theme.base04}}>
                    <label>Skip: <input type="number" value={skip} onChange={(e) => {
                        set_skip(Number.parseInt(e.target.value));
                    }} style={{width: 75}}></input></label>
                    <label>Limit: <input type="number" value={limit} onChange={(e) => {
                        set_limit(Number.parseInt(e.target.value));
                    }} style={{width: 75}}></input></label>
                </div>
                <Popup
                    arrowStyle={{ backgroundColor: theme.base03 }}
                    contentStyle={{
                        backgroundColor: theme.base00,
                        borderColor: theme.base03,
                        color: theme.base01
                    }}
                    trigger={<button style={{
                        background: 'none',
                        border: 'none',
                        fontSize: 18,
                        color: theme.base04,
                        display: 'inline',
                        verticalAlign: 'middle'
                    }}><AiOutlinePlus style={{ display: 'inherit' }}></AiOutlinePlus></button>}
                    position="bottom right"
                    on="hover"
                >
                    <div style={{
                        padding: 5
                    }}>
                        {all_column_names.map(prop_name => {
                            const is_shown = column_names.indexOf(prop_name) !== -1;
                            if (!is_shown) {
                                return (
                                    <input key={prop_name} type="button" value={is_shown ? `- ${prop_name}` : `+ ${prop_name}`}
                                        style={{
                                            border: 'none',
                                            display: 'block',
                                            color: theme.base0E,
                                            backgroundColor: theme.base01,
                                            cursor: 'pointer',
                                            padding: 5,
                                            marginBottom: 5,
                                            fontSize: 16,
                                        }}
                                        onClick={() => {
                                            add_col(prop_name);
                                        }}></input>
                                );
                            } else {
                                return null;
                            }
                        })}
                    </div>
                </Popup>
            </div>
            <table style={{
                backgroundColor: theme.base00,
                borderCollapse: 'collapse',
                width: '100%',
            }}>
                <thead>
                    <tr style={{
                        width: '100%',
                        // display: 'flex',
                        flexDirection: 'row'
                    }}>
                        {column_names.map((name, idx) => {
                            return (<th style={{
                                backgroundColor: theme.base01,
                                padding: 5,
                                color: theme.base04,
                                textAlign: 'left'
                            }} key={`col${idx}`}>
                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>

                                    <Popup
                                        arrowStyle={{ backgroundColor: theme.base03 }}
                                        contentStyle={{
                                            backgroundColor: theme.base00,
                                            borderColor: theme.base03,
                                            color: theme.base01
                                        }}
                                        trigger={<input type="button" value={name} style={{
                                            border: 'none',
                                            color: theme.base04,
                                            backgroundColor: theme.base00,
                                            padding: 5,
                                            cursor: 'pointer',
                                            fontSize: 16,
                                        }}></input>}
                                        position={idx === 0 ? 'bottom left' : (idx === column_names.length - 1 ? 'bottom right' : 'bottom center')}
                                        on="hover"
                                    >
                                        <div>
                                            <input type="button" value="Remove" onClick={() => remove_col(name)}></input>
                                        </div>
                                    </Popup>

                                </div>
                            </th>);
                        })}
                        {/* <th>Add Col</th> */}
                    </tr>
                </thead>
                <tbody>
                    {rows_data.map((row_data: Array<string | Array<string>>, row_idx: Number) => (
                        <tr key={`row${row_idx}`}>{column_names.map((col_name: string, col_idx) => {
                            const col_type = column_types[col_idx];
                            return (
                                <td style={{
                                    borderBottom: 'solid 1px',
                                    borderColor: theme.base01,
                                    padding: 5,
                                }}><TableCell setText={setText} value={row_data[col_idx]} type={col_type} theme={theme}></TableCell></td>
                            );
                        })}</tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
