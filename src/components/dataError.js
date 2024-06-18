import React from 'react';
import PropTypes from 'prop-types';

const DataError = ({ title, error }) => {
  return <div className="page page-center" >
    <div className="container container-tight py-4">
      <div className="text-center">
        <div className="mb-3">
          {title ?? 'We encountered an error requesting your data.'}
        </div>
        <div className="text-secondary mb-3">{JSON.stringify(error)}</div>
      </div>
    </div>
  </div>
}

export default DataError;

DataError.propTypes = {
  title: PropTypes.string,
  error: PropTypes.string
}