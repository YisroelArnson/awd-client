import { React, useState } from "react";
import {
  add,
  differenceInDays,
  endOfMonth,
  format,
  isSameDay,
  setDate,
  startOfMonth,
  sub,
} from "date-fns";
import Cell from "./Cell";
import JobPreviewBox from "./JobPreviewBox";
const weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export default function Calendar(props) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const startDate = startOfMonth(selectedDate);
  const endDate = endOfMonth(selectedDate);
  const numDays = differenceInDays(endDate, startDate) + 1;

  const prefixDays = startDate.getDay();
  const suffixDays = 6 - endDate.getDay();

  const prevMonth = () => setSelectedDate(sub(selectedDate, { months: 1 }));
  const nextMonth = () => setSelectedDate(add(selectedDate, { months: 1 }));
  const prevYear = () => setSelectedDate(sub(selectedDate, { years: 1 }));
  const nextYear = () => setSelectedDate(add(selectedDate, { years: 1 }));

  return (
    <div className="calendar-border">
      <div className="calendar-container">
        <Cell className="cell-header cell-clickable" onClick={prevYear}>
          {"<<"}
        </Cell>
        <Cell className="cell-header cell-clickable" onClick={prevMonth}>
          {"🡠"}
        </Cell>
        <Cell className="cell-header font-l bold col-span-3">
          {format(selectedDate, "LLLL yyyy")}
        </Cell>
        <Cell className="cell-header cell-clickable" onClick={nextMonth}>
          {"🡢"}
        </Cell>
        <Cell className="cell-header cell-clickable" onClick={nextYear}>
          {">>"}
        </Cell>
        {weeks.map((week, index) => (
          <Cell key={index} className="cell-header bold uppercase">
            {week}
          </Cell>
        ))}

        {Array.from({ length: prefixDays }).map((_, index) => (
          <Cell className="cell empty-days" key={index} />
        ))}

        {Array.from({ length: numDays }).map((_, index) => {
          let indexOfJobsToDisplay = [];
          //Create day format for this day in calendar
          const dayOfMonth = index + 1;
          const currentMonth = selectedDate.getMonth();
          const currentYear = selectedDate.getFullYear();
          const date = new Date(currentYear, currentMonth, dayOfMonth);
          for (let i = 0; i < props.jobs.length; i++) {
            let tempDate = new Date(props.jobs[i].date);
            if (isSameDay(tempDate, date)) {
              indexOfJobsToDisplay.push(i);
            }
          }
          if (indexOfJobsToDisplay.length > 0) {
            return (
              <Cell key={index} date={date} className="cell">
                <h4 className="cell-date-title">{dayOfMonth}</h4>

                {indexOfJobsToDisplay.map((index) => {
                  return (
                    <JobPreviewBox
                      key={index}
                      job={props.jobs[index]}
                      linenList={props.linenList}
                      napkinsList={props.napkinsList}
                      fetchJobs={props.fetchJobs}
                      partialRender={true}
                    />
                  );
                })}
              </Cell>
            );
          }
          return (
            <Cell className="cell" key={index} date={date}>
              <h4 className="cell-date-title">{dayOfMonth}</h4>
            </Cell>
          );
        })}

        {Array.from({ length: suffixDays }).map((_, index) => (
          <Cell className="cell empty-days" key={index} />
        ))}
      </div>
    </div>
  );
}
