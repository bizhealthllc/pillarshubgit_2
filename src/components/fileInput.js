import React from 'react';
import PropTypes from 'prop-types';

import './fileInput.css';

const FileInput = ({ id, accept, className, name, onChange, disabled }) => {

  const handleChange = (event) => {
    var name = event.target.name;
    const file = event.target.files[0];

    onChange(name, file);
  };

  return <>
    <input id={id} type="file" accept={accept} className={className ?? 'form-control'} name={name} disabled={disabled} onChange={handleChange} autoComplete='off' />    
  </>
}

export default FileInput;

FileInput.propTypes = {
  id: PropTypes.string,
  accept: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
}
