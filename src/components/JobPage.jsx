import { React, useState } from "react";
import JobForm from "./JobForm";
import CheckBox from "./CheckBox";
import apiUrl from "../api_urls.json";
const API_BASE = apiUrl.api_url;

export default function JobPage(props) {
  const [jobFormOpen, setJobFormOpen] = useState(false);
  const jobDate = new Date(props.job.date);
  let linen_total_price = 0;
  let napkin_total_price = 0;
  const handleCheckBoxChange = (event) => {
    fetch(API_BASE + "/jobs/attribute/" + props.job._id, {
      method: "PUT",
      body: JSON.stringify({
        attribute: event.target.name,
        value: event.target.value,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => {
        console.log(res);
        props.fetchJobs();
      })
      .catch((err) => console.error("Error:", err));
  };

  const getLinenNameFromId = (id) => {
    for (let i = 0; i < props.linenList.length; i++) {
      if (props.linenList[i][1] === id) {
        return {
          linen_name: props.linenList[i][0],
          client_price: props.linenList[i][6],
          vendor_price: props.linenList[i][7],
        };
      }
    }
  };

  const getNapkinNameFromId = (id) => {
    for (let i = 0; i < props.napkinsList.length; i++) {
      if (props.napkinsList[i][1] === id) {
        return {
          napkin_name: props.napkinsList[i][0],
          client_price: props.napkinsList[i][5],
          vendor_price: props.napkinsList[i][6],
        };
      }
    }
  };

  const createInvoice = () => {
    fetch(API_BASE + "/invoice", {
      method: "POST",
      body: JSON.stringify({ id: props.job._id, title: "invoice_" }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => {
        console.log(res.status);
        // This code is for when I have a send invoice button
        // if (res.ok) {
        //   handleCheckBoxChange({
        //     target: { name: "sent_invoice", value: true },
        //   });
        // }
      })
      .catch((err) => console.error("Error:", err));
  };
  return (
    <div className="job-page-modal">
      {jobFormOpen ? (
        <JobForm
          job={props.job}
          setJobFormModalActive={setJobFormOpen}
          linenList={props.linenList}
          napkinsList={props.napkinsList}
          fetchJobs={props.fetchJobs}
        />
      ) : (
        ""
      )}
      <div className="job-page-content">
        <div className="job-page-top-bar">
          <div>
            <h1>Name of client: {props.job.client_name}</h1>
          </div>

          <div className="top-bar-right">
            <div
              className="create-invoice-button"
              onClick={() => createInvoice()}
            >
              Create Invoice
            </div>
            <div
              className="job-page-edit-button"
              onClick={() => {
                setJobFormOpen(true);
              }}
            >
              Edit
            </div>
            <h2
              className="exit-button"
              onClick={() => props.setJobPageOpen(false)}
            >
              x
            </h2>
          </div>
        </div>
        <CheckBox
          checked={props.job.sent_invoice}
          title={"sent invoice"}
          attribute_id={"sent_invoice"}
          onChangeFunction={handleCheckBoxChange}
        />
        <CheckBox
          checked={props.job.paid}
          title={"paid"}
          attribute_id={"paid"}
          onChangeFunction={handleCheckBoxChange}
        />
        <CheckBox
          checked={props.job.linen_picked_up}
          title={"Linen picked up"}
          attribute_id={"linen_picked_up"}
          onChangeFunction={handleCheckBoxChange}
        />

        <h4>Job ID: {props.job.job_id}</h4>
        <h2>Date: {jobDate.toDateString()}</h2>
        <h2>Location: {props.job.location}</h2>
        <h2>bouqette: {"" + props.job.bouqette}</h2>
        <h2>Order flowers: {"" + props.job.order_flowers}</h2>
        <h2>
          Deposit Amount Recieved: {"$" + props.job.deposit_amount_recieved}
        </h2>
        <div className="linen-table">
          {props.job.linen.map((linen, index) => {
            const linenData = getLinenNameFromId(linen.unique_id);
            if (linenData) {
              let linen_price = linenData.client_price;
              if (props.job.client_type === "vendor") {
                linen_price = linenData.vendor_price;
              }
              linen_total_price += linen_price * linen.count;
              return (
                <h4 key={index}>
                  {linenData.linen_name} - {linen.count} x ${linen_price} = $
                  {linen_price * linen.count}
                </h4>
              );
            }
          })}

          {props.job.napkins.map((napkin, index) => {
            const napkinData = getNapkinNameFromId(napkin.unique_id);
            if (napkinData) {
              let napkin_price = napkinData.client_price;
              if (props.job.client_type === "vendor") {
                napkin_price = napkinData.vendor_price;
              }
              napkin_total_price += napkin_price * napkin.count;
              return (
                <h4 key={index} className="napkin-text">
                  {napkinData.napkin_name} - {napkin.count} x ${napkin_price} =
                  ${(napkin_price * napkin.count).toFixed(2)}
                </h4>
              );
            }
          })}
          <h2>Total price: ${linen_total_price + napkin_total_price}</h2>
        </div>

        <p>{props.job.notes}</p>

        <div className="invoice-link-container">
          {props.job.invoice_ids != 0 ? (
            props.job.invoice_ids.map((id, index) => {
              let link =
                "https://docs.google.com/spreadsheets/d/" +
                props.job.invoice_ids[props.job.invoice_ids.length - index - 1];
              return (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={link}
                  className="invoice-link"
                >
                  Invoice #{props.job.invoice_ids.length - index}
                </a>
              );
            })
          ) : (
            <h3>There are no invoice created for this job yet</h3>
          )}
        </div>
      </div>
    </div>
  );
}
