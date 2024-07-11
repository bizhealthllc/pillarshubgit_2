import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Get } from '../hooks/useFetch';
import parse from 'html-react-parser';
import Modal from './modal';

import "./calendar.css";


const Calendar = ({ name }) => {
  const currentDate = new Date(Date.now());
  const [show, setShow] = useState(false);
  const [selectedDate, setDate] = useState(currentDate);
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);

  useEffect(() => {
    setEvents([]);
    var firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    var lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    Get('/api/v1/Appointments?begin=' + firstDay.toISOString() + '&end=' + lastDay.toISOString() + '&offset=0&count=500', (data) => {
      setEvents(data.map((d) => { return { ...d, date: new Date(Date.parse(d.beginTime)), end: new Date(Date.parse(d.endTime)) } }));
    }, (error) => {
      alert(error);
    });
  }, [selectedDate]);


  const handleCloseModal = () => {
    setShow(false);
  }

  const handleSelectDay = (day) => {
    var thisDayEvents = events?.filter((e) => e.date.getDate() == day).sort((a, b) => (a.date > b.date) ? 1 : -1);
    if (thisDayEvents.length > 0) {
      setSelectedEvents(thisDayEvents);
      setShow(true);
    }
  }

  const handleNext = () => {
    setDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)));
  }

  const handleLast = () => {
    setDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)));
  }

  let currentDay = 0;
  if (currentDate.getFullYear() == selectedDate.getFullYear() && currentDate.getMonth() == selectedDate.getMonth()) {
    currentDay = currentDate.getDate();
  }

  var weekData = fillWeekArrays(selectedDate, events);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let optionsL1 = {
    weekday: "long",
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  let optionsL2 = {
    hour: 'numeric',
    minute: '2-digit'
  };

  return <>
    <div className="calendar" name={name}>
      <div className="front">
        <div className="current-date">
          <h1>{months[selectedDate.getMonth()]} {selectedDate.getFullYear()}</h1>
          <div className="btn-group">
            <button className="btn btn-link text-reset btn-icon" onClick={handleLast}>
              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-left" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M15 6l-6 6l6 6"></path>
              </svg>
            </button>
            <button className="btn btn-link text-reset btn-icon" onClick={handleNext}>
              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-right" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M9 6l6 6l-6 6"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="current-month">
          <div className="week-days">
            <div>
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>
          </div>

          <div className="weeks">
            {weekData && weekData.map((week) => {
              return <div key={week.week} className={week.week}>
                {week.days.map((day) => {
                  return <span key={`${day.id}_${day.last}_${day.next}_${day.event}`} className={`${day.last ? 'last-month' : ''} ${day.next ? 'last-month' : ''} ${day.event ? 'event' : ''} ${(day.id == currentDay && !day.next && !day.last) ? 'active' : ''}`} onClick={() => handleSelectDay(day.id)}>
                    {day.id} {day.event}
                  </span>
                })}
              </div>
            })}
          </div>
        </div>
      </div>

    </div>

    <Modal showModal={show} size="sm" centered="true" onHide={handleCloseModal}>
      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      {selectedEvents && selectedEvents.map((e) => {
        return <div key={e.id} className="modal-body py-4">
          <dl className="row">
            <dt className="col-1"></dt>
            <dd className="col-11">
              <div className="card-title">{e.name}</div>
            </dd>
            <dt className="col-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-calendar-event" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 5m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M16 3l0 4"></path><path d="M8 3l0 4"></path><path d="M4 11l16 0"></path><path d="M8 15h2v2h-2z"></path></svg>
            </dt>
            <dd className="col-11 mb-3">
              <div>{e.date.toLocaleDateString(undefined, optionsL1)}</div>
              <div>
                {!e.end && 'All Day'}
                {e.end && e.date.toLocaleTimeString(undefined, optionsL2)}
                {e.end && ' - '}
                {e.end && e.end.toLocaleTimeString(undefined, optionsL2)}
              </div>
              <div>
                {e.date.toLocaleDateString(undefined, { day: '2-digit', timeZoneName: 'long' }).slice(4)}
              </div>
            </dd>
            {e.address1 && <>
              <dt className="col-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-map-pin" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path><path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"></path></svg>
              </dt>
              <dd className="col-11 mb-3">
                <div>{e.address1}</div>
                <div>{e.address2}</div>
              </dd>
            </>}
            {e.content && <>
              <dt className="col-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-align-justified"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 6l16 0" /><path d="M4 12l16 0" /><path d="M4 18l12 0" /></svg>
              </dt>
              <dd className="col-11">
                <div>
                  {parse(e.content)}
                </div>
              </dd>
            </>}
          </dl>
        </div>
      })}
    </Modal>
  </>
}

