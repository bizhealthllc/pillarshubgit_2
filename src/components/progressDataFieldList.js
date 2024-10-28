import React, { useState } from "react";
import PropTypes from 'prop-types';
import ProgressDataField from "./progressDataField";

const ProgressDataFieldList = ({ onChange, name, count = 5, definitions, settings }) => {
 
  const [data, setData] = useState(
    Array.from(Array(count).keys()).map(() => ({
      Title: "",
      Value1: "",
      Value2: "",
      Type: "Sources", // Set a default Type
    }))
  );

  const handleChange = (key, value) => {
    
    const newData = [...data];
    
    newData[key] = value;
    // Update the state with the new data
    setData(newData);
    onChange(name, newData);
  };

  return (
    <>
      {data.map((row, index) => (
        <ProgressDataField 
          key={index}
          name={index}
          onChange={handleChange}
          data={settings?.[row]||null} // Passing  the row data to the ProgressDataField
          definitions={definitions}
        />
      ))}
    </>
  );
};

export default ProgressDataFieldList;

ProgressDataFieldList.propTypes = {
  count: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  customer: PropTypes.object,
  name: PropTypes.string.isRequired,
  definitions: PropTypes.any.isRequired,
  settings: PropTypes.any
};
