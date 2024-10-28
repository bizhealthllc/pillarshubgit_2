import React from "react";
import PropTypes from 'prop-types';
import Switch from "../../../components/switch";
import ProgressDataFieldList from "../../../components/progressDataFieldList";


// const ProgressChartContent = ({ widget, updateWidget, customer }) => {

const ProgressChartContent = ({ widget, updateWidget, customer, definitions }) => {
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
        <ProgressDataFieldList
          customer={customer}
          name="dataFields"
          count={3}
          onChange={handleWidgetSettingsChange}
          definitions={definitions}
          settings={widget?.settings?.dataFields}
        />
      </div>

      <label className="form-label mt-4">Summary Fields</label>
      <div>
        <ProgressDataFieldList
          customer={customer}
          name="summaryFields"
          count={3}
          onChange={handleWidgetSettingsChange}
          definitions={definitions}
          settings={widget?.settings?.dataFields}
        />
      </div>
    </>
  );
};

ProgressChartContent.propTypes = {
  widget: PropTypes.any.isRequired,
  updateWidget: PropTypes.func.isRequired,
  customer: PropTypes.object,
  definitions: PropTypes.any.isRequired
};

export default ProgressChartContent ;
