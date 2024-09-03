import React, { useState } from 'react';
import { GetScope } from "../../features/authentication/hooks/useToken"
import { useQuery, gql } from "@apollo/client";
import { useParams } from "react-router-dom"
import { useFetch } from "../../hooks/useFetch";
import DataLoading from '../../components/dataLoading';

import PageHeader from '../../components/pageHeader';
import Widget from '../../features/widgets/components/widget';
import DataError from '../../components/dataError';

var GET_CUSTOMER = gql`query ($nodeIds: [String]!, $periodDate: Date!) {
  customers(idList: $nodeIds) {
    id
    fullName
    enrollDate
    profileImage
    status {
      id
      name
      statusClass
    }
    emailAddress
    customerType {
      id
      name
    }
    socialMedia {
      name
      value
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
    cards(idList: ["Dashboard"], date: $periodDate) {
      id
      values {
        value
        valueName
        valueId
      }
    }
    widgets {
      id
      name
      title
      description
      type
      showDatePicker
      headerColor
      headerTextColor
      headerAlignment
      backgroundColor
      textColor
      borderColor
      css
      panes {
        imageUrl
        title
        text
        description
        values {
          text
          value
        }
      }
    }
  }
  trees {
    id
    name
    nodes(nodeIds: $nodeIds, date: $periodDate) {
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
    period(date: $periodDate) {
      rankAdvance(nodeIds: $nodeIds) {
        nodeId
        rankId
        rankName
        requirements {
          maintanance
          conditions {
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
  customerStatuses {
    id
    name
    statusClass
    earningsClass
  }
}`;

const Dashboard = () => {
  let params = useParams()
  const [iDate] = useState(new Date().toISOString());
  const { data: dashboard, loading: dbLoading, error: dbError } = useFetch('/api/v1/dashboards/PDB', {});
  const { loading, error, data } = useQuery(GET_CUSTOMER, {
    variables: { nodeIds: [params.customerId], periodDate: iDate },
  });

  if (loading || dbLoading) return <DataLoading />;
  if (error) return <DataError error={error} />
  if (dbError) return <DataError error={dbError} />

  let customer = data?.customers[0];
  let compensationPlans = data?.compensationPlans;
  let trees = data?.trees;
  let widgets = customer?.widgets;

  const showTitle = false;
  const title = (GetScope() == undefined && showTitle) ? data?.customers[0]?.fullName : '';
  const preTitle = (GetScope() == undefined && showTitle) ? 'Dashboard' : '';

  return <>
    <PageHeader title={title} preTitle={preTitle} pageId="dashboard" customerId={params.customerId}>
      <div className="container-xl">
        <div className="row row-cards row-deck mb-3">
          {dashboard && dashboard?.children && dashboard.children.map((card) => {
            return buildCard(card, widgets, customer, compensationPlans, trees, iDate);
          })}
        </div>
      </div>
    </PageHeader>
  </>
};

function buildCard(card, widgets, customer, compensationPlans, trees, date) {
  if ((card?.widgetId || card?.children) && widgets !== undefined) {
    let widget = widgets.find((w) => w.id === card?.widgetId ?? '');
    if (!widget && (!card.children || card.children.length == 0)) return <></>

    return <div key={card?.id} className={`col-sm-12 col-lg-${card?.columns > 6 ? '12' : '6'} col-xl-${card?.columns}`}>
      {card?.widgetId && widget && <Widget key={card?.widgetId} widget={widget} customer={customer} compensationPlans={compensationPlans} trees={trees} date={date} />}
      {card.children && card.children.length > 0 && <>
        <div className="card card-borderless card-transparent">
          <div className="row row-cards row-deck">
            {card.children.map((c) => {
              return buildCard(c, widgets, customer, compensationPlans, trees, date);
            })}
          </div>
        </div>
      </>}
    </div>
  }
}

export default Dashboard;