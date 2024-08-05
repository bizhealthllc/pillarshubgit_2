import React, { useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import { SendRequest } from "../../hooks/usePost";
import PageHeader from "../../components/pageHeader";
import SettingsNav from "./settingsNav";
import TextInput from "../../components/textInput"

const Company = () => {
  const { data, loading, error } = useFetch('/api/v1/CompanyData');
  const [values, setValues] = useState();

  if (error) return `Error! ${error}`;

  useEffect(() => {
    if (data) {
      setValues(data);
    }
  }, [data]);

  const handleChange = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }))
  }

  const handleSave = () => {
    SendRequest("PUT", '/api/v1/CompanyData', values, () =>{
    }, (error) => {
      alert(error);
    })
  }

  return <PageHeader title="Business Information" preTitle="Settings">
    <SettingsNav loading={loading} pageId="company">
      <div className="card-header">
        <span className="card-title">Business Information</span>
      </div>
      <div className="card-body bg-light">
        <div className="row row-cards">
          <div className="col-12 mb-3">
            <label className="form-label required">Business Name</label>
            <div>
              <TextInput name="name" value={values?.name ?? ''} onChange={handleChange} />
              {/* <small className="form-hint">Well never share your email with anyone else.</small> */}
            </div>
          </div>
          <div className="col-12">
            <div className="row row-cards">
              <div className="col-md-6">
                <fieldset className="fo">
                  <div className="row row-cards">
                    <div className="col-12">
                      <label className="form-label">Phone Number</label>
                      <TextInput name="phone" value={values?.phone ?? ''} onChange={handleChange} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Email Address</label>
                      <TextInput name="email" value={values?.email ?? ''} onChange={handleChange} />
                    </div>
                  </div>
                </fieldset>
              </div>
              <div className="col-md-6">
                <fieldset className="fo">
                  <div className="row row-cards">
                    <div className="col-12">
                      <label className="form-label">Address</label>
                      <TextInput name="line1" value={values?.line1 ?? ''} onChange={handleChange} />
                    </div>
                    <div className="col-sm-12 col-md-5">
                      <label className="form-label">City</label>
                      <TextInput name="city" value={values?.city ?? ''} onChange={handleChange} />
                    </div>
                    <div className="col-sm-12 col-md-3">
                      <label className="form-label">State</label>
                      <TextInput name="stateCode" value={values?.stateCode ?? ''} onChange={handleChange} />
                    </div>
                    <div className="col-sm-12 col-md-4">
                      <label className="form-label">Zip Code</label>
                      <TextInput name="zip" value={values?.zip ?? ''} onChange={handleChange} />
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card-footer">
        <button className="btn btn-primary" onClick={handleSave} >Save</button>
      </div>
    </SettingsNav>
  </PageHeader>
}

export default Company;