import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import { SendRequest } from "../../hooks/usePost";
import { useFetch } from "../../hooks/useFetch";
import PageHeader from "../../components/pageHeader";
import SettingsNav from "./settingsNav";
import useWidget from "../../features/widgets/hooks/useWidget"
import { WidgetTypes } from "../../features/widgets/hooks/useWidgets";
import Widget from "../../features/widgets/components/widget"
import TextInput from '../../components/textInput';
import TextArea from '../../components/textArea';
import SelectInput from '../../components/selectInput';
import ColorInput from '../../components/colorInput';
import Modal from "../../components/modal";
import RadioInput from "../../components/radioInput";

const EditWidget = () => {
  let params = useParams()
  const [previewSize, SetPreviewSize] = useState(6);
  const [showEdit, setShowEdit] = useState();
  const [showDelete, setShowDelete] = useState();
  const [item, setItem] = useState();
  const [editItem, setEditItem] = useState();
  const { widget, loading, error } = useWidget(params.widgetId);
  const { data: compPlans } = useFetch("/api/v1/CompensationPlans");

  useEffect(() => {
    if (widget) {
      var tId = widget.id === 'new' ? null : widget.id;
      setItem({ ...widget, id: tId });
    }
  }, [widget])

  if (error) return `Error! ${error}`;

  const handlePreviewSizeChange = (name, value) => {
    SetPreviewSize(value);
  }

  const handleDeleteHide = () => setShowDelete(false);
  const handleShowDelete = (index) => {
    setEditItem({ ...item?.panes[index], index: index });
    setShowDelete(true);
  }
  const handleDelete = () => {
    setItem((v) => {
      v.panes.splice(editItem.index, 1);
      return { ...v }
    });
    setShowDelete(false);
  }

  const handleHideEdit = () => setShowEdit(false);
  const handleShowEdit = (index) => {
    if (index > -1) {
      setEditItem({ ...item?.panes[index], index: index });
    } else {
      setEditItem({ index: index });
    }
    setShowEdit(true);
  }
  const handleSaveEdit = () => {
    setItem((v) => {
      if (editItem.index == -1) {
        if (v.panes === undefined) v.panes = [];
        v.panes.push(editItem);
      } else {
        v.panes[editItem.index] = editItem;
      }

      return { ...v }
    });
    setShowEdit(false);
  }

  const handleSlideChange = (name, value) => {
    setEditItem((v) => ({ ...v, [name]: value }));
  }

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

  return <PageHeader preTitle="Settings" title="Widgets">
    <SettingsNav loading={loading} pageId="widgets">
      <div className="card-header">
        <span className="card-title">Edit Widget</span>
      </div>

      <div className="">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs" data-bs-toggle="tabs" role="tablist">
            <li className="nav-item" role="presentation">
              <a href="#tabs-home-7" className="nav-link active" data-bs-toggle="tab" aria-selected="true" role="tab">Content</a>
            </li>
            <li className="nav-item" role="presentation">
              <a href="#tabs-style-7" className="nav-link" data-bs-toggle="tab" aria-selected="false" role="tab" tabIndex="-1">Style</a>
            </li>
            <li className="nav-item" role="presentation">
              <a href="#tabs-advanced-7" className="nav-link" data-bs-toggle="tab" aria-selected="false" role="tab" tabIndex="-1">Advanced</a>
            </li>
          </ul>
        </div>
        <div className="card-body">
          <div className="tab-content">
            <div className="tab-pane active show" id="tabs-home-7" role="tabpanel">
              <div className="row mb-3">
                <div className="col-4 mb-3">
                  <label className="form-label">Name</label>
                  <TextInput name="name" value={item?.name ?? ''} onChange={handleChange} />
                </div>
                <div className="col-8 mb-3">
                  <label className="form-label">Title</label>
                  <TextInput name="title" value={item?.title ?? ''} onChange={handleChange} />
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Description</label>
                  <TextArea name="description" value={item?.description ?? ''} onChange={handleChange} />
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Widget Type</label>
                  <select className="form-select" name="type" value={item?.type ?? ''} onChange={(e) => handleChange(e.target.name, e.target.value)} >
                    {WidgetTypes && Object.keys(WidgetTypes).map((key) => {
                      return <option key={key} value={WidgetTypes[key]}>{key}</option>
                    })}
                  </select>
                </div>
              </div>

              <div className="row row-cards">
                {item?.type == 'banner' && item?.panes && item.panes.map((p, index) => {
                  return <div key={p.id} className="col-sm-6 col-lg-4">
                    <div className="card card-sm">
                      <img src={p.imageUrl} className="card-img-top" />
                      <div className="card-body text-center">
                        <div className="d-flex align-items-center">
                          <div className="col">
                            <div>{p.title}</div>
                            <div className="text-muted">{p.text}</div>
                          </div>
                          <div className="col-auto">
                            <div className="dropdown">
                              <a href="#" className="btn-action" data-bs-toggle="dropdown" aria-expanded="false">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="19" r="1"></circle><circle cx="12" cy="5" r="1"></circle></svg>
                              </a>
                              <div className="dropdown-menu dropdown-menu-end">
                                <button className="dropdown-item" onClick={() => handleShowEdit(index)} >Edit</button>
                                <button className="dropdown-item text-danger" onClick={() => handleShowDelete(index)} >Delete</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                })}
              </div>


            </div>
            <div className="tab-pane" id="tabs-style-7" role="tabpanel">
              <div className="row">
                <div className="col-5 mb-3">
                  <label className="col-form-label">Header Background Color</label>
                  <div className="col">
                    <ColorInput name="headerColor" value={item?.headerColor ?? '#ffffff'} defaultValue="#ffffff" onChange={handleChange} />
                  </div>
                </div>
                <div className="col-5 mb-3">
                  <label className="col-form-label">Header Text Color</label>
                  <div className="col">
                    <ColorInput name="headerTextColor" value={item?.headerTextColor ?? '#1d273b'} defaultValue="#1d273b" onChange={handleChange} />
                  </div>
                </div>

                <div className="col-2 mb-3 mt-2">
                  <label className="form-label">Header Alignment</label>
                  <RadioInput name="headerAlignment" value={item?.headerAlignment} onChange={handleChange} />
                </div>

                <div className="col-4 mb-3">
                  <label className="col-form-label">Card Background Color</label>
                  <div className="col">
                    <ColorInput name="backgroundColor" value={item?.backgroundColor ?? '#ffffff'} defaultValue="#ffffff" onChange={handleChange} />
                  </div>
                </div>
                <div className="col-4 mb-3">
                  <label className="col-form-label">Card Text Color</label>
                  <div className="col">
                    <ColorInput name="textColor" value={item?.textColor ?? '#1d273b'} defaultValue="#1d273b" onChange={handleChange} />
                  </div>
                </div>
                <div className="col-4 mb-3">
                  <label className="col-form-label">Card Border Color</label>
                  <div className="col">
                    <ColorInput name="borderColor" value={item?.borderColor ?? '#e6e7e9'} defaultValue="#e6e7e9" onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="hr-text">Widget Preview</div>
              <div className="mb-3 col-3">
                <label className="col-form-label">Preview Size</label>
                <SelectInput value={previewSize} onChange={handlePreviewSizeChange}>
                  <option value="4">Extra Small</option>
                  <option value="6">Small</option>
                  <option value="9">Medium</option>
                  <option value="12">Large</option>
                </SelectInput>
              </div>
              <div className="card-footer">
                <div className={`col-${previewSize}`}>
                  {item && <Widget widget={item} />}
                </div>
              </div>

              {item?.type == 'card-[disabled]' && compPlans && compPlans[0]?.definitions.map((d) => {
                return <div key={d.id}>{JSON.stringify(d)}</div>
              })}
            </div>
            <div className="tab-pane" id="tabs-advanced-7" role="tabpanel">
              <div className="col-12 mb-3">
                <label className="form-label">CSS Override</label>
                <TextArea name="css" value={item?.css ?? ''} rows={20} onChange={handleChange} />
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
          <div className="col-auto">
            {item?.type == 'banner' && <button className="btn btn-default" onClick={() => handleShowEdit(-1)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-photo-plus" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 8h.01"></path><path d="M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6.5"></path><path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l4 4"></path><path d="M14 14l1 -1c.67 -.644 1.45 -.824 2.182 -.54"></path><path d="M16 19h6"></path><path d="M19 16v6"></path></svg>
              Add Slide
            </button>}
          </div>
        </div>
      </div>
    </SettingsNav>

    <Modal showModal={showEdit} onHide={handleHideEdit}>
      <div className="modal-header">
        <h5 className="modal-title">Slide Details</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <div className="row mb-3">
          <div className="col-12 mb-3">
            <label className="form-label">Slider Text</label>
            <TextInput name="title" value={editItem?.title ?? ''} onChange={handleSlideChange} />
          </div>
          <div className="col-12 mb-3">
            <TextArea name="text" value={editItem?.text ?? ''} onChange={handleSlideChange} />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label">Image Url</label>
            <TextInput name="imageUrl" value={editItem?.imageUrl ?? ''} onChange={handleSlideChange} />
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <a href="#" className="btn btn-link link-secondary" data-bs-dismiss="modal">
          Cancel
        </a>
        <button type="submit" className="btn btn-primary ms-auto" onClick={handleSaveEdit}>
          Save
        </button>
      </div>
    </Modal>

    <Modal showModal={showDelete} size="sm" onHide={handleDeleteHide}>
      <div className="modal-body">
        <div className="modal-title">Are you sure?</div>
        <div>If you proceed, you will lose pane settings.</div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-link link-secondary me-auto" data-bs-dismiss="modal">Cancel</button>
        <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete Pane</button>
      </div>
    </Modal>

  </PageHeader>
}

export default EditWidget;