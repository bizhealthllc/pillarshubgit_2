import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../../components/modal';
import AutoComplete from '../../../components/autocomplete';
import { SendRequest } from "../../../hooks/usePost";

const ChangePlacementModal = ({ tree, treeId, placement, refetch }) => {
  const [showModal, setModalShow] = useState();
  const [activeItem, setActiveItem] = useState();

  const handleClose = () => setModalShow(false);
  const handleChange = (name, value) => {
    setActiveItem(values => ({ ...values, [name]: value }))
  }

  useEffect(() => {
    if (placement) {
      setActiveItem(placement);
      setModalShow(true);
    } else {
      setActiveItem();
      setModalShow(false);
    }
  }, [placement]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!activeItem.uplineId) {
      alert("Place Under is required");
      return;
    }

    if (!activeItem.uplineLeg) {
      if (tree.legNames) {
        alert("Place On Leg is required");
        return;
      } else {
        activeItem.uplineLeg = activeItem.nodeId
      }
    }

    setModalShow(false);

    var url = `/api/v1/Trees/${treeId}/Nodes/${activeItem.nodeId}`;
    SendRequest('PUT', url, activeItem, () => {
      refetch();
    }, (error) => {
      alert('Error: ' + error);
    });
  }

  var UplineColWidth = tree.legNames ? 8 : 12;

  return <Modal showModal={showModal} onHide={handleClose} >
    <div className="modal-header">
      <h5 className="modal-title">Change Placement</h5>
      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div className="modal-body">
      <div className="row">
        <div className={`col-md-${UplineColWidth}`}>
          <div className="mb-3">
            <label className="form-label">Place Under</label>
            <AutoComplete name="uplineId" value={activeItem?.uplineId ?? ""} onChange={handleChange} />
            <span className="text-danger"></span>
          </div>
        </div>
        {tree.legNames &&
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Place on Leg</label>
              <select className="form-select" name="uplineLeg" value={activeItem?.uplineLeg.toLowerCase() ?? ""} onChange={(e) => handleChange(e.target.name, e.target.value)} >
                {tree.legNames.map((leg) => {
                  return <option key={leg} value={leg.toLowerCase()}>{leg}</option>
                })}
                <option value="holding tank">Holding Tank</option>
              </select>
              <span className="text-danger"></span>
            </div>
          </div>
        }
      </div>
    </div>
    <div className="modal-footer">
      <a href="#" className="btn btn-link link-secondary" data-bs-dismiss="modal">
        Cancel
      </a>
      <button type="submit" className="btn btn-primary ms-auto" onClick={handleSubmit}>
        Place Node
      </button>
    </div>
  </Modal>
}

export default ChangePlacementModal;

ChangePlacementModal.propTypes = {
  tree: PropTypes.any,
  treeId: PropTypes.string.isRequired,
  placement: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired
}
