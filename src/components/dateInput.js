import React from 'react';
import PropTypes from 'prop-types';

const DateInput = ({ className = 'form-control', name, value, onChange, disabled, placeholder, errorText, errored  }) => {

  const handleChange = (event) => {
    var name = event.target.name;
    var value = event.target.value;

    onChange(name, value);
  };

  const inputClass = (errorText || errored) ? `${className} is-invalid` : className;

  return <>
    <input type="date" className={inputClass} placeholder={placeholder ?? ''} name={name} value={value} disabled={disabled} onChange={handleChange} autoComplete='off' />
    {errorText && <div className="invalid-feedback">{errorText}</div>}
  </>

}

export default DateInput;

DateInput.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  errorText: PropTypes.string,
  errored: PropTypes.bool
}
