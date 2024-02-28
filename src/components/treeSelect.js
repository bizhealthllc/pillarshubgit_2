import React, { Children } from "react";
import { useQuery, gql } from "@apollo/client";
import PropTypes from 'prop-types';

var GET_PERIOD_DETAILS = gql`query {
    trees{
        id
        name
      }
}`;

const TreeSelect = ({ className, name, value, onChange, children }) => {
  const { loading, error, data } = useQuery(GET_PERIOD_DETAILS, {});

  const handleChange = (event) => {
    onChange(name, event.target.value);
  };

  if (loading) return <span>-</span>;
  if (error) return `Error! ${error}`;

  return <>
    <select className={className ?? 'form-select'} value={value} onChange={handleChange}>
    <option value="0">--Select Tree--</option>
      {Children.map(children, child =>
        <>{child}</>
      )}
      {data && data.trees.map((tree) => {
        return <option key={tree.id} value={tree.id}>{tree.name}</option>
      })}
    </select>
  </>
}

export default TreeSelect;


TreeSelect.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.any
}