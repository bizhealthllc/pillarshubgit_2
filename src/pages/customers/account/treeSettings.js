import React, { useState } from "react";
import { useParams } from "react-router-dom"
import { useFetch } from "../../../hooks/useFetch";
import { SendRequest } from "../../../hooks/usePost";
import PageHeader from "../../../components/pageHeader";
import DataLoading from '../../../components/dataLoading';
import AccountNav from "./accountNav";
import Switch from "../../../components/switch";


const CustomerTreeSettings = () => {
  const [preference, setPreference] = useState();
  const [holdingTank, setHoldingTank] = useState();
  let params = useParams();
  const { loading, error, data, refetch } = useFetch(`/api/v1/NodeSettings/${params.customerId}`);

  if (loading) return <DataLoading />;
  if (error) return `Error! ${error}`;

  const handleChange = (name, value) => {
    if (name == 'holdingTank'){
      setHoldingTank(value);
    }else{
      setPreference(value);
    }
  }

  const handleSubmit = () =>{

    var item = {
      treePreferences: [
        {
          treeId: 0,
          buildRule: preference,
          holdingTank: holdingTank
        }
      ]
    };

    SendRequest("PUT", `/api/v1/NodeSettings/${params.customerId}`, item, () =>
    {
      var successAlert = document.getElementById('passwordSuccess');
      successAlert.classList.remove('d-none');
      refetch();
    }, (error) =>
    {
      alert(error);
    });
  }

  let treePreference = data?.treePreferences ? data?.treePreferences[0] : null;

  var leg = preference ?? treePreference?.buildRule ?? 'Left';
  var ht = holdingTank ?? treePreference?.holdingTank ?? true;

  return <PageHeader preTitle="Account" title={``} pageId="account" customerId={params.customerId}>
    <div className="container-xl">
      <div className="card">
        <div className="row g-0">
          <div className="col-sm-12 col-md-3 border-end border-bottom">
            <div className="card-body">
              <AccountNav pageId="treesettings" customerId={params.customerId} />
            </div>
          </div>
          <div className="col-sm-12 col-md-9">
            <div className="card-body">
              <div id="passwordSuccess" className="alert alert-success d-none" role="alert">
                Your preference has been upated!
              </div>
              <h1 className="card-title mb-3">Binary Tree Placement Rule</h1>
              <div className="mb-3">
                <div className="form-selectgroup form-selectgroup-boxes d-flex flex-column">
                  <label className="form-selectgroup-item flex-fill">
                    <input type="radio" name="preference" value="Left" className="form-selectgroup-input" checked={leg === 'Left' } onChange={(e) => handleChange(e.target.name, e.target.value)} />
                    <div className="form-selectgroup-label d-flex align-items-center p-3">
                      <div className="me-3 mb-1">
                        <span className="form-selectgroup-check"></span>
                      </div>
                      <div>
                        Place on <strong>Left Leg</strong>
                      </div>
                    </div>
                  </label>
                  <label className="form-selectgroup-item flex-fill">
                    <input type="radio" name="preference" value="Right" className="form-selectgroup-input" checked={leg === 'Right' } onChange={(e) => handleChange(e.target.name, e.target.value)}/>
                    <div className="form-selectgroup-label d-flex align-items-center p-3">
                      <div className="me-3 mb-1">
                        <span className="form-selectgroup-check"></span>
                      </div>
                      <div>
                        Place on <strong>Right Leg</strong>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

               <div className="mb-3">
                <Switch className="form-check-input" name="holdingTank" value={ht} onChange={handleChange} title="Delay placement for 24 hours" />
                <small className="form-hint">When this is selected, any new enrollments will be placed in the Holding Tank to be placed manually.</small>
              </div>

              <div className="row">
                <div className="col d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary" onClick={handleSubmit} >Update Preference</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </PageHeader>
}

export default CustomerTreeSettings;