import React, { useState } from "react";
import { useParams } from "react-router-dom"
import { useFetch } from "../../hooks/useFetch";
import BaseUrl from "../../hooks/baseUrl";
import PageHeader, { CardHeader } from "../../components/pageHeader";
import DataLoading from "../../components/dataLoading";
import Pagination from "../../components/pagination";

import PeriodPicker from "../../components/periodPicker";
import RankSelect from "../../components/rankSelect";
import AutoComplete from "../../components/autocomplete";
import TextInput from "../../components/textInput";
import TreeSelect from "../../components/treeSelect";

const Report = () => {
  let params = useParams()
  const [values, setValues] = useState({});
  const { loading, error: metaError, data: meta } = useFetch(`/api/v1/Reports/${params.reportId}/metaData`);
  const { error, data, variables, refetch } = useFetch(`/api/v1/Reports/${params.reportId}`, { offset: 0, count: 15 });
  if (error) return `Error! ${error}`;
  if (metaError) return `Error! ${metaError}`;
  if (loading) return <DataLoading />

  const handleChange = (name, value) => {
    setValues((prevValues) => {
      const updatedValues = { ...prevValues, [name]: value };
      refetch(updatedValues);
      return updatedValues;
    });
  }

  return <PageHeader title={meta.name} breadcrumbs={[{ title: 'Reports', link: '/reports' }, { title: meta.categoryName, link: `/reports#${meta.categoryId}` }]}>
    <CardHeader>
      {data && data.totalRows > 0 && <a className="btn btn-primary" href={`${BaseUrl}/api/v1/reports/${data.hash}/pdf/${meta.name}`} target="_blank" rel="noopener noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-file-type-pdf" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" /><path d="M5 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6" /><path d="M17 18h2" /><path d="M20 15h-3v6" /><path d="M11 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1z" /></svg>
        Export
      </a>}
    </CardHeader>
    <div className="page-body">
      <div className="container-xl">
        <div className="card">
          {meta.filters && meta.filters.length > 0 && <>
            <div className="p-3">
              <div className="row">
                {reportFilters(meta.filters, values, handleChange)}
              </div>
            </div>
          </>}
          {!data && <DataLoading title="Generating Report Data" />}

          {data && data.totalRows == 0 && <>
            <div className="empty">
              <p className="empty-title">No Data Found</p>
              <p className="empty-subtitle text-muted">
                There was not data found for the current report.
              </p>
            </div>
          </>}

          {data && data.totalRows > 0 && <>
            <div className="table-responsive">
              <table className="table card-table table-vcenter text-nowrap datatable">
                <thead>
                  <tr>
                    {data.dataColumns.map((column) => {
                      return <th key={column.title} className={`w-${column.dataLength}`}>{column.title}</th>
                    })}
                  </tr>
                </thead>
                <tbody>
                  {data.dataRows && data.dataRows.map((row) => {
                    return <tr key={row.rowNumber}>
                      {row.values.map((column, index) => {
                        return <td key={`${row.rowNumber}_${index}`} style={{ whiteSpace: 'pre-wrap' }}>{column.replace(/&nbsp;/g, ' ')}</td>;
                      })}
                    </tr>
                  })}
                </tbody>
              </table>
            </div>
            <div className="card-footer d-flex align-items-center">
              <Pagination variables={variables} refetch={refetch} total={data.totalRows} />
            </div>
          </>}
        </div>
      </div>
    </div>
  </PageHeader >
}


function reportFilters(filters, values, handleChange) {
  return filters.map((filter) => {
    return <React.Fragment key={filter.id}>{reportFilterInput(filter, values, handleChange)}</React.Fragment>
  });
}

function reportFilterInput(filter, values, handleChange) {
  const { inputType } = filter;
  switch (inputType) {
    case "Period":
      return <> <div className="col"></div><div className="col-auto ms-auto"><PeriodPicker periodId={values?.periodId ?? ''} setPeriodId={(value) => handleChange('periodId', value)} /></div></>;
    case "Rank":
      return <div className="col-2"><RankSelect name="rankId" value={values?.rankId ?? ''} onChange={handleChange} ><option value="">All Ranks</option></RankSelect></div>
    case "CustomerId":
      return <div className="col-3"><AutoComplete placeholder="Select Customer" name="customerId" value={values?.customerId ?? ''} onChange={handleChange} /></div>
    case "Tree":
      return <div className="col-3"><TreeSelect name={filter.id} value={values[filter.id] ?? ''} onChange={handleChange} ></TreeSelect></div>
    default:
      return <div className="col-3"><TextInput name={filter.id} placeholder={JSON.stringify(filter)} value={values[filter.id] ?? ''} onChange={handleChange} /></div>
  }
}

export default Report;