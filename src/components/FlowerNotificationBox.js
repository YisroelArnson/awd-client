import { React, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
export default function FlowerNotificationBox({ jobs }) {
  const [displayJobsWithinXDays, setdisplayJobsWithinXDays] = useState(4);
  const today = new Date();
  let filteredJobs = jobs.filter((job) => {
    return (
      job.order_flowers &&
      differenceInCalendarDays(new Date(job.date), today) <=
        displayJobsWithinXDays &&
      differenceInCalendarDays(new Date(job.date), today) >= 0
    );
  });

  return (
    <div className="flower-notification-box-container">
      <h1>Order Flowers</h1>
      <h5 className="small-text">
        Showing jobs within{" "}
        <input
          type="number"
          name="displayJobsWithinXDays"
          value={displayJobsWithinXDays}
          onChange={(event) => setdisplayJobsWithinXDays(event.target.value)}
        ></input>{" "}
        days from now
      </h5>
      <table>
        <thead>
          <tr>
            <td className="bold">Name</td>
            <td className="bold">Location</td>
            <td className="bold">Date</td>
          </tr>
        </thead>
        <tbody>
          {filteredJobs.map((job) => (
            <tr>
              <td>{job.client_name}</td>
              <td>{job.location}</td>
              <td>{new Date(job.date).toDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
