import moment from 'moment';
import React, { useState } from 'react';

export enum CellType {
    String = 1,
    Int = 2,
    Float = 3,
    URL = 4,
    Time = 5,
    Array = 6,
    Undefined = 7,
}

export function parseCellType(typeStr: string): (CellType) {
    if (typeStr === 'time') {
        return CellType.Time;
    } else if (typeStr === 'url') {
        return CellType.URL;
    } else if (typeStr === 'str') {
        return CellType.String;
    }
    return CellType.Undefined;
}


type CellProps = {
    value: string | Array<string>;
    type: CellType;
    theme: { [k: string]: string; };
    onCellClick: (value: string|Array<string>, type: CellType) => void;
};



const TableCell = ({value, type, theme, onCellClick }: CellProps) => {

    const [isHovered, setIsHovered] = useState(false);

    const cellColors: {[k: number]: string} = {
        1: theme.base0B, // string
        4: theme.base09, // url
        5: theme.base0E, // time
        7: theme.base03 // undefined
    };

    return (
        <div
            style={{
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                color: cellColors[type],
                textOverflow: 'ellipsis',
                padding: 5,
                overflow: 'hidden',
                position: 'relative',
                zIndex: isHovered ? 10 : 0,
                backgroundColor: isHovered ? theme.base02 : theme.base00,
            }}
            onMouseEnter={() => {
                setIsHovered(true);
            }}
            onMouseLeave={() => {setIsHovered(false)}}
            onClick={() => {onCellClick(value, type)}}>
            {value}
        </div>
        );
};

export default TableCell;
