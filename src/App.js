import { useState, useEffect } from "react";
import "./App.css";
import JobForm from "./components/JobForm";
import WeeklySchedule from "./components/WeeklySchedule";
import Calendar from "./components/Calendar";
import Table from "./components/Table";
import FlowerNotificationBox from "./components/FlowerNotificationBox";
import apiUrl from "./api_urls.json";
//if apiUrls.json development is false, set API_BASE to production url
const API_BASE = apiUrl.development
  ? apiUrl.api_url_development
  : apiUrl.api_url;
function App() {
  //Store list of all jobs fetched from DB
  const [jobs, setJobs] = useState([]);

  //State to open and close add job model
  const [JobFormModalActive, setJobFormModalActive] = useState(false);

  //State to display app when data is done loading
  const [jobIsLoading, setJobIsLoading] = useState(true);
  const [linenIsLoading, setLinenIsLoading] = useState(true);
  const [napkinsIsLoading, setNapkinsIsLoading] = useState(true);

  //List of all tableclothes that we have
  const [linenList, setLinenList] = useState();
  //List of all napkins that we have
  const [napkinsList, setNapkinsList] = useState([]);

  useEffect(() => {
    getJobs();
    getLinen();
    getNapkins();
  }, []);
  //Fetches all jobs from DB
  const getJobs = () => {
    console.log("fetching");
    console.log(API_BASE + "/jobs");
    fetch(API_BASE + "/jobs")
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setJobIsLoading(false);
        console.log(data);
      })
      .catch((err) => console.error("Error:", err));
  };
  //Fetches all linen types from DB
  const getLinen = () => {
    fetch(API_BASE + "/linen")
      .then((res) => res.json())
      .then((data) => {
        setLinenList(data);
        setLinenIsLoading(false);
        console.log(data);
      })
      .catch((err) => console.error("Error:", err));
  };
  //Fetches all napkin types from DB
  const getNapkins = () => {
    fetch(API_BASE + "/napkins")
      .then((res) => res.json())
      .then((data) => {
        setNapkinsList(data);
        console.log(data);
        setNapkinsIsLoading(false);
      })
      .catch((err) => console.error("Error:", err));
  };

  return (
    <div>
      {jobIsLoading || linenIsLoading || napkinsIsLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="App">
          <div
            className="open-modal-button"
            onClick={() => {
              setJobFormModalActive(true);
            }}
          >
            Add Job
          </div>

          {JobFormModalActive ? (
            <JobForm
              jobs={jobs}
              setJobs={setJobs}
              job={{ linen: [], napkins: [], items: [] }}
              setJobFormModalActive={setJobFormModalActive}
              fetchJobs={getJobs}
              linenList={linenList}
              napkinsList={napkinsList}
            />
          ) : (
            ""
          )}
          <FlowerNotificationBox jobs={jobs} />
          <WeeklySchedule
            jobs={jobs}
            linenList={linenList}
            napkinsList={napkinsList}
            fetchJobs={getJobs}
          />
          <Calendar
            jobs={jobs}
            linenList={linenList}
            napkinsList={napkinsList}
            fetchJobs={getJobs}
          />
          <Table
            data={jobs}
            linenList={linenList}
            napkinsList={napkinsList}
            fetchJobs={getJobs}
          />
        </div>
      )}
    </div>
  );
}

export default App;
