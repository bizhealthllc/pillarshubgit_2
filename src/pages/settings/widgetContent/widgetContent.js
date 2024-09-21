import React from "react";
import PropTypes from 'prop-types';
import { WidgetTypes } from "../../../features/widgets/hooks/useWidgets";
import ProfileContent from "./profileContent";
import RankContent from "./rankContent";
import UplineContent from "./uplineContent";
import CalendarContent from "./calendarContent";
import CardContent from "./cardContent";
import BannerContent from "./bannerContent";
import SocialLinksContent from "./socialLinksContent";
import HtmlContent from "./htmlContent";
import EarningsContent from "./earningsContent";

const WidgetContent = ({ widget, updateWidget, trees, definitions }) => {
  
  switch (widget?.type) {
    case WidgetTypes.Profile:
      return <ProfileContent widget={widget} updateWidget={updateWidget} />;
    case WidgetTypes.Rank:
      return <RankContent widget={widget} updateWidget={updateWidget} definitions={definitions}/>;
    case WidgetTypes.Upline:
      return <UplineContent widget={widget} updateWidget={updateWidget} trees={trees} />;
    case WidgetTypes.Calendar:
      return <CalendarContent widget={widget} updateWidget={updateWidget} />;
    case WidgetTypes.Card:
      return <CardContent widget={widget} updateWidget={updateWidget} definitions={definitions} />;
    case WidgetTypes.Banner:
      return <BannerContent widget={widget} updateWidget={updateWidget} />;
    case WidgetTypes.SocialLinks:
      return <SocialLinksContent widget={widget} updateWidget={updateWidget} />;
    case WidgetTypes.Html:
      return <HtmlContent widget={widget} updateWidget={updateWidget} />
    case WidgetTypes.Earnings:
      return <EarningsContent widget={widget} updateWidget={updateWidget} />
  }

  return <></>
}

export default WidgetContent;

WidgetContent.propTypes = {
  widget: PropTypes.any.isRequired,
  updateWidget: PropTypes.func.isRequired,
  trees: PropTypes.any.isRequired,
  definitions: PropTypes.any.isRequired
}
