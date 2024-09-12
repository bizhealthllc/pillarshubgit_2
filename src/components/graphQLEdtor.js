import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { QueryEditor, EditorContextProvider, SchemaContextProvider } from '@graphiql/react';
import 'graphiql/graphiql.css';
import { GetToken } from '../features/authentication/hooks/useToken';
import BaseUrl from '../hooks/baseUrl';

const GraphQLEditor = ({ query, onChange, onFetch }) => {
  const [introspectionCache, setIntrospectionCache] = useState();
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

  const setQuery = (value) => {
    onChange(value);
  }

  return (
    <div style={{ height: '500px', overflow: 'visible', position: 'relative' }}>
      <EditorContextProvider query={query}>
        {/* Provide the schema dynamically */}
        <SchemaContextProvider fetcher={fetcher}>
          {/* Minimal editor with schema fetching, introspection, and autocomplete */}
          <div className="graphiql-container">
            <QueryEditor
              initialQuery={query}
              onEdit={setQuery}      // Update query on edit
            />
          </div>
        </SchemaContextProvider>
      </EditorContextProvider>
    </div>
  );
};

export default GraphQLEditor;

GraphQLEditor.propTypes = {
  query: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onFetch: PropTypes.func
}
