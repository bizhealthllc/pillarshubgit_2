import React, { Children } from 'react';
import PropTypes from 'prop-types';

const SelectInput = ({ className, name, value, onChange, disabled, children }) => {

  const handleChange = (event) => {
    var name = event.target.name;
    var value = event.target.value;
    onChange(name, value);
  };

  return <select className={className ?? 'form-select'} name={name} value={value} disabled={disabled} onChange={handleChange}>
    {Children.map(children, child =>
      <>{child}</>
    )}
  </select>;
}

export default SelectInput;



SelectInput.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  disabled: PropTypes.bool.isRequired,
  children: PropTypes.any.isRequired
}
