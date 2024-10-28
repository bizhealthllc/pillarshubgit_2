import React from "react";
import PropTypes from 'prop-types';
import Switch from "../../../components/switch";
import DataFieldSelectorList from "../../../components/dataFieldSelectorList";


const BarContent = ({ widget, updateWidget, customer, definitions }) => {

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
      <div className="my-3">
        <Switch
          name="toggleOrientation"
          value={widget?.settings?.toggleOrientation || false}
          title="Chart Vertical/Horiontal Orientation"
          onChange={() => handleWidgetSettingsChange("toggleOrientation", !widget?.settings?.toggleOrientation)} 
        />
      </div>

      <div>
        <div className="my-3">
          <Switch
            name="showPreviousAndNext"
            value={widget?.settings?.showPreviousAndNext}
            title="Show Previous & Next"
            onChange={handleWidgetSettingsChange}
          />
        </div>
        <div className="my-3">
          <Switch
            name="showCurrentAndLast"
            value={widget?.settings?.showCurrentAndLast}
            title="Show Current & Last"
            onChange={handleWidgetSettingsChange}
          />
        </div>
      </div>


      <label className="form-label mt-4">Chart Data Fields Configuration</label>
      <div>
        <DataFieldSelectorList
          customer={customer}
          name="dataFields"
          count={5}
          onChange={handleWidgetSettingsChange}
          definitions={definitions}
          settings={widget?.settings?.dataFields}
        />
      </div>

      <label className="form-label mt-4">Summary Fields</label>
      <div>
        <DataFieldSelectorList
          customer={customer}
          name="summaryFields"
          count={2}
          onChange={handleWidgetSettingsChange}
          definitions={definitions}
          settings={widget?.settings?.summaryFields}
        />
      </div>
    </>
  );
};

BarContent.propTypes = {
  widget: PropTypes.any.isRequired,
  updateWidget: PropTypes.func.isRequired,
  customer: PropTypes.object,
  definitions: PropTypes.isRequired
};

export default BarContent;
