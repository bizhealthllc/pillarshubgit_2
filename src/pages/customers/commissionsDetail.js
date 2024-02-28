import React, { useState } from 'react';
import { useParams } from "react-router-dom"
import { useQuery, gql } from "@apollo/client";
import PageHeader from "../../components/pageHeader";
import DataLoading from "../../components/dataLoading";
import PeriodPicker from "../../components/periodPicker";
import LocalDate from '../../util/LocalDate';
import DataCard from '../../components/dataCard';

var GET_DATA = gql`query ($nodeIds: [String]!, $period: BigInt!) {
  customers(idList: $nodeIds) {
    id
    fullName
    cards(idList: ["Earnings"], periodId: $period){
      id
      values{
        value
        valueName
        valueId
      }
    }
  }
  compensationPlans(first: 1) {
    periods(at: $period) {
      id
      begin
      end
      status
      bonuses(nodeIds: $nodeIds) {
        bonusId
        nodeId
        amount
        bonusTitle
        description
        level
        rank
        released
        percent
        commissionDate
        volume
      } 
    }
  }
}`;

const CommissionsDetail = () => {
  let params = useParams();
  const queryParams = new URLSearchParams(window.location.search);
  const periodParam = queryParams.get("periodId") ?? "0";
  const [periodId, setPeriodId] = useState(periodParam);
  const { data, loading, error, refetch } = useQuery(GET_DATA, {
    variables: { nodeIds: [ params.customerId ], period: parseInt(periodId) },
  });

  if (loading) return <DataLoading />;
  if (error) return `Error! ${error}`;

  const handlePeriodChange = (pId, u) => {
    if (u) {
      setPeriodId(pId);
      refetch({ periodIds: [ pId ], period: parseInt(periodId) });
    }
  };

  let customer = data.customers[0];
  let bonuses = [];
  if (data?.compensationPlans[0]?.periods[0]?.bonuses)
  {
    bonuses = [...data.compensationPlans[0].periods[0].bonuses];
    bonuses.sort((a, b) => (a.bonusId > b.bonusId) ? 1 : -1);
  }

  return <PageHeader preTitle="Commissions Detail" title={data?.customers[0].fullName} pageId="commissions" customerId={params.customerId}>
    <div className="container-xl">
      <div className="col-12">
        <div className="card mb-3">
          <div className="card-header">
            <h3 className="card-title">Bonuses Earned</h3>
            <div className="card-actions">
              <PeriodPicker periodId={periodId} setPeriodId={handlePeriodChange} />
            </div>
          </div>
          <div className="table-responsive">
            <table className="table card-table table-vcenter text-nowrap datatable">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Bonus Name</th>
                  <th>Level</th>
                  <th>Amount</th>
                  <th>Percent</th>
                  <th>Volume</th>
                  <th>Released</th>
                  <th>Rank</th>
                </tr>
              </thead>
              <tbody>
                {bonuses && bonuses.map((bonus) => {
                  return <tr key={bonus.bonusId}>
                    <td><LocalDate dateString={bonus.commissionDate} hideTime="true" /></td>
                    <td>
                      <a className="text-reset" href={`/customers/${params.customerId}/commissions/${bonus.bonusId}?periodId=${periodId}`}>{bonus.bonusTitle}</a>
                    </td>
                    <td>{bonus.level}</td>
                    <td>{bonus.amount.toLocaleString("en-US", { style: 'currency', currency: bonus?.currency ?? 'USD'})}</td>
                    <td>{bonus.percent}</td>
                    <td>
                      <a className="text-reset" href={`/customers/${params.customerId}/commissions/${bonus.bonusId}?periodId=${periodId}`}>{bonus.volume}</a>
                    </td>
                    <td>{bonus.released.toLocaleString("en-US", { style: 'currency', currency: bonus?.currency ?? 'USD'})}</td>
                    <td>{bonus.rank}</td>
                  </tr>
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">All Commission Values</h3>
          </div>
          <div className="card-body">
            <div className="datagrid">
              <DataCard data={customer.cards[0]?.values} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageHeader>
}

export default CommissionsDetail;