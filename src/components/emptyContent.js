import React from 'react';
import PropTypes from 'prop-types';

const EmptyContent = ({ title, text }) => {
    return <div className="empty">
    <p className="empty-title">{title ?? 'Content not found'}</p>
    <p className="empty-subtitle text-muted">
      {text ?? 'The content request cannot be found.'}
    </p>
  </div>
}

export default EmptyContent;

EmptyContent.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
}
