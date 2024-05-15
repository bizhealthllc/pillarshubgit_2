import React from 'react';
import PropTypes from 'prop-types';

const EmptyContent = ({ title, text, buttonText = '', href = '' }) => {
  return <div className="empty">
    <p className="empty-title">{title ?? 'Content not found'}</p>
    <p className="empty-subtitle text-muted">
      {text ?? 'The content request cannot be found.'}
    </p>
    {buttonText && href && <div className="empty-action">
      <a href={href} className="btn btn-primary">
        {buttonText}
      </a>
    </div>}
  </div>
}

export default EmptyContent;

EmptyContent.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  href: PropTypes.string
}
