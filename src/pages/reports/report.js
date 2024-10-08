import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import { useFetch, Get } from "../../hooks/useFetch";
import { GetToken, GetScope } from '../../features/authentication/hooks/useToken';
import BaseUrl from "../../hooks/baseUrl";
import PageHeader, { CardHeader } from "../../components/pageHeader";
import DataLoading from "../../components/dataLoading";
import Pagination from "../../components/pagination";
import DataError from "../../components/dataError";
import LocalDate from "../../util/LocalDate";
import FilterInput from "./filterInput";

const Report = () => {
  let params = useParams()
  const [values, setValues] = useState({ offset: 0, count: 15 });
  const [data, setData] = useState();
  const [downloadLink, setDownloadLink] = useState();
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState();
  const { loading: metaLoading, error: metaError, data: meta } = useFetch(`/api/v1/Reports/${params.reportId}`);

  useEffect(() => {
    if (meta) {
      const scope = GetScope();
      const customerFilter = meta.filters.find(filter => filter.inputType === 'CustomerId');

      if (customerFilter && scope) {
        setValues(v => ({ ...v, customerId: scope }));
      }
    }
  }, [meta])

  useEffect(() => {
    if (meta) {
      if (meta.filters.every(item => Object.prototype.hasOwnProperty.call(values, item.id) && values[item.id])) {
        setDataLoading(true);
        setDataError();

        const objString = values ? '?' + Object.entries(values).map(([key, value]) => {
          if (Array.isArray(value)) {
            // If the value is an array, repeat the parameter for each element
            return value.map((element) => `${key}=${encodeURIComponent(element)}`).join('&');
          } else {
            // If the value is not an array, just include the parameter once
            return `${key}=${encodeURIComponent(value)}`;
          }
        }).join('&') : '';

        setDownloadLink(`${BaseUrl}/api/v1/reports/${params.reportId}/csv${objString}&authorization=${GetToken().token}`);

        Get(`/api/v1/Reports/${params.reportId}/json${objString}`, (r) => {
          setDataLoading(false);
          setData(r)
        }, (error) => {
          setDataLoading(false);
          setDataError(error);
        })
      }
    }
  }, [values, meta]);

  if (metaError) return <DataError error={metaError} />
  if (metaLoading) return <DataLoading />

  const handlePageChange = (page) => {
    setValues(v => ({ ...v, offset: page.offset }));
  }

  const handleChange = (name, value) => {

    setValues((v) => ({ ...v, [name]: value }));
  }

  //var hasScope = (GetScope() != undefined);

  return <PageHeader title={meta.name} breadcrumbs={[{ title: 'Reports', link: '/reports' }, { title: meta.categoryName, link: `/reports#${meta.categoryId}` }]}>
    <CardHeader>
      <div className="btn-list">
        {downloadLink && <a className="btn btn-default btn-sm-icon" href={downloadLink} target="_blank" rel="noreferrer">
          {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-file-type-csv"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" /><path d="M7 16.5a1.5 1.5 0 0 0 -3 0v3a1.5 1.5 0 0 0 3 0" /><path d="M10 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75" /><path d="M16 15l2 6l2 -6" /></svg> */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><path d="M7 11l5 5l5 -5" /><path d="M12 4l0 12" /></svg>
          <span className="d-none d-sm-block text-start">Download</span>
        </a>}
        {!downloadLink && <a className="btn btn-default btn-sm-icon disabled">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><path d="M7 11l5 5l5 -5" /><path d="M12 4l0 12" /></svg>
          <span className="d-none d-sm-block text-start">Download</span>
        </a>}
        {/* {!hasScope && <>
          <a className="btn btn-defaul btn-icon" href={`/reports/${params.reportId}/edit`} >
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-edit" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path><path d="M16 5l3 3"></path></svg>
          </a>
        </>} */}
      </div>
    </CardHeader>
    <div className="page-body">
      <div className="container-xl">
        <div className="card">
          {meta.filters && meta.filters.length > 0 && <>
            <div className="p-3">
              <div className="row">
                {meta.filters && meta.filters.map((filter) => {
                  return <FilterInput key={filter.id} col="col-md-2 col-sm-12 mb-2" filter={filter} values={values} onChange={handleChange} />
                })}
              </div>
            </div>
          </>}
          {dataLoading && <DataLoading title="Generating Report Data" />}
          {dataError && <DataError error={dataError} />}
          {!dataLoading && !dataError && (!data || data.totalRows == 0) && <>
            <div className="empty">
              <p className="empty-title">No Data Found</p>
              <p className="empty-subtitle text-muted">
                There was not data found for the current report.
              </p>
            </div>
          </>}

          {!dataLoading && data && data.totalRows > 0 && <>
            <div className="table-responsive">
              <table className="table card-table table-vcenter text-nowrap datatable">
                <thead>
                  <tr>
                    {data.dataColumns.map((column) => {
                      return <th key={column.name} className={`w-${column.dataLength}`}>{column.title}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {data.dataRows && data.dataRows.map((row) => {
                    return <tr key={row.rowNumber}>
                      {data.dataColumns.map((column, index) => {
                        var colValue = row.values[column.name];
                        return <td key={`${row.rowNumber}_${index}`} style={{ whiteSpace: 'nowrap' }}>
                          {column.dataType == "String" && <span>{colValue}</span>}
                          {column.dataType == "Number" && <span>{colValue}</span>}
                          {column.dataType == "DateTime" && <LocalDate dateString={colValue} hideTime={false} />}
                          {column.dataType == "Date" && <LocalDate dateString={colValue} hideTime={true} />}
                          {column.dataType == "Boolean" && <span>{colValue == "1" ? 'True' : 'False'}</span>}
                          {column.dataType == "Currency" && <span>{colValue}</span>}
                          {column.dataType == "Percent" && <div className="row align-items-center">
                            <div className="col-12 col-lg-auto" style={{ width: "3rem" }}>{colValue}%</div>
                            <div className="col">
                              <div className="progress" style={{ width: "3rem" }}>
                                <div className="progress-bar" style={{ width: `${colValue}%` }} role="progressbar" aria-valuenow={colValue} aria-valuemin="0" aria-valuemax="100" aria-label={`${colValue}% Complete`}>
                                  <span className="visually-hidden">38% Complete</span>
                                </div>
                              </div>
                            </div>
                          </div>}
                          {column.dataType == "Level" &&
                            <span style={{ marginLeft: `${(Math.min(colValue, 10) - 1) * 15}px` }}>
                              {colValue}
                            </span>}
                        </td>
                      })}
                    </tr>
                  })}
                </tbody>
              </table>
            </div>
            <div className="card-footer d-flex align-items-center">
              <Pagination variables={values} refetch={handlePageChange} total={data.totalRows} />
            </div>
          </>}
        </div>
      </div>
    </div>
  </PageHeader >
}

export default Report;