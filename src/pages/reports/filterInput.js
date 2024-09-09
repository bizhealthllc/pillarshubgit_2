import React from "react";
import PropTypes from 'prop-types';
import PeriodPicker from "../../components/periodPicker";
import RankSelect from "../../components/rankSelect";
import AutoComplete from "../../components/autocomplete";
import TextInput from "../../components/textInput";
import TreeSelect from "../../components/treeSelect";

const FilterInput = ({ filter, values, onChange, col = 'col' }) => {
  const { inputType } = filter;
  switch (inputType) {
    case "Period":
      return <> <div className="col"></div><div className="col-auto ms-auto"><PeriodPicker periodId={values?.periodId ?? ''} setPeriodId={(value) => onChange('periodId', value)} /></div></>;
    case "Rank":
      return <div className={col}><RankSelect name="rankId" value={values?.rankId ?? ''} onChange={onChange} ><option value="">All Ranks</option></RankSelect></div>
    case "CustomerId":
      return <div className={col}><AutoComplete placeholder="Select Customer" name="customerId" value={values?.customerId ?? ''} onChange={onChange} /></div>
    case "Tree":
      return <div className={col}><TreeSelect name={filter.id} value={values[filter.id] ?? ''} onChange={onChange} ></TreeSelect></div>
    default:
      return <div className={col}><TextInput name={filter.id} placeholder={JSON.stringify(filter)} value={values[filter.id] ?? ''} onChange={onChange} /></div>
  }
}

export default FilterInput;

FilterInput.propTypes = {
  filter: PropTypes.string,
  values: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  col: PropTypes.string
}