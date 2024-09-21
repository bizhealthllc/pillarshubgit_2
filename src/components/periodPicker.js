import React, { useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import PropTypes from 'prop-types';
import { ToLocalDate } from "../util/LocalDate";

var GET_PERIOD_DETAILS = gql`query ($date: Date!) {
  compensationPlans {
    name
    periods(date: $date, previous: 10) {
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


  return <>
    <select className="form-select" value={periodId} onChange={handleChange}>
      {data.compensationPlans.length > 1 ? (
        data.compensationPlans.map((plan) => {
          return <optgroup key={plan.id} label={plan.name}>
            {getOptions(plan)}
          </optgroup>
        })
      ) : (
        getOptions(data.compensationPlans[0])
      )}
    </select>
  </>
}

function getOptions(plan) {
  let copy = [...plan.periods];
  let periods = copy.reverse();
  return (periods && periods.map((period) => {
    return <option key={period.id} value={period.id}>{ToLocalDate(period.end, true)}</option>
  }))
}

export default PeriodPicker;


PeriodPicker.propTypes = {
  periodId: PropTypes.any.isRequired,
  setPeriodId: PropTypes.func.isRequired
}