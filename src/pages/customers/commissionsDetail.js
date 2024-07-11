import React, { useState } from 'react';
import { useParams } from "react-router-dom"
import { useQuery, gql } from "@apollo/client";
import PageHeader from "../../components/pageHeader";
import DataLoading from "../../components/dataLoading";
import PeriodPicker from "../../components/periodPicker";
import LocalDate from '../../util/LocalDate';

var GET_DATA = gql`query ($nodeIds: [String]!, $period: BigInt!) {
  customers(idList: $nodeIds) {
    id
    fullName
  }
  compensationPlans {
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
    ranks{
      id
      name
    }
  }
}`;

const CommissionsDetail = () => {
  let params = useParams();
  const queryParams = new URLSearchParams(window.location.search);
  const periodParam = queryParams.get("periodId") ?? "0";
  const [periodId, setPeriodId] = useState(periodParam);
  const { data, loading, error, refetch } = useQuery(GET_DATA, {
    variables: { nodeIds: [params.customerId], period: parseInt(periodId) },
  });

  if (loading) return <DataLoading />;
  if (error) return `Error! ${error}`;

  const handlePeriodChange = (pId, u) => {
    if (u) {
      setPeriodId(pId);
      refetch({ period: parseInt(pId) });
    }
  };

  var plan = data?.compensationPlans.find(item => 
    item.periods.some(subItem => subItem.bonuses)
  ) || null;

  let ranks = plan?.ranks;
  let bonuses = [];
  if (plan?.periods[0]?.bonuses) {
    bonuses = [...plan.periods[0].bonuses];
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
                    <td>{bonus.amount.toLocaleString("en-US", { style: 'currency', currency: bonus?.currency ?? 'USD' })}</td>
                    <td>{bonus.percent}</td>
                    <td>
                      <a className="text-reset" href={`/customers/${params.customerId}/commissions/${bonus.bonusId}?periodId=${periodId}`}>{bonus.volume}</a>
                    </td>
                    <td>{bonus.released.toLocaleString("en-US", { style: 'currency', currency: bonus?.currency ?? 'USD' })}</td>
                    <td>{ranks.find(r => r.id == bonus.rank)?.name}</td>
                  </tr>
                })}
                {(() => {
                  const totalAmount = bonuses.reduce((acc, bonus) => acc + bonus.amount, 0);
                  const totalVolume = bonuses.reduce((acc, bonus) => acc + bonus.volume, 0);
                  const totalReleased = bonuses.reduce((acc, bonus) => acc + bonus.released, 0);

                  return (
                    <tr className="table-light">
                      <td className="strong">Total</td>
                      <td></td>
                      <td></td>
                      <td className="strong">{totalAmount.toLocaleString("en-US", { style: 'currency', currency: bonuses[0]?.currency ?? 'USD' })}</td>
                      <td></td>
                      <td className="strong">{totalVolume}</td>
                      <td className="strong">{totalReleased.toLocaleString("en-US", { style: 'currency', currency: bonuses[0]?.currency ?? 'USD' })}</td>
                      <td></td>
                    </tr>
                  );
                })()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </PageHeader>
}

export default CommissionsDetail;