import React from "react";
import PropTypes from 'prop-types';
import Switch from "../../../components/switch";
import DataFieldSelectorList from "../../../components/dataFieldSelectorList";
import SelectInput from "../../../components/selectInput";

const DonutContent = ({ widget, updateWidget, definitions }) => {
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
      <label className="mt-2 form-label">Segment Count</label>
      <div> 
        <div className="my-3">
          <div className="row">
            <div className="col-md-4">
              <SelectInput name="segments" value={widget?.settings?.['segments']} onChange={handleWidgetSettingsChange} emptyText="Select Segment Count">
                <option selected={'selected'}>Select Segment Count</option>
                <option value="0">Auto</option>
                <option value="3">Fixed to 3</option>
              </SelectInput>
            </div>
          </div> 
        </div>
      </div>
      <label className="form-label mt-4">Chart Data Fields Configuration</label>
      <div>
        <DataFieldSelectorList name="dataFields" count={5} onChange={handleWidgetSettingsChange} definitions={definitions} settings={widget?.settings?.dataFields}></DataFieldSelectorList>
      </div>
      <label className="form-label mt-4">Summary Fields</label>
      <div>
        <DataFieldSelectorList name="summaryFields" count={2} onChange={handleWidgetSettingsChange} definitions={definitions} settings={widget?.settings?.summaryFields}></DataFieldSelectorList>
      </div>
      <label className="form-label mt-4">Center Field</label>
      <div>
        <DataFieldSelectorList name="centerField" count={1} onChange={handleWidgetSettingsChange} definitions={definitions} settings={widget?.settings?.centerField}></DataFieldSelectorList>
      </div>
    </>
  );
};

DonutContent.propTypes = {
  widget: PropTypes.any.isRequired,
  updateWidget: PropTypes.func.isRequired,
  customer: PropTypes.object,
  definitions: PropTypes.any.isRequired
};

export default DonutContent;
