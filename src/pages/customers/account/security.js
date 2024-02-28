import React, { useState } from "react";
import { useParams } from "react-router-dom"
import { useQuery, gql } from "@apollo/client";
import { SendRequest } from "../../../hooks/usePost";
import PageHeader from "../../../components/pageHeader";
import DataLoading from '../../../components/dataLoading';
import ChangePassword from "../../../features/authentication/components/changePassword";
import Modal from "../../../components/modal";
import AccountNav from "./accountNav";

var GET_CUSTOMER = gql`query ($nodeIds: [String]!) {
    customers(idList: $nodeIds) {
      id
      fullName
      firstName
      lastName
      emailAddress
      user{
        id
        username
        firstName
        lastName
        verified
        scope
      }
    }
  }`;

const CustomerSecurity = () => {
  let params = useParams();
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState('');
  const { loading, error, data, refetch } = useQuery(GET_CUSTOMER, {
    variables: { nodeIds: [params.customerId] },
  });

  if (loading) return <DataLoading />;
  if (error) return `Error! ${error}`;

  let user = data.customers[0].user;

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setShow(false);

    let user = {
      username: data.customers[0].emailAddress,
      password: password,
      firstName: data.customers[0].firstName,
      lastName: data.customers[0].lastName,
      roleId: 11,
      scope: data.customers[0].id
    };

    SendRequest("POST", "/api/v1/users", user, () => {
      refetch();
    }, (code, error) => {
      alert(`${code} - ${error}`);
    });
  }

  return <PageHeader preTitle="Account" title={data?.customers[0].fullName} pageId="account" customerId={params.customerId}>
    <div className="container-xl">
      <div className="card">
        <div className="row g-0">
          <div className="col-sm-12 col-md-3 border-end border-bottom">
            <div className="card-body">
              <AccountNav pageId="security" customerId={params.customerId} />
            </div>
          </div>
          <div className="col-sm-12 col-md-9">
            <div className="card-body">
              <div>
                {user != null &&
                  <>
                    <h1 className="card-title mb-4">Change Password</h1>
                    <ChangePassword userId={user.id} username={user.username} />
                  </>}
                {user == null &&
                  <>
                    <p className="empty-title">No account found</p>
                    <p className="empty-subtitle text-muted">
                      This customer does not have an account configured.
                    </p>
                    <div className="empty-action">
                      <button className="btn btn-primary" onClick={() => handleShow('')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Create Account
                      </button>
                    </div>
                  </>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Modal showModal={show} onHide={handleClose} >
      <div className="modal-header">
        <h5 className="modal-title">Create Account</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">

        <div className="row">
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input className="form-control" disabled="true" value={data.customers[0].emailAddress} />
              <span className="text-danger"></span>
            </div>
          </div>
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={password} onChange={(e) => { setPassword(e.target.value) }} />
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
          Create Account
        </button>
      </div>
    </Modal>

  </PageHeader>
}

export default CustomerSecurity;