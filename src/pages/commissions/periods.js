import React from "react-dom/client";
import { useQuery, gql } from "@apollo/client";
import DataLoading from "../../components/dataLoading";
import PageHeader from "../../components/pageHeader";
import LocalDate from "../../util/LocalDate";

var GET_PERIODS = gql`query ($date: Date!) {
  compensationPlans(first: 1) {
    name
    periods(date: $date, previous: 10) {
      id
      begin
      end
      status
      totalCommissions
      totalCustomers
      totalCustomersPaid
      totalVolume
    }
  }
}`;

const Periods = () => {
  const currentDate = new Date(Date.now());
  const isoDate = currentDate.toISOString();
  const dateOnly = isoDate.split('T')[0];
  const { loading, error, data, } = useQuery(GET_PERIODS, {
      variables: { date: dateOnly },
  });

  if (loading) return <DataLoading />;
  if (error) return `Error! ${error}`;

  let periods = [...data.compensationPlans[0].periods];
  periods.reverse();

  return <PageHeader title="Commission Periods">
    <div className="container-xl">
      <div className="row row-cards">
        <div className="col-12">
          <div className="card">
            <div className="card-body border-bottom py-3">
              <div className="d-flex">
                <div className="ms-auto text-muted">
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table card-table table-vcenter text-nowrap datatable">
                <thead>
                  <tr>
                    <th className="text-center w-1"><i className="icon-people"></i></th>
                    <th>Period</th>
                    <th>Status</th>
                    <th>Paid Count</th>
                    <th>Total Volume</th>
                    <th>Commission Paid</th>
                    <th className="text-center">Percent Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {periods && periods.map((period) =>
                  {
                    let percent = period.totalVolume > 0 ? Math.round((period.totalCommissions / period.totalVolume) * 100) : 0;
                    return <tr key={period.id}>
                      <td className="text-center"></td>
                      <td>
                        <div>
                          <a href={`/commissions/periods/${period.id}/summary`} >
                            <LocalDate dateString={period.end} />
                          </a>
                        </div>
                        <div className="small text-muted">
                          Starts: <LocalDate dateString={period.begin} />
                        </div>
                      </td>
                      <td>{period.status}</td>
                      <td>{period.totalCustomersPaid}</td>
                      <td>{period.totalVolume}</td>
                      <td>{period.totalCommissions.toLocaleString("en-US", { style: 'currency', currency: 'USD'})}</td>
                      <td className="text-center">
                        <div className="row align-items-center">
                          <div className="col-12 col-lg-auto">{percent}%</div>
                            <div className="col">
                            <div className="progress">
                              <div className="progress-bar" style={{width: `${percent}%`}} role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100" aria-label={`{percent}% Complete`}>
                                <span className="visually-hidden">{percent}% Complete</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  })}
                </tbody>
              </table>
            </div>
            <div className="card-footer d-flex align-items-center">
              <ul className="pagination m-0 ms-auto">
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageHeader>
}

export default Periods;