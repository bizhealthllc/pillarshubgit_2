import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { useFetch } from "../../hooks/useFetch";
import PageHeader from "../../components/pageHeader";
import DataLoading from "../../components/dataLoading";
import DataError from "../../components/dataError";
import GraphQLQueryEditor from "../../components/graphQLQueryEditor";
import TextInput from "../../components/textInput";
import SelectInput from "../../components/selectInput";
import TextArea from "../../components/textArea";
import FilterInput from "./filterInput";

const EditReport = () => {
  let params = useParams()
  const [report, setReport] = useState();
  const [values, setValues] = useState({ offset: 0, count: 10 });
  const { loading, error, data } = useFetch(`/api/v1/Reports/${params.reportId}`);

  useEffect(() => {
    if (data) {
      setReport(data);
    }
  }, [data])

  if (loading || !report) return <DataLoading />
  if (error) return <DataError error={error} />

  const handleChange = (name, value) => {
    setReport(v => ({ ...v, [name]: value }));
  }

  const handleValueChange = (name, value) => {
    setValues(v => ({ ...v, [name]: value }));
  }

  return <PageHeader title="Edit Report" breadcrumbs={[{ title: `Reports`, link: `/reports` }, { title: data.categoryName, link: `/reports#${data.categoryId}` }, { title: `${data.name}`, link: `/reports/${params.reportId}` }]}>
    <div className="container-xl">
      <div className="row row-cards row-deck mb-3">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-8 mb-3">
                  <label className="form-label">Name</label>
                  <TextInput name="name" value={report.name} onChange={handleChange} />
                </div>
                <div className="col-4 mb-3">
                  <label className="form-label">Visibility</label>
                  <SelectInput name="visibility" value={report.visibility} onChange={handleChange} >
                    <option>Corporate</option>
                    <option>BackOffice</option>
                  </SelectInput>
                </div>
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <TextArea name="description" value={report.description} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <span className="card-title">Filters</span>
            </div>
            <div className="card-body">
              {report.filters && report.filters.map((filter) => {
                return <div key={filter.id} className="mb-3">
                  <div className="row">
                    <div className="col w-100">
                      <FilterInput key={filter.id} filter={filter} values={values} onChange={handleValueChange} />
                    </div>
                    <div className="col-auto">
                      <a className="btn btn-default btn-icon me-2" href={`/reports/${params.reportId}/edit`} >
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-edit" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path><path d="M16 5l3 3"></path></svg>
                      </a>
                      <a className="btn btn-default btn-icon" href={`/reports/${params.reportId}/edit`} >
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-trash" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 7l16 0"></path><path d="M10 11l0 6"></path><path d="M14 11l0 6"></path><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path></svg>
                      </a>
                    </div>
                  </div>
                </div>
              })}
            </div>
            <div className="card-footer">
              <div className="row">
                <div className="col">
                </div>
                <div className="col-auto">
                  <button className="btn btn-default">
                    Add Filter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12">

          <div className="card">
            <div className="card-header">
              <ul className="nav nav-tabs card-header-tabs" data-bs-toggle="tabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <a href="#tabs-home-7" className="nav-link active" data-bs-toggle="tab" aria-selected="true" role="tab">Query</a>
                </li>
                <li className="nav-item" role="presentation">
                  <a href="#tabs-requirements-7" className="nav-link" data-bs-toggle="tab" aria-selected="true" role="tab">Columns</a>
                </li>
              </ul>
            </div>
            <div className="tab-content">
              <div className="tab-pane active show" id="tabs-home-7" role="tabpanel">
                <div className="card-body border-bottom">
                  <div className="row">
                    <div className="col-6">
                      <label className="form-label">Root Path</label>
                      <TextInput name="rootPath" value={report.rootPath} onChange={handleChange} />
                    </div>
                    <div className="col-6">
                      <label className="form-label">Total Path</label>
                      <TextInput name="rowCountPath" value={report.rowCountPath} onChange={handleChange} />
                    </div>
                  </div>
                </div>
                <GraphQLQueryEditor query={report.query} variables={JSON.stringify(values)} onChange={(q) => handleChange("query", q)} />
              </div>
              <div className="tab-pane" id="tabs-requirements-7" role="tabpanel">
                <div className="card-body">
                  {report.dataColumns && report.dataColumns.map((column) => {
                    return <div key={column.name} className="mb-1">
                      <div className="row">
                        <div className="col w-100">
                          {JSON.stringify(column)}
                        </div>
                        <div className="col-auto">
                          <a className="btn btn-ghost-secondary btn-icon" href={`/reports/${params.reportId}/edit`} >
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-edit" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path><path d="M16 5l3 3"></path></svg>
                          </a>
                          <a className="btn btn-ghost-secondary btn-icon" href={`/reports/${params.reportId}/edit`} >
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-trash" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 7l16 0"></path><path d="M10 11l0 6"></path><path d="M14 11l0 6"></path><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path></svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  })}
                </div>
                <div className="card-footer">
                  <div className="row">
                    <div className="col">
                    </div>
                    <div className="col-auto">
                      <button className="btn btn-default">
                        Add Column
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 d-none">
        {JSON.stringify(report)}
      </div>
    </div>
  </PageHeader>
}

export default EditReport;