function fillWeekArrays(date, events) {
  var weeks = [];

  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  var lastMonthLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();

  var lastDayOfWeek = lastDay.getDay()
  var firstDayOfWeek = firstDay.getDay()
  var firstWeek = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    let id = lastMonthLastDay - (firstDayOfWeek - (i + 1));
    firstWeek.push({ last: true, event: false, id: id });
  }
  for (let i = firstDayOfWeek; i < 7; i++) {
    let id = i - firstDayOfWeek + 1;
    let hasEvent = (events.find((e) => e.date.getDate() == id) !== undefined);
    firstWeek.push({ last: false, event: hasEvent, id: id });
  }
  weeks.push({ week: "first", days: firstWeek });

  var secondWeek = [];
  for (let i = 0; i < 7; i++) {
    let id = i + (8 - firstDayOfWeek);
    let hasEvent = (events.find((e) => e.date.getDate() == id) !== undefined);
    secondWeek.push({ last: false, event: hasEvent, id: id });
  }
  weeks.push({ week: "second", days: secondWeek });

  var thirdWeek = [];
  for (let i = 0; i < 7; i++) {
    let id = i + (15 - firstDayOfWeek);
    let hasEvent = (events.find((e) => e.date.getDate() == id) !== undefined);
    thirdWeek.push({ last: false, event: hasEvent, id: id });
  }
  weeks.push({ week: "third", days: thirdWeek });

  var fourthWeek = [];
  for (let i = 0; i < 7; i++) {
    let id = i + (22 - firstDayOfWeek);
    let hasEvent = (events.find((e) => e.date.getDate() == id) !== undefined);
    fourthWeek.push({ last: false, event: hasEvent, id: id });
  }
  weeks.push({ week: "fourth", days: fourthWeek });

  var fifthWeek = [];
  for (let i = 0; i < 7; i++) {
    let day = i + (29 - firstDayOfWeek);
    let next = false;
    if (day > lastDay.getDate()) {
      day = i - lastDayOfWeek;
      next = true;
    }
    let hasEvent = !next && (events.find((e) => e.date.getDate() == day) !== undefined);
    fifthWeek.push({ last: false, next: next, event: hasEvent, id: day });
  }
  weeks.push({ week: "fifth", days: fifthWeek });

  var sixthWeek = [];
  for (let i = 0; i < 7; i++) {
    let day = i + (36 - firstDayOfWeek);
    let next = false;
    if (day > lastDay.getDate()) {
      if ((36 - firstDayOfWeek) > lastDay.getDate()) {
        day = i + (7 - lastDayOfWeek);
      } else {
        day = i - lastDayOfWeek;
      }
      next = true;
    }
    let hasEvent = !next && (events.find((e) => e.date.getDate() == day) !== undefined);
    sixthWeek.push({ last: false, next: next, event: hasEvent, id: day });
  }
  weeks.push({ week: "sixth", days: sixthWeek });

  return weeks;
}

export default Calendar;

Calendar.propTypes = {
  name: PropTypes.string.isRequired
}