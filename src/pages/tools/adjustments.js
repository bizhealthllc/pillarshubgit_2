import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import PageHeader from "../../components/pageHeader";
import { useFetch } from "../../hooks/useFetch"
import { SendRequest } from "../../hooks/usePost";
import DataLoading from "../../components/dataLoading";
import Modal from "../../components/modal";
import AutoComplete from "../../components/autocomplete";

var GET_DATA = gql`query ( $date: Date!) {
    compensationPlans(first: 1) {
        periods(date: $date) {
          id
          begin
          end
          status
        }
    }
}`;

const Adjustments = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const periodId = queryParams.get("periodId") ?? "0";
    const {data, loading, error, refetch} = useFetch(`/api/v1/CompensationPlans/0/Periods/${periodId}/HistoricalValues?offset=0&count=1000`);

    const currentDate = new Date(Date.now());
    const isoDate = currentDate.toISOString();
    const dateOnly = isoDate.split('T')[0];
    const { data: qData, loading: qLoading, error: qError } = useQuery(GET_DATA, {
        variables: { date: dateOnly },
    });

    const [show, setShow] = useState(false);
    const [activeItem, setActiveItem] = useState({});

    if (loading) return <DataLoading />;
    if (error) return `Error! ${error}`;

    if (qLoading) return <DataLoading />;
    if (qError) return `Error! ${error}`;

    const handleChange = (name, value) => {
        setActiveItem(values => ({...values, [name]: value}))
    }

    const handleSubmit = async e => {
        e.preventDefault();
        
        if (!activeItem.key) { alert("Volume is required"); return;}
        if (!activeItem.nodeId) { alert("Customer is required"); return;}
        if (!activeItem.value) { alert("Value is required"); return;}
        if (!activeItem.periodId) { alert("Period is required"); return;}
        
        setShow(false);

        let item = {
            key: activeItem.key,
            periodId: activeItem.periodId,
            nodeId: activeItem.nodeId,
            sumValue: activeItem.value
        }

        var url = "/api/v1/historicalValues";
        var method = "POST";

        SendRequest(method, url, item, () =>
        {
            refetch();
        }, (error, code) =>
        {
            alert(`${code}: ${error}`);
        });
    }

    const handleClose = () => setShow(false);
    const handleShow = (id) => {
        var item = data.find(element => element.id == id);
        if (item === undefined) item = { isNew: true };
        setActiveItem(item);
        setShow(true);
    }

    const options = {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute:'2-digit' };

    return <PageHeader title="Adjustments">
        <div className="container-xl">
        <div className="row row-cards">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-body border-bottom py-3">
                            <div className="row g-2 align-items-center">
                                <div className="col-auto">
                                    <button className="btn btn-default" onClick={() => handleShow('')}>
                                        Add Adjustment
                                    </button>
                                </div>
                                <div className="col">
                                    <div className="w-100">
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="table-responsive">
                                <table className="table card-table table-vcenter text-nowrap datatable">
                                    <thead>
                                        <tr>
                                            <th>Customer Id</th>
                                            <th>Volume</th>
                                            <th>Adjustment Amount</th>
                                            <th>Date</th>
                                            <th className="w-1"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data && data.map((adj) =>{
                                            return <tr key={adj.id}>
                                                <td>{adj.nodeId}</td>
                                                <td>{adj.key}</td>
                                                <td>{adj.sumValue}{adj.lastValue}</td>
                                                <td>{adj.postDate}</td>
                                            </tr>
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Modal showModal={show} onHide={handleClose} >
            <div className="modal-header">
                <h5 className="modal-title">Add Adjustment</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <div className="row">
                <div className="col-md-12">
                        <div className="mb-3">
                            <label className="form-label">Volume</label>
                            <select className="form-select" name="key" value={activeItem.key || ""} onChange={(e) => handleChange(e.target.name, e.target.value)}>
                                <option value="" >Select Option</option>
                                <option value="CV">CV</option>
                                <option value="PV">PV</option>
                                <option value="LLR">Left Leg Rollover</option>
                                <option value="RLR">Right Leg Rollover</option>
                            </select>
                            <span className="text-danger"></span>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="mb-3">
                            <label className="form-label required">Customer</label>
                            <AutoComplete name="nodeId" onChange={handleChange} />
                            <span className="text-danger"></span>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label">Value</label>
                            <input className="form-control" name="value" value={activeItem.value || ""} onChange={(e) => handleChange(e.target.name, e.target.value)} />
                            <span className="text-danger"></span>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label">Period</label>
                            <select className="form-select" name="periodId" value={activeItem.periodId || ""} onChange={(e) => handleChange(e.target.name, e.target.value)}>
                                <option value="" >Select Option</option>
                                {qData.compensationPlans[0].periods && qData.compensationPlans[0].periods.map((period) =>{
                                    return <option key={period.id} value={period.id} >{new Date(period.end).toLocaleTimeString('en-US', options)}</option>
                                })}
                            </select>
                            <span className="text-danger"></span>
                        </div>
                    </div>
                </div>                
            </div>
            <div className="modal-footer">
                <a href="#" className="btn btn-link link-secondary" data-bs-dismiss="modal">
                  Cancel
                </a>
                <button type="submit" className="btn btn-primary ms-auto" onClick={handleSubmit}>
                    Save Adjustment
                </button>
            </div>
        </Modal>
        
    </PageHeader>
}

export default Adjustments;