import { React, useState } from "react";
import JobPage from "./JobPage";
export default function JobPreviewBox(props) {
  //Set class names based on job_type attribute from job
  let jobTypeStyles = "job-preview-box-container ";
  if (props.job.job_type === "linen") jobTypeStyles += "linen-job-style";
  else if (props.job.job_type === "wedding")
    jobTypeStyles += "wedding-job-style";
  const [jobPageOpen, setJobPageOpen] = useState(false);
  const getLinenNameFromId = (id) => {
    for (let i = 0; i < props.linenList.length; i++) {
      if (props.linenList[i][1] === id) {
        return props.linenList[i][0];
      }
    }
  };

  const getNapkinNameFromId = (id) => {
    for (let i = 0; i < props.napkinsList.length; i++) {
      if (props.napkinsList[i][1] === id) {
        return props.napkinsList[i][0];
      }
    }
  };
  console.log(props.job);
  return (
    <div>
      {jobPageOpen ? (
        <JobPage
          job={props.job}
          linenList={props.linenList}
          napkinsList={props.napkinsList}
          setJobPageOpen={setJobPageOpen}
          fetchJobs={props.fetchJobs}
        />
      ) : (
        ""
      )}
      <div onClick={() => setJobPageOpen(true)} className={jobTypeStyles}>
        <div>
          <h2>{props.job.client_name}</h2>
        </div>
        {!props.partialRender &&
          props.job.linen.map((linen, index) => {
            return (
              <h4 key={index}>
                {linen.count} - {getLinenNameFromId(linen["unique_id"])}
              </h4>
            );
          })}

        {!props.partialRender &&
          props.job.napkins.map((napkin, index) => {
            return (
              <h4 key={index} className="napkin-text">
                {napkin.count} - {getNapkinNameFromId(napkin["unique_id"])}
              </h4>
            );
          })}
      </div>
    </div>
  );
}
