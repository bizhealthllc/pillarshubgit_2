import React, { useState } from "react";
import PropTypes from 'prop-types';
import DataFieldSelector from "./dataFieldSelector";

const DataFieldSelectorList = ({onChange, name, count=5, definitions, settings}) => {
  const [data,setData] = useState(settings || []);
  const rows = Array.from(Array(count).keys());
  const handleChange = (key, value) => {
    const newData = [
      ...data
    ];
    newData[key] = value;
    setData(newData);
    onChange(name, newData);
  };
  return <>
  {rows.map((row)=>{
    return <DataFieldSelector key={row} name={row} onChange={handleChange} definitions={definitions} settings={settings?.[row]||null}></DataFieldSelector>
  }) }
  </>
}

export default DataFieldSelectorList;


DataFieldSelectorList.propTypes = {
  count: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  customer: PropTypes.object,
  name: PropTypes.string.isRequired,
  definitions: PropTypes.any.isRequired,
  settings: PropTypes.any
}