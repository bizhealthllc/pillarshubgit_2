import React from 'react';
import { GetScope } from "../../features/authentication/hooks/useToken"
import { useQuery, gql } from "@apollo/client";
import { useParams } from "react-router-dom"
import DataLoading from '../../components/dataLoading';

import PageHeader from '../../components/pageHeader';
import { useFetch } from "../../hooks/useFetch";
import useWidgets from '../../features/widgets/hooks/useWidgets';
import Widget from '../../features/widgets/components/widget';

var GET_CUSTOMER = gql`query ($nodeIds: [String]!, $periodId: ID!, $period: BigInt!) {
  customers(idList: $nodeIds) {
    id
    fullName
    enrollDate
    profileImage
    status
    {
      id,
      name,
      statusClass
    }
    emailAddress
    customerType {
      id
      name
    }
    language
    customData
    phoneNumbers {
      type
      number
    }
    addresses {
      type
      line1
      line2
      line3
      city
      stateCode
      zip
      countryCode
    }
    cards(idList: ["Dashboard"], periodId: $period){
      id
      values{
        value
        valueName
        valueId
      }
    }
  }
  trees {
    id
    name
    nodes(nodeIds: $nodeIds, periodId: $period) {
      nodeId
      uplineId
      uplineLeg
      upline {
        fullName
        profileImage
      }
    }
  }
  compensationPlans {
    period(id: $periodId) {
      rankAdvance(nodeIds: $nodeIds) {
        nodeId
        rankId
        rankName
        requirements {
          maintanance
          conditions
          {
            legCap
            legValue
            required
            value
            valueId
          }
        }
      }
    }
  }
  customerStatuses
  {
    id
    name
    statusClass
    earningsClass
  }
}`;

const Dashboard = () => {
  let params = useParams()
  const { data: dashboard, loading: dbLoading, error: dbError } = useFetch('/api/v1/dashboards', {});
  const { widgets, loading: wLoading, error: wError } = useWidgets();
  const { loading, error, data } = useQuery(GET_CUSTOMER, {
    variables: { nodeIds: [params.customerId], periodId: 0, period: 0 },
  });

  if (loading || dbLoading || wLoading) return <DataLoading />;
  if (error) return `Error! ${error}`;
  if (dbError) return `Error! ${dbError}`;
  if (wError) return `Error! ${wError}`;

  let customer = data.customers[0];
  let commissionDetail = data.compensationPlans[0].period;
  let trees = data.trees;

  const showTitle = false;
  const title = (GetScope() == undefined && showTitle) ? data?.customers[0]?.fullName : '';
  const preTitle = (GetScope() == undefined && showTitle) ? 'Dashboard' : '';

  return <>
    <PageHeader title={title} preTitle={preTitle} pageId="dashboard" customerId={params.customerId}>
      <div className="container-xl">
        <div className="row row-deck row-cards">

          {dashboard && dashboard[0]?.children && dashboard[0].children.map((card) => {
            return buildCard(card, widgets, customer, commissionDetail, trees);
          })}

        </div>
      </div>
    </PageHeader>
  </>
};

function buildCard(card, widgets, customer, commissionDetail, trees) {
  if ((card?.widgetId || card?.children) && widgets !== undefined) {
    let widget = widgets.find((w) => w.id === card?.widgetId ?? '');
    return <div key={card?.id} className={`col-sm-12 col-lg-${card?.columns > 6 ? '12' : '6'} col-xl-${card?.columns}`}>
      {card?.widgetId && <Widget widget={widget} customer={customer} commissionDetail={commissionDetail} trees={trees} />}
      {card.children &&
        <div className="row row-deck row-cards" style={{ gutterX: 0 }}>
          {card.children.map((c) => {
            return buildCard(c, widgets, customer, commissionDetail, trees);
          })}
        </div>
      }

    </div>
  }
}

export default Dashboard;