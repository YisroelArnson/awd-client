import React from "react";
import JobPreviewBox from "./JobPreviewBox";
export default function WeeklySchedule(props) {
  const keys = Object.keys(props.jobs);
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  var currentWeekDays = [];
  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var lastSunday = new Date(today.setDate(today.getDate() - today.getDay()));
  for (let i = 0; i < 7; i++) {
    let tempDate = new Date(lastSunday);

    tempDate.setDate(tempDate.getDate() + i);
    currentWeekDays.push(tempDate);
  }

  return (
    <div className="weekly-schedule-container">
      {currentWeekDays.map((day, index) => {
        return (
          <div key={index} className="weekly-schedule-column">
            <h1>{days[day.getDay()]}</h1>
            <h2>{day.getDate()}</h2>
            {Object.keys(props.jobs).map((key, index) => {
              let jobDate = new Date(props.jobs[key].date);
              if (day.getTime() === jobDate.getTime()) {
                return (
                  <JobPreviewBox
                    key={index}
                    day={day}
                    job={props.jobs[key]}
                    linenList={props.linenList}
                    napkinsList={props.napkinsList}
                    fetchJobs={props.fetchJobs}
                  />
                );
              }
            })}
          </div>
        );
      })}
    </div>
  );
}
