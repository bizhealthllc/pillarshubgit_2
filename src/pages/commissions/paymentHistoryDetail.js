import React from 'react';
import { useParams } from "react-router-dom"
import { useQuery, gql } from "@apollo/client";
import PageHeader from "../../components/pageHeader";
import DataLoading from "../../components/dataLoading";
import LocalDate from '../../util/LocalDate';
import Avatar from '../../components/avatar';
import Pagination from '../../components/pagination';

var GET_DATA = gql`query($batchId: String!) {
  batches (batchIds: [$batchId]) {
    created
    id,
    releases {
      id
      amount
      status
      customer
      {
        id
        fullName
        profileImage
      }
      period {
        id
        end
      }
    }
  }
}`

const PaymentHistoryDetail = () => {
  let params = useParams()
  const { loading, error, data, variables, refetch } = useQuery(GET_DATA, {
    variables: { batchId: params.batchId },
  });

  if (loading) return <DataLoading />;
  if (error) return `Error! ${error}`;

  const releases = data.batches[0]?.releases || [];

  // Grouping releases by customer.id and period.id
  const groupedReleases = releases.reduce((acc, release) => {
    const key = `${release.customer.id}-${release.period.id}`;

    if (!acc[key]) {
      acc[key] = { customer: release.customer, period: release.period, amount: 0, detail: [] };
    }

    acc[key].amount += release.amount;
    acc[key].detail.push(release);

    return acc;
  }, {});

  // Converting the grouped data into an array for rendering
  const groupedReleaseArray = Object.values(groupedReleases);

  return <PageHeader title="Commissions Paid">
    <div className="container-xl">
      <div className="card">
        <div className="card-header">
        <h3 className="card-title"><span className="me-auto">Batch Detail</span></h3>
        <span className="card-actions btn-actions"><LocalDate dateString={data.batches[0].created} /></span>
        </div>
        <div className="table-responsive">
          <table className="table card-table table-vcenter text-nowrap datatable">
            <thead>
              <tr>
                <th className="w-1"></th>
                <th className="">Customer</th>
                <th className="">Payment Id</th>
                <th className="">Bonus Total</th>
                <th className="">Payments</th>
                <th className="">Period</th>
              </tr>
            </thead>
            <tbody>
              {groupedReleaseArray.map((release) => {
                return <tr key={release.id}>
                  <td className="text-center">
                    <Avatar name={release.customer.fullName} url={release.customer.profileImage} size="sm" />
                  </td>
                  <td>
                    <a className="text-reset" href={`/Customers/${release.customer.id}/commissions?periodId=${release.period.id}`}>{release.customer.fullName}</a>
                    <div className="small text-muted">{release.customer.id}</div>
                  </td>
                  <td className="">
                  {release.detail.map((s) => {
                      return <div key={s.amount} className="mb-2">
                        <span className="me-3">{s.id}</span>
                      </div>
                    })}
                  {/* {(release.amount).toLocaleString("en-US", { style: 'currency', currency: 'USD' })} */}
                  </td>
                  <td className="">
                  {release.detail.map((s) => {
                      return <div key={s.amount} className="mb-2">
                        <span className="me-3">{s.amount.toLocaleString("en-US", { style: 'currency', currency: 'USD' })}</span>
                      </div>
                    })}
                  {/* {(release.amount).toLocaleString("en-US", { style: 'currency', currency: 'USD' })} */}
                  </td>
                  <td>
                  {release.detail.map((s) => {
                      return <div key={s.amount} className="mb-2">
                        {s.status == "SUCCESS" && <><span className ="badge bg-success me-1"></span> Paid </>}
                        {s.status == "PENDING" && <><span className ="badge bg-warning me-1"></span> Pending </>}
                        {s.status == "FAILURE" && <><span className ="badge bg-danger me-1"></span> Failed </>}
                      </div>
                    })}
                  </td>
                  <td><LocalDate dateString={release.period.end} hideTime="true" /></td>
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

export default PaymentHistoryDetail;