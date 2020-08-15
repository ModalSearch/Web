import React from 'react';

const SchemaControls = ({baseSchema, activeSchema, theme, onChange}) => {
    if (baseSchema.type !== 'object') {
        console.error('- Unknown schema:', baseSchema);
        return <div style={{
            padding: 5,
            color: theme.base0F
        }}>Unknown Schema, check console!</div>
    }
    return (
        <div style={{
            padding: 5,
        }}>
            {Object.keys(baseSchema.properties).map((prop_name) => {
                return (
                    <label key={prop_name}>
                        <input
                            name={prop_name}
                            type="checkbox"
                            checked={Object.keys(activeSchema.properties).indexOf(prop_name) !== -1}
                            onChange={onChange}
                            />
                        {prop_name}
                    </label>
                );
            })}
        </div>
    );
}

export default SchemaControls;

