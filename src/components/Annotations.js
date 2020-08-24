import React from 'react';



class AnnoLink extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isHovered: false
        };
    }

    on

    render() {
        return (
            <a
                style={{
                    backgroundColor: this.state.isHovered ? this.props.theme.base03 : this.props.theme.base01,
                    color: this.state.isHovered ? this.props.theme.base06 : this.props.theme.base05,
                    borderRadius: 3,
                    textDecoration: 'none',
                    padding: 3,
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                    // verticalAlign: 'middle',
                    fontWeight: 500,
                }}
                href={`?q=${this.props.link}`}
                onMouseEnter={() => this.setState({ isHovered: true })}
                onMouseLeave={() => this.setState({ isHovered: false })}>
                {this.props.text}
            </a>
        );
    }
}


const Annotations = ({ data, theme }) => {
    return (
        <div style={{ flex: 1 }}>
            <div style={{
                flex: 1,
                padding: 5,
                overflowX: 'scroll',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%',
                // verticalAlign: 'middle',
                display: 'inline-block'
            }}>
                {data.map((anno, idx) => (
                    <span style={{ color: theme.base03, verticalAlign: 'middle' }} key={anno.link}>
                        <AnnoLink theme={theme} link={anno.link} text={anno.text} />
                        {idx < data.length - 1 ? <span style={{ margin: 5, fontSize: 24 }}>{"›"}</span> : null}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default Annotations;
