import React, { useState } from "react";
import PropTypes from 'prop-types';
import TextInput from "./textInput";
import SelectInput from "./selectInput";

const ProgressDataField= ({ onChange, name, definitions, settings }) => {
  const [data, setData] = useState(settings || { Type: "Sources" });
  console.log(data,'---------------------')
  const handleChange = (k, v) => {
    const newData = {
      ...data,
      [k]: v
    };
    setData(newData);   
    
    if (newData.Title && newData.Type) {
      onChange(name, {
        Title: newData.Title,
        Value1: newData.Value1,
        Value2: newData.Value2, 
        Type: newData.Type
      });
    }
  };

  return (
    <>
      <div>
        <div className="row pt-2">
          <div className="col-md-3">
            <label className="form-label">Field Title</label>
            <TextInput name="Title" value={data?.Title} placeholder={'Field Title'} onChange={handleChange} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Field Type</label>
            <SelectInput name="Type" value={data?.Type} onChange={handleChange} emptyText="Select Data Field Type">
              <option value="Static">Static</option>
              <option value="Sources">Sources</option>
            </SelectInput>
          </div>
          {data?.Type === "Static" ? (
            <>
              <div className="col-md-3">
                <label className="form-label">Actual Value</label>
                <TextInput name="Value1" value={data?.Value1} placeholder={'Field Value1'} onChange={handleChange} />
              </div>
              <div className="col-md-3">
                <label className="form-label">Desired Value</label>
                <TextInput name="Value2" value={data?.Value2} placeholder={'Field Value2'} onChange={handleChange} />
              </div>
            </>
          ) : (
            <>
              <div className="col-md-3">
                <label className="form-label">Actual value</label>
                <SelectInput name="Value1" value={data?.Value1} onChange={handleChange} emptyText="Select Data Field Type">
                  <option value="" disabled>Select a Source Name1</option>
                  {definitions && definitions.map((plan) => {
                    return (plan.definitions && plan.definitions.map((definition) => {
                      return <option key={`${plan.id}_${definition.valueId}`} value={definition.valueId}>{definition.name} ({definition.valueId})</option>
                    }))
                  })}
                </SelectInput>
              </div>
              <div className="col-md-3">
                <label className="form-label">Desired Value</label>
                <SelectInput name="Value2" value={data?.Value2} onChange={handleChange} emptyText="Select Additional Source">
                  <option value="" disabled>Select an Source Name2</option>
                  {definitions && definitions.map((plan) => {
                    return (plan.definitions && plan.definitions.map((definition) => {
                      return <option key={`${plan.id}_${definition.valueId}`} value={definition.valueId}>{definition.name} ({definition.valueId})</option>
                    }))
                  })}
                </SelectInput>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProgressDataField;


ProgressDataField.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  definitions: PropTypes.any.isRequired,
  settings: PropTypes.any
};
