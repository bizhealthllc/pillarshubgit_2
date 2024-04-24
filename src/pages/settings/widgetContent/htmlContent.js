import React from "react";
import PropTypes from 'prop-types';
import CodeEditor from "../../../components/codeEditor";

const HtmlContent = ({ widget, updateWidget }) => {

  const handleChange = (name, value) => {
    updateWidget((v) => {
      if (v.panes == undefined) v.panes = [];

      if (v.panes.length == 0) {
        v.panes.push({ text: value });
      } else {
        v.panes[0].text = value;
      }

      return { ...v }
    });
  }

  return <>
    <label className="form-label">HTML Content</label>
    <div className="border">
    <CodeEditor name="html" value={widget.panes ? widget.panes[0]?.text : ''} onChange={handleChange} />
    </div>
  </>
}

export default HtmlContent;

HtmlContent.propTypes = {
  widget: PropTypes.any.isRequired,
  updateWidget: PropTypes.func.isRequired
}