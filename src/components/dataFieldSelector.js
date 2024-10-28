import React, { useState } from "react";
import PropTypes from 'prop-types';
import TextInput from "./textInput";
import SelectInput from "./selectInput";

const DataFieldSelector = ({onChange, name, definitions, settings}) => {
  const [data,setData] = useState(settings || {Type:"Sources"});
  const handleChange = (k, v) => {
    const newData = {
      ...data,
      [k]:v
    };
    setData(newData);
    if(newData.Title && newData.Type && newData.Value){
      onChange(name, {
        Title: newData.Title,
        Value: newData.Value,
        Link: newData.Link??'',
        Type: newData.Type
      });
    }
  };

  return <>
  <div>
  <div className="row pt-2">
    <div className="col-md-3">
      <label className="form-label">Field Title</label>
      <TextInput name="Title" value={data?.Title} placeholder={'Field Title'} onChange={handleChange} />
    </div>
    <div className="col-md-3">
      <label className="form-label">Field Type</label>
      <SelectInput name="Type" value={data?.Type} onChange={handleChange} emptyText="Select Data Field Type">
        <option value="Comission">Commission</option>
        <option selected={'selected'} value="Sources">Sources</option>
      </SelectInput>
    </div>
    {data?.Type==="Comission"?<div className="col-md-3">
      <label className="form-label">Commission Id</label>
      <TextInput name="Value" value={data?.Value} placeholder={'Field Value'} onChange={handleChange} />
    </div>
    :
    <div className="col-md-3">
      <label className="form-label">Source Name</label>
      <SelectInput name="Value" value={data?.Value} onChange={handleChange} emptyText="Select Data Field Type">
        <option selected={'selected'}>Select a Source Name</option>
        {definitions && definitions.map((plan) => {
          return (plan.definitions && plan.definitions.map((definition) => {
            return <option key={`${plan.id}_${definition.valueId}`} value={definition.valueId}>{definition.name} ({definition.valueId})</option>
          }))
        })}
      </SelectInput>
    </div>
    }
    <div className="col-md-3">
      <label className="form-label">Link</label>
      <TextInput name="Link" value={data?.Link} placeholder={'Link'} onChange={handleChange} />
    </div>
  </div>
  </div>
  </>
}

export default DataFieldSelector;


DataFieldSelector.propTypes = {
  data: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.object.isRequired,
  customer: PropTypes.object,
  definitions: PropTypes.any.isRequired,
  settings:PropTypes.any
}