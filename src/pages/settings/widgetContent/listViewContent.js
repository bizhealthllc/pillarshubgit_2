import React from "react";
import PropTypes from 'prop-types';
import Switch from "../../../components/switch";
import TextInput from "../../../components/textInput";

const ListViewContent = ({ widget, updateWidget }) => {
  const handleWidgetSettingsChange = (name, value) => {
    updateWidget((prevWidget) => ({
      ...prevWidget,
      settings: {
        ...prevWidget.settings,
        [name]: value,
      },
    }));
  };
  
  return (
    <>
      <label className="mt-2 form-label">Visibility Toggles</label>
      <div> 
        <div className="my-3"> 
          <Switch name="showPreviousAndNext" value={widget?.settings?.['showPreviousAndNext']} title="Show Previous & Next" onChange={handleWidgetSettingsChange} />
        </div>
        <div className="my-3"> 
          <Switch name="showCurrentAndLast" value={widget?.settings?.['showCurrentAndLast']} title="Show Current & Last" onChange={handleWidgetSettingsChange} />
        </div>
      </div>
      <div className="row pt-2">
        <div className="col-md-3">
          <label className="form-label">View all Link</label>
          <TextInput name="viewAllLink" value={widget?.settings?.['viewAllLink']} placeholder={'/reports/123'} onChange={handleWidgetSettingsChange} />
        </div>
      </div>
    </>
  );
};

ListViewContent.propTypes = {
  widget: PropTypes.any.isRequired,
  updateWidget: PropTypes.func.isRequired
};

export default ListViewContent;
