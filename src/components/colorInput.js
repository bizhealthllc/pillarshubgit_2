import React from 'react';
import PropTypes from 'prop-types';

const ColorInput = ({ className, name, value, onChange, disabled, placeholder, defaultValue }) => {

  const handleChange = (event) => {
    var name = event.target.name;
    var value = event.target.value;

    onChange(name, value);
  };

  const handleReset = () => {
    onChange(name, defaultValue);
  }

  return <>
    <div className="input-group mb-2">
      <span className="input-group-text">
        <input type="color" name={name} value={value} onChange={handleChange} />
      </span>
      <input className={className ?? 'form-control'} placeholder={placeholder ?? ''} name={name} value={value} disabled={disabled} onChange={handleChange} autoComplete='off' />
      {defaultValue && <span className="input-group-text">
        <button className="btn-link input-group-link" onClick={handleReset}>Reset</button>
      </span>}
    </div>
  </>
}

export default ColorInput;

ColorInput.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
}
