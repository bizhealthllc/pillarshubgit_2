import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { GraphiQL } from 'graphiql';
import 'graphiql/graphiql.css';
import { GetToken } from '../features/authentication/hooks/useToken';
import BaseUrl from '../hooks/baseUrl';

const GraphQLQueryEditor = ({ query, variables, onChange, onFetch }) => {
  const [_variables, setVariables] = useState(variables ?? '');
  const [introspectionCache, setIntrospectionCache] = useState();

  useEffect(() => {
    setVariables(variables);
  }, [variables])

  const fetcher = async (graphQLParams) => {
    var isIntrospection = graphQLParams.query.includes('query IntrospectionQuery ')
    if (isIntrospection && introspectionCache) return introspectionCache;

    const data = await fetch(`${BaseUrl}/graphQL`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': GetToken()?.token
      },
      body: JSON.stringify(graphQLParams),
    });

    var result = data.json();
    if (isIntrospection) setIntrospectionCache(result);
    if (!isIntrospection && onFetch) onFetch(result);
    return result;
  };

  const handleFetch = (aa) => {
    alert(JSON.stringify(aa));
    onFetch(aa);
  }

  // Track query and variables without executing the fetcher
  const handleQueryChange = (newQuery) => {
    onChange(newQuery);
  };

  const handleVariablesChange = (newVariables) => {
    setVariables(newVariables);
  };

  return (
    <>
      <style>
        {`
          .graphiql-container{
            min-height: 500px
          }

          3.graphiql-tab-add {
            display: none !important; 
          }

          .graphiql-sessions{
            margin: 0 !important;
            border-radius: 0 !important;
          }

          .graphiql-session{
            padding: 0 !important;
            border-radius: 0 !important;
          }

          .graphiql-editors{
            margin: 0 !important;
            border-radius: 0 !important;
          }

          .graphiql-session-header{
            display: none !important; 
          }

          3.graphiql-sidebar3{
            display: none !important; 
          }

          3.graphiql-editor-tools3 {
            display: none !important; 
          }

          3.topBar .historyButton,
          3.topBar button[title="Show History"] {
            display: none !important;
          }

          3.graphiql-response{
            background-color: var(--tblr-light);
          }

          3.graphiql-container .graphiql-editors.full-height {
             margin: 0;
          }
        `}
      </style>

      <GraphiQL
        fetcher={fetcher}
        query={query}
        variables={_variables}
        onEditQuery={handleQueryChange}
        onEditVariables={handleVariablesChange}
        onFetch={handleFetch}
        defaultQuery={""} // This ensures no default query or tabs are loaded
      />
    </>
  );
};

export default GraphQLQueryEditor;

GraphQLQueryEditor.propTypes = {
  query: PropTypes.string,
  variables: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onFetch: PropTypes.func
}
