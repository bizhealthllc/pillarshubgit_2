import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid'; // Using uuid library for fallback
import { useQuery, gql } from "@apollo/client";
import { WidgetTypes } from "../hooks/useWidgets";

import Avatar from '../../../components/avatar';
import StatusPill from '../../../pages/customers/statusPill';
import Calendar from '../../../components/calendar';
import RankAdvance from '../../../components/rankAdvance';
import PeriodDatePicker from "../../../components/periodDatePicker";

import "./widget.css";
import EmptyContent from "../../../components/emptyContent";
import SocialMediaLink from "../../../components/socialMediaLink";
import { SocialMediaPlatforms } from "../../../components/socialMediaIcon";
import HtmlWidget from "./htmlWidget";

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
  }
}`;

const generateUUID = () => {
  try {
    return crypto.randomUUID().replace(/-/g, '_');
  } catch (e) {
    return uuidv4().replace(/-/g, '_');
  }
};

const Widget = ({ widget, customer, compensationPlans, trees, isPreview = false, date }) => {
  const [wDate, setWDate] = useState(date);
  const [loading, setLoading] = useState(false);
  const [sCustomer, setSCustomer] = useState(customer);

  const [widgetId] = useState(() => 'wd_' + generateUUID());
  const { refetch } = useQuery(GET_CUSTOMER, {
    variables: { nodeIds: [customer?.id], periodDate: date },
    skip: true, // Initially skip the query
  });

  if (widget == undefined) return <EmptyContent title="Widget not found" text="Please check your widget library to verify it has been configured correctly." />;

  const inlineStyle = {
    "--tblr-bg-surface": (widget?.backgroundColor ?? '#ffffff'),
    "--tblr-card-color": (widget?.textColor ?? '#1d273b'),
    "--tblr-table-color": (widget?.textColor ?? '#1d273b'),
    "--tblr-card-title-color": (widget?.headerTextColor ?? '#1d273b'),
    "--tblr-card-title-gb": (widget?.headerColor ?? '#ffffff'),
    "--tblr-border-color": (widget?.borderColor ?? '#e6e7e9'),
  };

  var msStyle = widget?.headerAlignment == 'center' || widget?.headerAlignment == "right" ? "ms-auto" : '';
  var meStyle = widget?.headerAlignment == 'center' || widget?.headerAlignment == "left" ? "me-auto" : '';

  const modifiedCss = widget?.css?.replace(/([^,{}]+)(?=\s*{)/g, (match) => `.${widgetId} ${match}`) ?? '';

  useEffect(() => {
    if (wDate != date && !isPreview) {
      console.log('Loadding');
      setLoading(true);
      refetch({ nodeIds: [customer.id], periodDate: wDate })
        .then((result) => {
          setLoading(false);
          setSCustomer(result.data?.customers[0]);
        })
        .catch((error) => {
          setLoading(false);
          console.error('Refetch error:', error);
        });
    }
  }, [wDate]);

  const handleDateChange = (name, value) => {
    setWDate(value);
  }

  const styleTag = {
    __html: modifiedCss,
  };

  return <div style={{ display: "contents" }} className={widgetId}><div className={`card h-100 ${isPreview ? '' : 'mb-3'}`} style={inlineStyle}>
    {widget.title && <div className="card-header" style={{ backgroundColor: (widget?.headerColor ?? '#ffffff') }}>
      <h3 className={`card-title ${msStyle} ${meStyle}`}>{widget.title}</h3>
      {widget.showDatePicker && <>
        <div className="card-actions">
          <PeriodDatePicker name="date" value={wDate} onChange={handleDateChange} />
        </div>
      </>}

    </div>}
    <style dangerouslySetInnerHTML={styleTag} />
    {Content(widget, sCustomer, compensationPlans, trees, isPreview, loading)}
  </div></div>
}

function Content(widget, customer, compensationPlans, trees, isPreview, loading) {
  const [carouselId] = useState(() => 'carousel_' +  + generateUUID());

  if (!compensationPlans) {
    compensationPlans = [{ period: { rankAdvance: [{ rankId: 10, rankName: 'Example Rank', requirements: [{ conditions: [{ valueId: "Personal Volume", value: 20, required: 20 }, { valueId: "Group Volume", value: 90, required: 200 }] }] }] } }]
  }

  if (!customer) {
    customer = {
      id: "EX456", fullName: 'Example Customer', profileImage: '', customerType: { name: 'Customer' }, status: { name: 'Active', statusClass: "Active" },
      emailAddress: 'example@pillarshub.com', language: "en",
      phoneNumbers: [{ type: 'Mobile', number: '(555) 555-5555' }, { type: 'Work', number: '(333) 333-3333' }],
      addresses: [{ type: "Shipping", line1: '', line2: '', line3: '', city: '', stateCode: '', zip: '', countryCode: '' }],
      cards: [{ values: [{ valueName: 'Example', valueId: 'Ex', value: '22' }] }]
    }
  }

  if (isPreview) {
    trees = trees?.map((tree) => ({
      ...tree,
      nodes: [{ upline: { fullName: 'Example Customer' } }]
    }))

    customer = { ...customer, socialMedia: SocialMediaPlatforms.map((p) => ({ name: p.name, value: 'preview' })) };
  }


  if (widget?.type == WidgetTypes.Profile) {
    return <div className="card-body py-4 text-center">
      <Avatar name={customer.fullName} url={customer.profileImage} size="xl" block={false} />
      <h3 className="m-0 mb-1"><a href={`/Customers/${customer.id}/Summary`}>{customer.fullName}</a></h3>
      <div className="widget-muted">{customer.customerType?.name}</div>
      <div className="mt-3">
        <StatusPill status={customer.status} />
      </div>
      {customer.socialMedia && <>
        <div className="row g-2 justify-content-center">
          {customer.socialMedia.map((link) => {
            if (link.value) {
              return <div key={link.name} className="col-auto py-3">
                <SocialMediaLink socialMediaId={link.name} link={link.value} />
              </div>
            }
          })}
        </div>
      </>}
    </div>
  }

  if (widget.type == WidgetTypes.Card) {
    var values = customer.cards[0]?.values;

    if (widget.panes) {
      return <div className="card-body">
        <div className="datagrid widgetDatagrid">
          {widget.panes.map((pane) => {
            const emptyValue = isPreview ? pane.values?.length > 0 ? pane.values[0].value : Math.floor(Math.random() * (5000 - 100 + 1)) + 100 : 0;
            const stat = values.find((s) => s.valueId == pane.title) ?? { value: emptyValue };
            const value = loading ? '-' : pane.values?.length > 0 ? pane.values.find((m) => m.value == stat.value)?.text ?? '-' : stat.value.toLocaleString();
            return <div key={pane.title} className="datagrid-item" style={{ color: pane.imageUrl }}>
              <div className="datagrid-title tooltip2">
                {pane.text}
                {pane.description && <span className="tooltiptext">{pane.description}</span>}
              </div>
              <div className="h2 datagrid-content">
                {value}
              </div>
            </div>
          })}
        </div>
      </div>
    } else {
      return <div className="card-body">
        <div className="datagrid widgetDatagrid">
          {values && values.map((stat) => {
            return <div key={stat.valueId} className="datagrid-item">
              <div className="datagrid-title">{stat.valueName} {stat.valueId == stat.valueName ? `` : `(${stat.valueId})`}</div>
              <div className="h2 datagrid-content">{stat.value}</div>
            </div>
          })}
        </div>
      </div>
    }
  }

  if (widget.type == WidgetTypes.Banner) {
    return <>
      <div id={carouselId} className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner content-bottom">
          {widget.panes && widget.panes.map((p, index) => {
            let active = index === 0; // Set 'active' to true for the first item
            return (
              <div key={p.title} className={`carousel-item ${active ? 'active' : ''}`}>
                <div className="image-container">
                  <img className="img-fluid" alt="" src={p.imageUrl} />
                </div>
                {p.title && <> <div className="carousel-caption-background d-none d-md-block"></div>
                  <div className="carousel-caption">
                    <h1>{p.title}</h1>
                    <p>{p.text}</p>
                  </div></>}
              </div>
            );
          })}
        </div>
        {widget.panes && widget.panes.length > 1 && <>
          <a className="carousel-control-prev" href={`#${carouselId}`} role="button" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </a>
          <a className="carousel-control-next" href={`#${carouselId}`} role="button" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </a>
        </>}
      </div>
    </>
  }

  if (widget.type == WidgetTypes.Rank) {
    let rankAdvance = compensationPlans.flatMap(plan => plan.period || []).find(period => period.rankAdvance?.length > 0)?.rankAdvance || null;
    return <RankAdvance ranks={rankAdvance} />
  }

  if (widget.type == WidgetTypes.Upline) {
    let panes = widget.panes ?? trees?.map((tree) => ({
      title: tree.name,
      text: tree.name,
      imageUrl: "true"
    }))

    return <div className="list-group list-group-flush">
      {panes && panes?.map((pane) => {
        if (pane.imageUrl.toLowerCase() == "true") {
          const node = trees?.find(tree => tree.name == pane.title)?.nodes?.[0];
          if (node) {
            return <div key={pane.title} className="list-group-item widgetListItem">
              <a className="row align-items-center text-reset" href={`/Customers/${node.uplineId}/Summary`}>
                <div className="col-auto">
                  <Avatar name={node.upline?.fullName} url={node.upline?.profileImage} size="sm" />
                </div>
                <div className="col text-truncate">
                  <span className='text-reset' >{node.upline?.fullName}</span>
                  <small className="d-block muted text-truncate mt-n1">{pane.text}</small>
                </div>
              </a>
            </div>
          }
        }
      })}
    </div>
  }

  if (widget.type == WidgetTypes.Calendar) {
    return <Calendar name={widget.id} />
  }

  if (widget.type == WidgetTypes.SocialLinks) {
    return <div className="card-body">
      <div className="row g-2 align-items-center justify-content-center">
        {customer.socialMedia && customer.socialMedia.some(item => item.value) && <>
          <div className="row g-2 justify-content-center">
            {customer.socialMedia.map((link) => {
              if (link.value) {
                return <div key={link.name} className="col-auto py-3">
                  <SocialMediaLink socialMediaId={link.name} link={link.value} />
                </div>
              }
            })}
          </div>
        </>}

        {!customer.socialMedia?.some(item => item.value) && <>
          <div className="empty">
            <p className="empty-title">No Social Links Configured</p>
          </div>
        </>}

      </div>
    </div>
  }

  if (widget.type == WidgetTypes.Html) {
    const html = widget.panes ? widget.panes[0]?.text : '';
    return <>
      <HtmlWidget html={html} customer={customer} widget={widget} />
    </>
  }

  return <div id={`wdg_${widget.id}`} className={`card`}>
    {JSON.stringify(widget)}
  </div>
}

export default Widget;

Widget.propTypes = {
  widget: PropTypes.any.isRequired,
  customer: PropTypes.any.isRequired,
  compensationPlans: PropTypes.any.isRequired,
  trees: PropTypes.any.isRequired,
  isPreview: PropTypes.bool,
  date: PropTypes.string.isRequired
}
