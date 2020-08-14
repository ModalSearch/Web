import React from 'react';

const SchemaControls = ({baseSchema, activeSchema, theme, onChange}) => {
    if (baseSchema.type !== 'object' || activeSchema.type !== 'object') {
        throw Error('Cannot yet handle non-object Schemas!');
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
                            checked={activeSchema.required.indexOf(prop_name) !== -1}
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

