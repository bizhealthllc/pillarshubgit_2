import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import { useQuery, gql } from "@apollo/client";
import { SendRequest } from "../../hooks/usePost";
import PageHeader from "../../components/pageHeader";
import useWidget from "../../features/widgets/hooks/useWidget"
import { WidgetTypes } from "../../features/widgets/hooks/useWidgets";
import Widget from "../../features/widgets/components/widget"
import TextInput from '../../components/textInput';
import ColorInput from '../../components/colorInput';
import RadioInput from "../../components/radioInput";
import WidgetContent from "./widgetContent/widgetContent";
import CssEditor from "../../components/cssEditor ";
import DataLoading from "../../components/dataLoading";
import DataError from "../../components/dataError";

var GET_DATA = gql`query {
  compensationPlans {
    id
    definitions {
      name
      valueId
      comment
    }
    ranks {
      id
      name
    }
  }  
  trees
  {
    name
    id
  }
}`

const EditWidget = () => {
  let params = useParams()
  const [previewSize] = useState(12);
  const [item, setItem] = useState();
  const [date] = useState(new Date().toISOString());
  const { widget, error } = useWidget(params.widgetId);
  const { data, loading, error: dataError } = useQuery(GET_DATA, {
    variables: {},
  });

  useEffect(() => {
    if (widget) {
      var tId = widget.id === 'new' ? null : widget.id;
      setItem({ ...widget, id: tId });
    } else {
      setItem({ type: WidgetTypes.Banner });
    }
  }, [widget])

  if (error) return `Error! ${error}`;
  if (dataError) return <DataError error={dataError} />
  if (loading) return <DataLoading />

  const handleChange = (name, value) => {
    setItem((v) => ({ ...v, [name]: value }));
  }

  const handleSave = () => {
    var action = "PUT";
    var url = `/api/v1/Widgets/${item.id}`;

    if (item.id === undefined) {
      action = "POST";
      url = `/api/v1/Widgets`;
    }

    SendRequest(action, url, item, (r) => {
      setItem(r);
    }, (error) => {
      alert(error);
    })
  }

  return <PageHeader title="Edit Widget" breadcrumbs={[{ title: `Widgets`, link: `/settings/widgets` }, { title: "Edit Widget" }]}>
    <div className="container-xl">
      <div className="row">
        <div className="col-md-6 col-lg-8">

          <div className="card">
            <div className="">
              <div className="card-header">
                <ul className="nav nav-tabs card-header-tabs" data-bs-toggle="tabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <a href="#tabs-home-7" className="nav-link active" data-bs-toggle="tab" aria-selected="true" role="tab">Content</a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a href="#tabs-advanced-7" className="nav-link" data-bs-toggle="tab" aria-selected="false" role="tab" tabIndex="-1">CSS Overrides</a>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                <div className="tab-content">
                  <div className="tab-pane active show" id="tabs-home-7" role="tabpanel">
                    <div className="row">
                      <div className="col-md-4 col-lg-2 mb-3">
                        <label className="form-label">Widget Type</label>
                        <select className="form-select" name="type" value={item?.type ?? ''} onChange={(e) => handleChange(e.target.name, e.target.value)} >
                          {WidgetTypes && Object.keys(WidgetTypes).map((key) => {
                            return <option key={key} value={WidgetTypes[key]}>{key}</option>
                          })}
                        </select>
                      </div>
                      <div className="col-md-4 col-lg-4 mb-3">
                        <label className="form-label">Name</label>
                        <TextInput name="name" value={item?.name ?? ''} onChange={handleChange} placeholder="Name of the Wedget" />
                      </div>
                      <div className="col-md-4 col-lg-6 mb-3">
                        <label className="form-label">Description</label>
                        <TextInput name="description" value={item?.description ?? ''} rows={1} onChange={handleChange} placeholder="Short Description of what this widget is about" />
                      </div>

                      <div className="col-4 mb-3">
                        <label className="form-label">Header Title</label>
                        <TextInput name="title" value={item?.title ?? ''} onChange={handleChange} />
                      </div>


                      <div className="col-2 mb-3">
                        <label className="form-label">Header Alignment</label>
                        <RadioInput name="headerAlignment" value={item?.headerAlignment} onChange={handleChange} />
                      </div>

                      <div className="col-3 mb-3">
                        <label className="form-label">Header Background Color</label>
                        <ColorInput name="headerColor" value={item?.headerColor} defaultValue="#ffffff" onChange={handleChange} />
                      </div>

                      <div className="col-3 mb-3">
                        <label className="form-label">Header Text Color</label>
                        <ColorInput name="headerTextColor" value={item?.headerTextColor} defaultValue="#1d273b" onChange={handleChange} />
                      </div>

                      <div className="col-4 mb-3">
                        <label className="form-label">Card Background Color</label>
                        <ColorInput name="backgroundColor" value={item?.backgroundColor} defaultValue="#ffffff" onChange={handleChange} />
                      </div>
                      <div className="col-4 mb-3">
                        <label className="form-label">Card Text Color</label>
                        <ColorInput name="textColor" value={item?.textColor} defaultValue="#1d273b" onChange={handleChange} />
                      </div>
                      <div className="col-4 mb-3">
                        <label className="form-label">Card Border Color</label>
                        <ColorInput name="borderColor" value={item?.borderColor} defaultValue="#e6e7e9" onChange={handleChange} />
                      </div>
                    </div>

                    <WidgetContent widget={item} updateWidget={setItem} trees={data.trees} definitions={data.compensationPlans} />

                  </div>
                  <div className="tab-pane" id="tabs-advanced-7" role="tabpanel">
                    <div className="col-12 mb-3">
                      <CssEditor name="css" value={item?.css} onChange={handleChange} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <div className="row">
                <div className="col">
                  <button type="submit" className="btn btn-primary" onClick={handleSave}>Save</button>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div className="col-md-6 col-lg-4">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Widget Preview</h4>
            </div>
            <div className="p-2">
              <div className={`col-${previewSize}`}>
                {item && <Widget widget={item} trees={data?.trees} isPreview={true} date={date} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageHeader>
}

export default EditWidget;