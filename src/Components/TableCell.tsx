import moment from 'moment';
import React, { useState } from 'react';


export enum CellType {
    String = 1,
    Int = 2,
    Float = 3,
    URL = 4,
    Time = 5,
    Array = 6,
}

type CellProps = {
    setText: (text: string) => void;
    value: string | Array<string>;
    type: CellType;
    theme: { [k: string]: string; };
};



const TableCell = ({ setText, value, type, theme }: CellProps) => {

    const [isHovered, setIsHovered] = useState(false);

    const StringCell = ({ value }: { value: string }) => {
        return (<span style={{ color: theme.base0B }}>{value}</span>);
    };

    const IntCell = ({ value }: { value: string }) => {
        return (<span style={{ color: theme.base09 }}>{value}</span>);
    };

    const FloatCell = ({ value }: { value: string }) => {
        return (<span style={{ color: theme.base09 }}>{value}</span>);
    };

    const UndefinedCell = () => {
        return (<span style={{ backgroundColor: theme.base0F }}>N/A</span>);
    };

    const URLCell = ({ value }: { value: string }) => {
        return (<span style={{ color: theme.base09, textDecoration: 'none' }}>{value.replace('https://www.', '')}</span>);
    };

    const TimeCell = ({ value }: { value: string }) => {
        const parsedTime = moment(value);
        return (<span style={{ color: theme.base0E }}>{parsedTime.from(moment())}</span>);
    };

    const ArrayCell = ({ values }: { values: Array<string> }) => {
        return (
            <span style={{ color: theme.base0D }}>
                {"["} {values.map((value, i) => (
                    <span style={{ color: theme.base0B }}>
                        {value}
                        {i === values.length - 1 ? '' : ', '}
                    </span>
                ))}
                {"]"}
            </span>
        );
    };

    let cell_body = null;
    if (value === undefined || value === null) {
        cell_body = <UndefinedCell></UndefinedCell>;
        return <UndefinedCell></UndefinedCell>;
    } else if (typeof value === 'string') {
        if (type === CellType.String) {
            cell_body = <StringCell value={value}></StringCell>;
        } else if (type === CellType.Int) {
            cell_body = <IntCell value={value}></IntCell>;
        } else if (type === CellType.Float) {
            cell_body = <FloatCell value={value}></FloatCell>;
        } else if (type === CellType.URL) {
            cell_body = <URLCell value={value}></URLCell>;
        } else if (type === CellType.Time) {
            cell_body = <TimeCell value={value}></TimeCell>;
        }
    } else if (typeof value === 'object') {
        cell_body = <ArrayCell values={value}></ArrayCell>;
    }

    return (
        <div
            style={{
                backgroundColor: isHovered ? theme.base02 : theme.base00,
                cursor: 'pointer'
            }}
            onMouseEnter={() => {setIsHovered(true)}}
            onMouseLeave={() => {setIsHovered(false)}}
            onClick={() => {setText(value.toString())}}>
            {cell_body}
        </div>
        );
    // return (
    //     <td style={{
    //         borderBottom: 'solid 1px',
    //         borderColor: theme.base01,
    //         padding: 5
    //     }}>
    //         {cell_body}
    //         {/* <Popup
    //             trigger={<button style={{
    //                 backgroundColor: 'inherit',
    //                 border: 'none',
    //                 fontSize: 'inherit',
    //             }} className="button"> {cell_body} </button>}
    //             position="bottom center"
    //             on="click"
    //         >
    //             <span>hello</span>
    //         </Popup> */}
    //     </td>
    // );
};

export default TableCell;
