import React from "react";
import PageHeader from "../../components/pageHeader";
import GraphQLQueryEditor from "../../components/graphQLQueryEditor";

const ReportQuery = () => {

  const handleChange = () => {

  }

  return <PageHeader>
    <div className="container-fluid h-100">
      <GraphQLQueryEditor query="" variables="" onChange={handleChange} />
    </div>
  </PageHeader>
}


export default ReportQuery;