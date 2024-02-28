import React from 'react';
import { useQuery, gql } from "@apollo/client";
import PageHeader from "../../components/pageHeader";
import DataLoading from "../../components/dataLoading";
import LocalDate from '../../util/LocalDate';
import Pagination from '../../components/pagination';

var GET_DATA = gql`query ($offset: Int!, $first: Int!) {
  batches (offset: $offset, first: $first) {
    created
    id,
    count,
    amount
  }
  totalBatches
}`

const PaymentHistory = () => {
  const { loading, error, data, variables, refetch } = useQuery(GET_DATA, {
    variables: { offset: 0, first: 10 },
  });

  if (loading) return <DataLoading />;
  if (error) return `Error! ${error}`;

  return <PageHeader title="Commissions Paid">
    <div className="container-xl">
      <div className="card">
        <div className="table-responsive">
          <table className="table card-table table-vcenter text-nowrap datatable">
            <thead>
              <tr>
                <th>Batch Id</th>
                <th>Created</th>
                <th>Released Amount</th>
                <th>Released Count</th>
              </tr>
            </thead>
            <tbody>
              {data.batches && data.batches.map((batch) => {
                return <tr key={batch.id}  >
                  <td>
                    <a href={`/commissions/paid/${batch.id}`}>Batch {batch.id}</a>
                    </td>
                  <td><LocalDate dateString={batch.created} /></td>
                  <td>{batch.amount.toLocaleString("en-US", { style: 'currency', currency: 'USD' })}</td>
                  <td>{batch.count}</td>
                </tr>
              })}
            </tbody>
          </table>
        </div>
        <div className="card-footer d-flex align-items-center">
          <Pagination variables={variables} refetch={refetch} total={data.totalBatches} />
        </div>
      </div>
    </div>

  </PageHeader >
}

export default PaymentHistory;