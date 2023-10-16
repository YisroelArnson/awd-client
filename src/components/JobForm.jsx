import React from "react";
import { useState, useEffect } from "react";
import LinenInput from "./LinenInput";
import NapkinInput from "./NapkinInput";
import ItemInput from "./ItemInput";
import CheckBox from "./CheckBox";
import apiUrl from "../api_urls.json";
//if apiUrls.json development is false, set API_BASE to production url
const API_BASE = apiUrl.development
  ? apiUrl.api_url_development
  : apiUrl.api_url;
export default function JobForm(props) {
  //job: state to store job info as its added
  const [job, setJob] = useState(props.job);
  console.log(job);
  //Updates specific job item state when user changes input fields
  const handleChange = (event) => {
    setJob({ ...job, [event.target.name]: event.target.value });
  };

  //Handles the option change when user clicks on an option
  const handleOptionChoice = (name, value) => {
    setJob({ ...job, [name]: value });
  };

  const addLinenInput = () => {
    let temp = job.linen;
    temp.push({ unique_id: "", count: 0 });
    setJob({ ...job, linen: temp });
  };

  const updateLinenInput = (index, unique_id, count) => {
    let temp = job.linen;
    temp[index] = { unique_id: unique_id, count: parseInt(count) };
    setJob({ ...job, linen: temp });
  };

  const addNapkinInput = () => {
    let temp = job.napkins;
    temp.push({ unique_id: "", count: 0 });
    setJob({ ...job, napkins: temp });
  };

  const updateNapkinInput = (index, unique_id, count) => {
    let temp = job.napkins;
    temp[index] = { unique_id: unique_id, count: parseInt(count) };
    setJob({ ...job, napkins: temp });
  };

  const updateItemInput = (index, item_name, count, price) => {
    console.log("Updating item...............");
    let temp = job.items;
    temp[index] = {
      item_name: item_name,
      count: parseInt(count),
      price: parseInt(price),
    };
    setJob({ ...job, items: temp });
  };

  const addItemInput = () => {
    let temp = job.items;
    temp.push({ item_name: "", count: 1, price: 0 });
    setJob({ ...job, items: temp });
  };

  //--------------------API-------------------------//
  //Sends a post request to /jobs; body is job state
  const saveJob = () => {
    if (job._id) {
      fetch(API_BASE + "/jobs/" + job._id, {
        method: "PUT",
        body: JSON.stringify(job),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => {
          console.log(res);
          props.fetchJobs();
          props.setJobFormModalActive(false);
        })
        .catch((err) => console.error("Error:", err));
    } else {
      fetch(API_BASE + "/jobs", {
        method: "POST",
        body: JSON.stringify(job),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => {
          console.log(res);
          props.fetchJobs();
          props.setJobFormModalActive(false);
        })
        .catch((err) => console.error("Error:", err));
    }
  };
  //--------------------API-------------------------//
  return (
    <div className="add-job-modal">
      <div className="add-job-modal-content">
        <div
          className="close-modal-button"
          onClick={() => {
            props.fetchJobs();
            props.setJobFormModalActive(false);
          }}
        >
          x
        </div>
        <h2>Name</h2>
        <input
          className="name-input"
          type="text"
          name="client_name"
          value={job.client_name}
          placeholder="Name"
          onChange={handleChange}
        ></input>
        <h2 className="title">Location</h2>
        <input
          className="location-input"
          type="text"
          name="location"
          value={job.location}
          placeholder="Location"
          onChange={handleChange}
        ></input>
        <h2 className="title">Date</h2>
        <input
          className="date-input"
          type="text"
          name="date"
          value={job.date}
          placeholder="date"
          onChange={handleChange}
        ></input>
        <CheckBox
          checked={job.bouqette}
          title={"bouqette"}
          attribute_id={"bouqette"}
          onChangeFunction={handleChange}
        />
        <CheckBox
          checked={job.order_flowers}
          title={"Order Flowers"}
          attribute_id={"order_flowers"}
          onChangeFunction={handleChange}
        />
        <h2 className="title">Type of event</h2>
        <div
          className={
            job.job_type == "linen" ? "option picked-option" : "option"
          }
          type="option"
          name="job_type"
          value={"linen"}
          placeholder="Type of Event"
          onClick={() => handleOptionChoice("job_type", "linen")}
        >
          Linen
        </div>
        <div
          className={
            job.job_type == "wedding" ? "option picked-option" : "option"
          }
          type="option"
          name="job_type"
          value={"wedding"}
          placeholder="Type of Event"
          onClick={() => handleOptionChoice("job_type", "wedding")}
        >
          Wedding
        </div>
        <div id="linen-container">
          <h2>Linen</h2>
          {job.linen.length != 0
            ? job.linen.map((linen, index) => {
                return (
                  <LinenInput
                    linen={linen}
                    index={index}
                    key={index}
                    linenList={props.linenList}
                    updateLinenInput={updateLinenInput}
                  />
                );
              })
            : addLinenInput()}
        </div>
        <div
          className="add-linen-button"
          onClick={() => {
            addLinenInput();
          }}
        >
          Add linen
        </div>
        <h2>Napkins</h2>
        <div id="napkin-container">
          {job.napkins.length != 0
            ? job.napkins.map((napkin, index) => {
                return (
                  <NapkinInput
                    napkin={napkin}
                    index={index}
                    key={index}
                    napkinsList={props.napkinsList}
                    updateNapkinInput={updateNapkinInput}
                  />
                );
              })
            : addNapkinInput()}
        </div>
        <div
          className="add-napkin-button"
          onClick={() => {
            addNapkinInput();
          }}
        >
          Add Napkin
        </div>
        {/* /////// Add other types of items, like bedeken or center pieces */}
        <h2>Items</h2>
        <div id="item-container">
          {console.log(job.items)}
          {job.items.length != 0
            ? job.items.map((item, index) => {
                return (
                  <ItemInput
                    item={item}
                    index={index}
                    key={index}
                    napkinsList={props.napkinsList}
                    updateItemInput={updateItemInput}
                  />
                );
              })
            : addItemInput()}
        </div>
        <div
          className="add-napkin-button"
          onClick={() => {
            addItemInput();
          }}
        >
          Add Item
        </div>

        {/* Add other types of items ////// */}
        <h3 className="type-of-client-title">type of client</h3>
        <div
          className={
            job.client_type == "customer" ? "option picked-option" : "option"
          }
          type="option"
          name="client_type"
          value={"customer"}
          placeholder="Type of Event"
          onClick={() => handleOptionChoice("client_type", "customer")}
        >
          Customer
        </div>
        <div
          className={
            job.client_type == "vendor" ? "option picked-option" : "option"
          }
          type="option"
          name="client_type"
          value={"vendor"}
          placeholder="Type of Event"
          onClick={() => handleOptionChoice("client_type", "vendor")}
        >
          Vendor
        </div>
        <h3 className="title">Client Email</h3>
        <input
          className="client-email-input"
          type="text"
          name="client_email"
          value={job.client_email}
          placeholder="Client Email"
          onChange={handleChange}
        ></input>
        <h3 className="title">Client Phone</h3>
        <input
          className="client-phone-input"
          type="text"
          name="client_phone_number"
          value={job.client_phone_number}
          placeholder="Client Phone Number"
          onChange={handleChange}
        ></input>
        <h3 className="title">Deposit Amount</h3>
        <input
          type="number"
          name="deposit_amount_recieved"
          value={job.deposit_amount_recieved}
          placeholder="$300"
          onChange={handleChange}
        ></input>
        <h3 className="title">Notes</h3>
        <textarea
          className="notes-input-box"
          type="text"
          name="notes"
          value={job.notes}
          placeholder="Notes..."
          onChange={handleChange}
        />
        <div
          className="save-button"
          onClick={() => {
            saveJob();
          }}
        >
          Save
        </div>
      </div>
    </div>
  );
}
