import React, { useEffect, useState } from "react";
import PageHeader from "../../components/pageHeader";
import SettingsNav from "./settingsNav";
import PlaceholderCard from "./components/placeholderCard";
import Modal from "../../components/modal"
import useWidgets from "../../features/widgets/hooks/useWidgets";
import { useFetch } from "../../hooks/useFetch";
import { SendRequest } from "../../hooks/usePost";

const DashboardSettings = () => {
  const { data, loading, error } = useFetch('/api/v1/dashboards', {});
  const { widgets, loading: wLoading, error: wError } = useWidgets();
  const [dashboardId, setDashboardId] = useState();
  const [dashboard, setDashboard] = useState();
  const [showDel, setShowDel] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [current, setCurrent] = useState(false);


  if (error) return `Error! ${error}`;
  if (wError) return `Error! ${wError}`;

  useEffect(() => {
    if (data) {
      setDashboardId(data[0].id);
      setDashboard(data[0].children);
    }
  }, [data, widgets]);

  const handleSave = () => {
    const item = {
      id: dashboardId,
      children: dashboard
    }
    SendRequest("PUT", "/api/v1/dashboards/" + item.id, item, () => {
    }, (error, code) => {
      alert(code + ": " + error);
    });
  }

  const handleDelhide = () => setShowDel(false);
  const handleDelShow = (id) => {
    setCurrent(findId(dashboard, id).item);
    setShowDel(true)
  }

  const handleDelete = () => {
    handleDelhide();
    setDashboard((prevData) => {
      const source = findId(prevData, current.id);
      if (source) {
        source.arr.splice(source.index, 1);
      }

      return [...prevData]; // Return the original data if source or target not found
    });
  }

  const handleEdithide = () => setShowEdit(false);
  const handleEditShow = (id) => {
    setCurrent(findId(dashboard, id)?.item ?? { id: crypto.randomUUID(), columns: 4, children: [] });
    setShowEdit(true)
  }

  const handleActiveEdit = (name, value) => {
    setCurrent(e => ({ ...e, [name]: value }));
  }

  const handleMove = (sourceId, targetId) => {
    if (sourceId !== targetId) {
      setDashboard((prevData) => {
        // Find source and target objects
        const source = findId(prevData, sourceId);
        const target = findId(prevData, targetId);

        source.item.columns = 12;

        if (source && target) {
          source.arr.splice(source.index, 1);
          target.item.children.push(source.item);
        }

        return [...prevData]; // Return the original data if source or target not found
      });
    }
  }

  const handleSwap = (sourceId, targetId) => {
    if (sourceId !== targetId) {
      setDashboard((prevData) => {
        // Find source and target objects
        const source = findId(prevData, sourceId);
        const target = findId(prevData, targetId);

        /* const sourceCol = source.item.columns;
        source.item.columns = target.item.columns;
        target.item.columns = sourceCol; */

        if (source && target) {
          source.arr[source.index] = target.item;
          target.arr[target.index] = source.item;
        }

        return [...prevData]; // Return the original data if source or target not found
      });
    }
  };

  const handleEdit = () => {
    setShowEdit(false);
    setDashboard((d) => {
      const source = findId(d, current.id);
      if ((current.widgetId ?? '') !== '') {
        current.children = null;
      } else {
        current.children = current.children ?? [];
      }

      if (source) {
        source.arr[source.index] = current;
      } else {
        d.push(current);
      }

      return [...d];
    });
  }

  return <PageHeader title="Dashboard" preTitle="Settings">
    <SettingsNav loading={wLoading || loading} pageId="dashboard">
      <div className="card-header">
        <span className="card-title">Dashboard</span>
      </div>
      <div className="card-body">
        <div className="row row-deck">
          {widgets && dashboard && dashboard.map((c) => {
            return buildCard(c, [...widgets], handleSwap, handleMove, handleEditShow, handleDelShow);
          })}
        </div>
      </div>

      <div className="card-footer">
        <div className="row">
          <div className="col">
            <button type="submit" className="btn btn-primary" onClick={handleSave}>Save</button>
          </div>
          <div className="col-auto">
            <button className="btn btn-default" onClick={handleEditShow}>
              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-layout-grid-add" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path><path d="M14 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path><path d="M4 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path><path d="M14 17h6m-3 -3v6"></path></svg>
              Add Widget
            </button>
          </div>
        </div>
      </div>
    </SettingsNav>

    <Modal showModal={showEdit} onHide={handleEdithide}>
      <div className="modal-header">
        <h5 className="modal-title">Widget Settings</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <div className="row">
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label">Widget</label>
              <select className="form-select" name="widgetId" value={current.widgetId ?? ''} onChange={(e) => handleActiveEdit(e.target.name, e.target.value)}>
                <option value="">Container</option>
                <option disabled>──────────</option>
                {widgets && widgets.map((w) => {
                  return <option key={w.id} value={w.id}>{w.name}</option>
                })}
              </select>
            </div>
          </div>
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label">Page Span</label>
              <select className="form-select" name="columns" value={current.columns ?? '4'} onChange={(e) => handleActiveEdit(e.target.name, e.target.value)}>
                <option value="3">1/4</option>
                <option value="4">1/3</option>
                <option value="6">1/2</option>
                <option value="8">2/3</option>
                <option value="9">3/4</option>
                <option value="12">1</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-link link-secondary me-auto" data-bs-dismiss="modal">Cancel</button>
        <button type="button" className="btn btn-primary" onClick={handleEdit}>Save Widget</button>
      </div>
    </Modal>

    <Modal showModal={showDel} size="sm" onHide={handleDelhide}>
      <div className="modal-body">
        <div className="modal-title">Are you sure?</div>
        <div>If you proceed, you will lose widget settings.</div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-link link-secondary me-auto" data-bs-dismiss="modal">Cancel</button>
        <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete Widget</button>
      </div>
    </Modal>

  </PageHeader>
}

function buildCard(card, widgets, handleSwap, handleMove, handleEdit, handleDelete) {
  if ((card.widgetId || card.children) && widgets !== undefined) {
    let widget = widgets.find((w) => w.id === card?.widgetId ?? '');
    return <div key={card.id} className={`col-${card.columns}`}>
      {card.widgetId && <PlaceholderCard cardId={card.id} widget={widget} onSwap={handleSwap} onMove={handleMove} onEdit={handleEdit} onDelete={handleDelete} />}

      {card.children &&
        <PlaceholderCard cardId={card.id} widget={widget} onSwap={handleSwap} onMove={handleMove} onEdit={handleEdit} onDelete={handleDelete} >
          <div className="row row-deck" style={{ gutterX: 0 }}>
            {card.children.map((c) => {
              return buildCard(c, widgets, handleSwap, handleMove, handleEdit, handleDelete);
            })}
          </div>
        </PlaceholderCard>
      }
    </div>
  }
}

function findId(arr, targetId) {
  for (let index = 0; index < arr.length; index++) {
    const obj = arr[index];

    if (obj?.id === targetId) {
      return { item: obj, arr, index };
    }

    if (obj.children && Array.isArray(obj.children)) {
      const result = findId(obj.children, targetId);
      if (result) {
        return result;
      }
    }
  }

  return null;
}

export default DashboardSettings;