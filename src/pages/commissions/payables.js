import React, { useState, useEffect } from 'react';
import { useQuery, gql } from "@apollo/client";
import { SendRequest } from "../../hooks/usePost";
import Pagination from '../../components/pagination';
import PageHeader from "../../components/pageHeader";
import DataLoading from "../../components/dataLoading";
import LocalDate from "../../util/LocalDate";
import Avatar from "../../components/avatar";
import PayablesModal from './payablesModal';
import Modal from '../../components/modal';
import AutoComplete from '../../components/autocomplete';
import DateInput from '../../components/dateInput';
import NumericInput from '../../components/numericInput'
import TextInput from '../../components/textInput';

var GET_DATA = gql`query ($date: Date!, $offset: Int!, $first: Int!, $search: String!) {
  totalUnreleased(date: $date, search: $search)
  unreleasedSummary(date: $date, search: $search)
  {
    description
    paidAmount
    paidCount
    totalVolume
    realeased
  }
  unreleased(date: $date, search: $search, offset: $offset, first: $first) {
    amount
    bonusId
    bonusTitle
    commissionDate
    level
    percent
    released
    volume
    customer
    {
      id
      fullName
    }
    period {
      id
      begin
      end
    }
  }
}`;

const PaymentHistory = () => {
  const [show, setShow] = useState(false);
  const [showNewPayable, setShowNewPayable] = useState(false);
  const [newPayable, setNewPayable] = useState({});
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentDate, setCurrentDate] = useState();
  const [currentSearch, setCurrentSearch] = useState('');
  const { loading, error, data, variables, refetch } = useQuery(GET_DATA, {
    variables: { date: '2023-01-01', offset: 0, first: 10, search: '' },
  });

  useEffect(() => {
    const localDate = new Date(Date.now());
    localDate.setHours(23, 59, 59);
    const utcDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
    refetch({ date: utcDate, offset: 0, first: 10 });
    setCurrentDate(localDate.toLocaleDateString('en-CA'));
  }, []);

  if (loading) return <DataLoading />;
  if (error) return `Error! ${error}`;

  const handleHideNewPayable = () => setShowNewPayable(false);
  const handleShowNewPayable = () => {
    setNewPayable({});
    setShowNewPayable(true);
  }

  const handlePayableChange = (name, value) => {
    setErrors({});
    setNewPayable((p) => ({ ...p, [name]: value }));
  }

  const handlePeriodChange = (name, value) => {
    const localDate = new Date(value);
    localDate.setHours(23, 59, 59);
    const utcDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);

    refetch({ date: utcDate, offset: 0, first: 10 });
    setCurrentDate(value);
  }

  const handleSearch = async e => {
    e.preventDefault();
    refetch({ search: searchText, offset: 0 });
    setCurrentSearch(searchText);
  }

  const handleAddPayable = () => {
    let hadError = false;

    if (!newPayable?.nodeId) {
      setErrors(v => ({ ...v, nodeId: 'NodeId is required' }));
      hadError = true;
    }
    if (!newPayable?.date) {
      setErrors(v => ({ ...v, date: 'Date is required' }));
      hadError = true;
    }
    if (!newPayable?.comment) {
      setErrors(v => ({ ...v, comment: 'Comment is required' }));
      hadError = true;
    }
    if (!newPayable?.amount) {
      setErrors(v => ({ ...v, amount: 'Amount is required' }));
      hadError = true;
    }

    if (!hadError) {
      setProcessing(true);
      SendRequest('POST', '/api/v1/Bonuses/Manual', newPayable, () => {
        setProcessing(false);
        refetch();
        setShowNewPayable(false);
      }, (error) => {
        setProcessing(false);
        setErrors({ error: error });
        alert(error);
      });
    }
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  var totalPaid = 0;
  data.unreleasedSummary.forEach((item) => {
    totalPaid += item.paidAmount - item.realeased;
  });

  return <>
    <PageHeader title="Commission Payables">
      <div className="container-xl">
        <div className="row row-cards">

          <div className="col-lg-8 col-xl-9">
            <div className="card">
              <div className="card-body border-bottom py-3">
                <div className="row g-2 align-items-center">
                  <div className="col-auto">
                    <div className="dropdown">
                      <button className="btn btn-default" onClick={handleShowNewPayable}>
                        Add Payable
                      </button>
                    </div>
                  </div>
                  <div className="col">
                    <div className="w-100">
                      <form onSubmit={handleSearch} autoComplete="off">
                        <div className="input-icon">
                          <input className="form-control" tabIndex="1" placeholder="Enter search term" onChange={e => setSearchText(e.target.value)} />
                          <span className="input-icon-addon">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="10" cy="10" r="7"></circle><line x1="21" y1="21" x2="15" y2="15"></line></svg>
                          </span>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table card-table table-vcenter text-nowrap datatable">
                  <thead>
                    <tr>
                      <th className="text-center w-1"><i className="icon-people"></i></th>
                      <th>Customer</th>
                      <th>Bonus</th>
                      <th>Bonus Amount</th>
                      <th>Released</th>
                      <th>Amount Due</th>
                      <th>Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.unreleased && data.unreleased.map((item) => {
                      return <tr key={`${item.bonusId}_${item.amount}_${item.period.id}_${item.customer.id}`}>
                        <td className="text-center">
                          <Avatar name={item.customer.fullName} url={item.customer.profileImage} size="sm" />
                        </td>
                        <td>
                          <a className="text-reset" href={`/Customers/${item.customer.id}/commissions?periodId=${item.period.id}`}>{item.customer.fullName}</a>
                          <div className="small text-muted">{item.customer.id}</div>
                        </td>
                        <td>{item.bonusTitle}</td>
                        <td>{item.amount.toLocaleString("en-US", { style: 'currency', currency: 'USD' })}</td>
                        <td>{item.released.toLocaleString("en-US", { style: 'currency', currency: 'USD' })}</td>
                        <td>{(item.amount - item.released).toLocaleString("en-US", { style: 'currency', currency: 'USD' })}</td>
                        <td>
                          <LocalDate dateString={item.period.end} hideTime={true} />
                          <div className="small text-muted">
                            <span>Period: </span> <LocalDate dateString={item.commissionDate} />
                          </div>
                        </td>
                      </tr>
                    })}
                  </tbody>
                </table>
              </div>
              <div className="card-footer d-flex align-items-center">
                <Pagination variables={variables} refetch={refetch} total={data.totalUnreleased} />
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-xl-3">
            <div className="card mb-3 border shadow-0">
              <div className="card-body">
                <form>
                  <div className="form-group">
                    <label className="form-label">Commission cutoff date</label>
                    <div className="dropdown">
                      <DateInput name="currentDate" value={currentDate} onChange={handlePeriodChange} />
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                {data.unreleasedSummary && data.unreleasedSummary.map((bonus) => {
                  return <div key={bonus.description} className="d-flex justify-content-between">
                    <p className="mb-2">{bonus.description}:</p>
                    <p className="mb-2">{(bonus.paidAmount - bonus.realeased).toLocaleString("en-US", { style: 'currency', currency: 'USD' })}</p>
                  </div>
                })}

                <hr />
                <div className="d-flex justify-content-between">
                  <p className="mb-2">Total:</p>
                  <p className="mb-2 fw-bold">{totalPaid.toLocaleString("en-US", { style: 'currency', currency: 'USD' })}</p>
                </div>

                <div className="mt-3">
                  <button className="btn btn-success w-100 mb-2" onClick={handleShow} > Process Payables </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageHeader>

    {data.unreleasedSummary && <PayablesModal showModal={show} onHide={handleClose} cutoff={currentDate} search={currentSearch} data={data.unreleasedSummary} />}

    <Modal showModal={showNewPayable} onHide={handleHideNewPayable} >
      <div className="modal-header">
        <h5 className="modal-title">New Payable</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <div className="row">
          <div className="col-7 mb-3">
            <label className="form-label">Customer</label>
            <AutoComplete errorText={errors.nodeId} name="nodeId" value={newPayable?.nodeId ?? ''} onChange={handlePayableChange} />
          </div>
          <div className="col-5 mb-3">
            <label className="form-label">Period</label>
            <DateInput errorText={errors.date} name="date" value={newPayable?.date ?? 0} onChange={handlePayableChange} />
          </div>
          <div className="col-7 mb-3">
            <label className="form-label">Comment</label>
            <TextInput errorText={errors.comment} name="comment" value={newPayable?.comment ?? ''} onChange={handlePayableChange} />
          </div>
          <div className="col-5 mb-3">
            <label className="form-label">Amount</label>
            <NumericInput errorText={errors.amount} name="amount" value={newPayable?.amount ?? ''} onChange={handlePayableChange} />
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <a href="#" className="btn btn-link link-secondary" data-bs-dismiss="modal">
          Cancel
        </a>
        {processing && <button className="btn btn-primary ms-auto">
          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
          Creating Payable
        </button>}
        {!processing && <>
          <button type="submit" className="btn btn-primary ms-auto" onClick={handleAddPayable}>
            Add Payable
          </button>
        </>}
      </div>
    </Modal>

  </>
}

export default PaymentHistory;