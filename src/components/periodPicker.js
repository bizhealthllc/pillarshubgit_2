import React, { useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import PropTypes from 'prop-types';
import { ToLocalDate } from "../util/LocalDate";

var GET_PERIOD_DETAILS = gql`query ($date: Date!) {
  compensationPlans(first: 1) {
    periods(date: $date, previous: 12) {
      id
      begin
      end
      status
      totalCommissions
      totalCustomers
      totalCustomersPaid
      totalVolume
    }
  }
}`;

const PeriodPicker = ({ periodId, setPeriodId }) => {
  const currentDate = new Date(Date.now());
  const isoDate = currentDate.toISOString();
  const dateOnly = isoDate.split('T')[0];

  const { loading, error, data } = useQuery(GET_PERIOD_DETAILS, {
    variables: { date: dateOnly },
  });

  useEffect(() => {
    if (data && (periodId ?? 0) == 0) {
      var periodCopy = [...data.compensationPlans[0].periods].reverse();
      var fpId = periodCopy[0]?.id;
      if (fpId) {
        setPeriodId(fpId, false);
      }
    }
  }, [periodId, data])

  const handleChange = (event) => {
    var value = event.target.value;
    setPeriodId(value, true);
  };

  if (loading) return <span>-</span>;
  if (error) return `Error! ${error}`;

  let copy = [...data.compensationPlans[0].periods];
  let periods = copy.reverse();

  return <>
    <select className="form-select" value={periodId} onChange={handleChange}>
      {periods && periods.map((period) => {
        return <option key={period.id} value={period.id}>{ToLocalDate(period.end, true)}</option>
      })}
    </select>
  </>
}

export default PeriodPicker;


PeriodPicker.propTypes = {
  periodId: PropTypes.string.isRequired,
  setPeriodId: PropTypes.func.isRequired
}