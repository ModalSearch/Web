import React from 'react';
import Result from './Result';
import Annotations from './Annotations';
import moment from 'moment';
import Modal from 'react-modal';


function pretty_date(timestamp) {
    const curr_time = moment(new Date().getTime());
    const ts = moment.utc(timestamp);
    return ts.from(curr_time);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

function ModalView({data, relkey, theme}) {

    let all_dates = [];
    Object.keys(data).forEach(prop_name => data[prop_name].forEach(val_and_time => all_dates.push(val_and_time[1])));
    all_dates = [...new Set(all_dates)].map(date_str => moment.utc(date_str));
    const header_cell_style = {
        // backgroundColor: theme.base01
        padding: 5,
        // border: 'solid 1px',
        // borderColor: theme.base02
    };
    return (
        <div>
            <h3 style={{color: theme.base0D}}>{relkey.text}</h3>
            <table style={{borderCollapse: 'collapse'}}>
                <tbody>
                    <tr style={{
                        backgroundColor: theme.base01,
                        opacity: 1,
                        color: theme.base05,
                        border: `solid 1px ${theme.base01}`,
                        textAlign: 'left',}}>
                        <th style={header_cell_style}>time</th>
                        {Object.keys(data).map(prop_name => <th key={prop_name} style={header_cell_style}>{prop_name}</th>)}
                    </tr>
                    {all_dates.map((date, idx) => {
                        let relevant_data = {};
                        Object.keys(data).forEach(prop_name => {
                            data[prop_name].forEach(val_and_time => {
                                if (moment.utc(val_and_time[1]).isSame(date)) {
                                    relevant_data[prop_name] = val_and_time[0];
                                }
                            });
                        });

                        return (
                            <tr style={{
                                backgroundColor: idx % 2 === 0 ? theme.base00 : theme.base01,
                                maxHeight: 200,
                                color: theme.base05,
                                padding: 5,
                                verticalAlign: 'top'}}>
                                <td style={{
                                    maxHeight: 200,
                                    border: 'solid 1px',
                                    padding: 10,
                                    borderColor: theme.base03}}>{date.format('MMMM Do YYYY, h:mm:ss a')}</td>
                                {Object.keys(data).map(prop_name => <td style={{
                                            border: 'solid 1px',
                                            borderColor: theme.base02
                                }}>
                                    <div style={{padding: 10, minWidth: 100, maxHeight: 200, overflowY: 'scroll', textOverflow: 'ellipsis'}}>

                                    {JSON.stringify(relevant_data[prop_name])}
                                    </div>
                                </td>)}
                            </tr>
                        );
                    })}
                </tbody>
                {/* {JSON.stringify(all_dates)} */}
            </table>
        </div>
    );
}


function Prop_val_list({ values, theme }) {
    let parsed = values.map(v => [v[0], moment(v[1])]);
    parsed.sort((a, b) => b[1] - a[1]);
    let last_val = null;
    return (
        parsed.map(val_and_time => {
            const val = val_and_time[0];
            const timestamp = val_and_time[1];
            if (val !== last_val) {
                last_val = val;
                return (
                    <div key={val} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{
                            color: theme.base0B,
                            textAlign: 'left'
                        }}>
                            {val}
                        </span>
                        <span style={{
                            paddingLeft: 10,
                            whiteSpace: 'nowrap',
                            color: theme.base03,
                            textAlign: 'right',
                        }}>
                            {pretty_date(timestamp)}
                        </span>
                    </div>
                );
            } else {
                return null;
            }
        })
    );
}


export default class CollapsedResult extends React.Component {

    constructor(props) {
        super(props);
        Modal.setAppElement('#root');
        this.state = {
            modalOpen: false,
            isHovered: false
        };
    }

    render() {
        
        const { data, relkey, theme, anno } = this.props;
        const bg_color_rgb = hexToRgb(theme.base02)
        const customStyles = {
            overlay: {
                backgroundColor: `rgba(${bg_color_rgb.r}, ${bg_color_rgb.g}, ${bg_color_rgb.b}, 0.75)`,
                position: 'fixed'
            },
            content: {
                backgroundColor: theme.base00,
                borderColor: theme.base03,
                top: '50%',
                left: '50%',
                display: 'block',
                right: 'auto',
                bottom: 'auto',
                padding: 15,
                maxHeight: 500,
                maxWidth: '80%',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)'
           }
        };
        return (
            <div style={{
                backgroundColor: theme.base01,
                flex: 1,
                borderRadius: 3,
                border: 'solid 1px',
                borderColor: this.state.isHovered ? theme.base02 : theme.base01,
                cursor: this.state.isHovered ? 'pointer' : 'auto',
                padding: 3,
                overflowX: 'hidden',
            }}
            onMouseEnter={() => {this.setState({isHovered: true})}} 
            onMouseLeave={() => {this.setState({isHovered: false})}} 
            onClick={(e) => {
                console.log('Clicked:', data);
                if (!this.state.modalOpen) {
                    this.setState({modalOpen: true, isHovered: false});
                }
            }}>
                <div style={{
                    borderBottom: 'solid 1px',
                    borderColor: theme.base01,
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    flexDirection: 'row',
                    verticalAlign: 'middle',
                    flex: 1,
                }}>
                    {relkey !== null ?
                    <div style={{
                        fontSize: 16,
                        whiteSpace: 'nowrap',
                        margin: 'auto',
                        color: theme.base0D,
                        padding: 5}}>{relkey.text} ›</div> : null}
                    {anno}
                </div>
                <table style={{
                    borderRadius: 5,
                    width: '100%',
                    overflow: 'scroll',
                    flex: 1,
                    // backgroundColor: theme.base00,
                    padding: 5 }}>
                    <tbody>
                        {Object.keys(data).map(prop_name => {
                            return (
                                <tr style={{
                                    verticalAlign: 'top',
                                }}
                                key={prop_name}>
                                    <td style={{ width: 0.1, whiteSpace: 'nowrap' }}>{prop_name}</td>
                                    <td style={{ display: 'block', width: '100%' }}>
                                        <Prop_val_list values={data[prop_name]} theme={theme}></Prop_val_list>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <Modal
                    isOpen={this.state.modalOpen}
                    shouldCloseOnOverlayClick={true}
                      onRequestClose={() => this.setState({modalOpen: false})}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <ModalView data={data} relkey={relkey} theme={theme}/>
                </Modal>
            </div>
        );
    }
}