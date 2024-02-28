import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SendRequest } from "../../hooks/usePost";
import Modal from "../../components/modal";
import CheckBox from "../../components/checkbox";

const PayablesModal = ({ data, showModal, onHide, cutoff, search }) => {
  const [summary, setSummary] = useState([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (data) {
      setSummary([...data]);
    }
  }, [data]);

  const handleSelectPayable = (name, value) => {
    setSummary((s) => {
      s.forEach((e, index) => {
        if (e.description === name) {
          s[index] = { description: e.description, checked: value, paidAmount: e.paidAmount, paidCount: e.paidCount, totalVolume: e.totalVolume, realeased: e.realeased };
        }
      });
      return [...s];
    });
  }

  const handleProcessPayables = () => {
    const toPay = summary.filter((e) => e.checked ?? true).map((e) => e.description);

    var nodeIds = null;
    if (search) {
      nodeIds = [ search ]
    }

    const localDate = new Date(cutoff);
    localDate.setHours(23, 59, 59);
    const utcDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
    
    var item = {
      cutoffDate: utcDate,
      BonusTitles: toPay,
      nodeIds: nodeIds
    }

    setProcessing(true);
    SendRequest('POST', '/api/v1/Batches', item, () => {
      location = '/commissions/paid';
    }, (error) => {
      alert(error);
      setProcessing(false);
    });
  }

  var totalSelected = 0;
  summary.forEach((item) => {
    if (item.checked ?? true) {
      totalSelected += item.paidAmount - item.realeased;
    }
  });  

  return <>
    <Modal showModal={showModal} onHide={onHide} >
      <div className="modal-header">
        <h5 className="modal-title">Select Payables</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="table-responsive">
        <table className="table card-table table-vcenter text-nowrap datatable">
          <thead>
            <tr>
              <th className="w-1"></th>
              <th className="w-5">Bonus</th>
              <th className="w-1">Bonus Count</th>
              <th ></th>
              <th className="w-1 text-end">Bonus Total</th>
            </tr>
          </thead>
          <tbody>
            {summary && summary.map((bonus) => {
              return <tr key={bonus.description}>
                <td>
                  <CheckBox className="form-check-input m-0 align-middle" name={bonus.description} value={bonus.checked ?? true} onChange={handleSelectPayable} />
                </td>
                <td>{bonus.description}</td>
                <td>{bonus.paidCount}</td>
                <td></td>
                <td className="text-end">{(bonus.paidAmount - bonus.realeased).toLocaleString("en-US", { style: 'currency', currency: 'USD' })}</td>
              </tr>
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4" className="strong text-end">Subtotal: </td>
              <td className="strong text-end">{totalSelected.toLocaleString("en-US", { style: 'currency', currency: 'USD' })}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="modal-body">
      </div>
      <div className="modal-footer">
        <a href="#" className="btn btn-link link-secondary" data-bs-dismiss="modal">
          Cancel
        </a>
        {!processing && <button type="submit" className="btn btn-primary ms-auto" disabled={totalSelected == 0} onClick={handleProcessPayables}>
          Process Payables
        </button>}

        {processing && <button className="btn btn-primary ms-auto" disabled={true}>
          Processing...
        </button>}

      </div>
    </Modal>
  </>
}

export default PayablesModal;

PayablesModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  cutoff: PropTypes.object.isRequired,
  search: PropTypes.string.isRequired
}
