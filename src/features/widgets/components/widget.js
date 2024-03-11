import React, { useState } from "react";
import PropTypes from 'prop-types';
import { WidgetTypes } from "../hooks/useWidgets";

import Avatar from '../../../components/avatar';
import StatusPill from '../../../pages/customers/statusPill';
import Calendar from '../../../components/calendar';
import RankAdvance from '../../../components/rankAdvance';

import "./widget.css";
import EmptyContent from "../../../components/emptyContent";
import SocialMediaLink from "../../../components/socialMediaLink";
import { SocialMediaPlatforms } from "../../../components/socialMediaIcon";

const Widget = ({ widget, customer, commissionDetail, trees, isPreview = false }) => {
  const [widgetId] = useState(() => 'wd_' + crypto.randomUUID().replace(/-/g, '_'));
  if (widget == undefined) return <EmptyContent title="Widget not found" text="Please check your widget library to verify it has been configured correctly." />;
  if (!customer) {
    customer = {
      fullName: 'Example Customer', profileImage: '', customerType: { name: 'Customer' }, status: { name: 'Active' },
      cards: [{ values: [{ valueName: 'Example', valueId: 'Ex', value: '22' }] }]
    }
  }

  if (!commissionDetail) {
    commissionDetail = { rankAdvance: [{ rankId: 10, rankName: 'Example Rank', requirements: [{ conditions: [{ valueId: "Personal Volume", value: 20, required: 20 }, { valueId: "Group Volume", value: 90, required: 200 }] }] }] }
  }

  if (isPreview) {
    trees = trees?.map((tree) => ({
      ...tree,
      nodes: [{ upline: { fullName: 'Example Customer' } }]
    }))

    customer = { ...customer, socialMedia: SocialMediaPlatforms.map((p) => ({ name: p.name, value: 'preview' })) };
  }

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


  const styleTag = {
    __html: modifiedCss,
  };

  return <div style={{ display: "contents" }} className={widgetId}><div className="card" style={inlineStyle}>
    {widget.title && <div className="card-header" style={{ backgroundColor: (widget?.headerColor ?? '#ffffff') }}>
      <h3 className={`card-title ${msStyle} ${meStyle}`}>{widget.title}</h3>
    </div>}
    <style dangerouslySetInnerHTML={styleTag} />
    {Content(widget, customer, commissionDetail, trees, isPreview)}
  </div></div>
}

function Content(widget, customer, commissionDetail, trees, isPreview) {
  const [carouselId] = useState(() => 'carousel_' + crypto.randomUUID().replace(/-/g, '_'));

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
      //const randomNumber = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
      return <div className="card-body">
        <div className="datagrid widgetDatagrid">
          {widget.panes.map((pane) => {
            const emptyValue = isPreview ? Math.floor(Math.random() * (5000 - 100 + 1)) + 100 : 0;
            const stat = values.find((s) => s.valueId == pane.title) ?? { value: emptyValue };
            return <div key={pane.title} className="datagrid-item" style={{ color: pane.imageUrl }}>
              <div className="datagrid-title">{pane.text} ({pane.title})</div>
              <div className="h2 datagrid-content">{stat.value.toLocaleString()}</div>
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
                  <div className="carousel-caption d-none d-md-block">
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
    return <RankAdvance ranks={commissionDetail?.rankAdvance} />
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
                  <Avatar name={node.upline.fullName} url={node.upline.profileImage} size="sm" />
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
    return <Calendar />
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

  return <div id={`wdg_${widget.id}`} className={`card`}>
    {JSON.stringify(widget)}
  </div>
}

export default Widget;

Widget.propTypes = {
  widget: PropTypes.any.isRequired,
  customer: PropTypes.any.isRequired,
  commissionDetail: PropTypes.any.isRequired,
  trees: PropTypes.any.isRequired,
  isPreview: PropTypes.bool
}
