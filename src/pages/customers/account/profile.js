import React from "react";
import { useParams } from "react-router-dom"
import { useQuery, gql } from "@apollo/client";
import PageHeader from "../../../components/pageHeader";
import DataLoading from '../../../components/dataLoading';
import AccountNav from "./accountNav";
import Avatar from "../../../components/avatar";

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

const CustomerProfile = () => {
  let params = useParams()

  const { loading, error, data } = useQuery(GET_CUSTOMER, {
    variables: { nodeIds: [params.customerId] },
  });

  if (loading) return <DataLoading />;
  if (error) return `Error! ${error}`;

  let user = data.customers[0].user;
  let customer = data.customers[0];

  return <PageHeader preTitle="Account" title={data?.customers[0].fullName} pageId="account" customerId={params.customerId}>
    <div className="container-xl">
      <div className="card">
        <div className="row g-0">
          <div className="col-sm-12 col-md-3 border-end border-bottom">
            <div className="card-body">
              <AccountNav pageId="profile" customerId={params.customerId} />
            </div>
          </div>
          <div className="col-sm-12 col-md-9">
            <div className="card-body">
              <div className="row">
                <div className="col-12 col-sm-auto mb-3">
                  <div className="mx-auto">
                    <Avatar name={`${customer.firstName} ${customer.lastName}`} size="lg" />
                  </div>
                </div>
                <div className="col d-flex flex-column flex-sm-row justify-content-between mb-3">
                  <div className="text-sm-left mb-2 mb-sm-0">
                    <h4 className="pt-sm-2 pb-1 mb-0 text-nowrap">{user?.firstName ?? customer.firstName} {user?.lastName ?? customer.lastName}</h4>
                    <p className="mb-0">{user?.username ?? customer.emailAddress}</p>
                  </div>
                  <div className="text-center text-sm-right">
                    <span className="badge badge-secondary">{user?.roleId ?? `No Account`}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageHeader>
}

export default CustomerProfile;