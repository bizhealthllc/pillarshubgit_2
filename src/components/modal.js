import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Modal = ({ showModal, onHide, size, centered, children }) => {
  const [modalId] = useState(() => 'modal_' + crypto.randomUUID().replace(/-/g, '_'));

  useEffect(() => {
    let mdl = document.getElementById(modalId);
    if ((showModal && mdl.style.display !== 'block') || (!showModal && mdl.style.display === 'block')) {
      let elem = document.getElementById(`${modalId}_btn`);
      mdl.addEventListener('hidden.bs.modal', function () {
        onHide();
      });

      elem.click();
    }
  }, [showModal, modalId]);

  return (
    <>
      <button id={`${modalId}_btn`} style={{ display: 'none' }} data-bs-toggle="modal" data-bs-target={`#${modalId}`}>
        Update Status
      </button>

      <div id={modalId} className={`modal modal-blur modal-${size} fade`} tabIndex="-1">
        <div className={`modal-dialog modal-dialog-${centered ? 'centered' : ''}`} role="document">
          <div className="modal-content">{children}</div>
        </div>
      </div>
    </>
  );
};

Modal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  size: PropTypes.string,
  centered: PropTypes.string,
  children: PropTypes.any.isRequired,
};

export default Modal;
