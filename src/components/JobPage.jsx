import { React, useState } from "react";
import JobForm from "./JobForm";
import CheckBox from "./CheckBox";
import apiUrl from "../api_urls.json";
import SendInvoiceModal from "./sendInvoiceModal";
//if apiUrls.json development is false, set API_BASE to production url
const API_BASE = apiUrl.development
  ? apiUrl.api_url_development
  : apiUrl.api_url;
export default function JobPage(props) {
  const [jobFormOpen, setJobFormOpen] = useState(false);
  const [sendInvoiceModalOpen, setSendInvoiceModalOpen] = useState(false);

  const jobDate = new Date(props.job.date);
  let linen_total_price = 0;
  let napkin_total_price = 0;
  let item_total_price = 0;
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

  //send email
  const emailInvoice = (email) => {
    fetch(API_BASE + "/invoice/send", {
      method: "POST",
      body: JSON.stringify({ id: props.job._id, email: email }),
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

      {sendInvoiceModalOpen ? (
        <SendInvoiceModal
          setSendInvoiceModalOpen={setSendInvoiceModalOpen}
          job={props.job}
          emailInvoice={emailInvoice}
        />
      ) : (
        ""
      )}
      <div className="job-page-content">
        <div className="button-container">
          <div
            className="button create-invoice"
            onClick={() => createInvoice()}
          >
            Create Invoice
          </div>
          <div
            className="button send-invoice"
            onClick={() => setSendInvoiceModalOpen(true)}
          >
            Send Invoice
          </div>
          <div
            className="button edit-button"
            onClick={() => setJobFormOpen(true)}
          >
            Edit
          </div>
          <div
            className="button close-modal"
            onClick={() => props.setJobPageOpen(false)}
          >
            Close
          </div>
        </div>

        <h1 className="client-name">{props.job.client_name}</h1>
        <div className="checkbox-container">
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
        </div>

        <table className="client-details-table">
          <tbody>
            <tr>
              <td className="table-label">Email 📧:</td>
              <td>{props.job.client_email}</td>
            </tr>
            <tr>
              <td className="table-label">Phone 📞:</td>
              <td>{props.job.client_phone_number}</td>
            </tr>
            <tr>
              <td className="table-label">Date 📅:</td>
              <td>{jobDate.toDateString()}</td>
            </tr>
            <tr>
              <td className="table-label">Location 📍:</td>
              <td>{props.job.location}</td>
            </tr>
            <tr>
              <td className="table-label">Job #️⃣:</td>
              <td>{props.job.job_id}</td>
            </tr>
            <tr>
              <td className="table-label">Bouqette 💐:</td>
              <td>{props.job.bouqette ? "✅" : "❌"}</td>
            </tr>
            <tr>
              <td className="table-label">Order Flowers 🌺:</td>
              <td>{props.job.order_flowers ? "✅" : "❌"}</td>
            </tr>
          </tbody>
        </table>

        <div className="linen-table">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Amount</th>
                <th>Cost Per Item</th>
                <th>Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {props.job.linen.map((linen, index) => {
                const linenData = getLinenNameFromId(linen.unique_id);
                if (linenData) {
                  let linen_price = linenData.client_price;
                  if (props.job.client_type === "vendor") {
                    linen_price = linenData.vendor_price;
                  }
                  const totalCost = linen_price * linen.count;
                  linen_total_price += totalCost;
                  return (
                    <tr key={index}>
                      <td>{linenData.linen_name}</td>
                      <td>{linen.count}</td>
                      <td>${linen_price}</td>
                      <td>${totalCost}</td>
                    </tr>
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
                  const totalCost = napkin_price * napkin.count;
                  napkin_total_price += totalCost;
                  return (
                    <tr key={index}>
                      <td>{napkinData.napkin_name}</td>
                      <td>{napkin.count}</td>
                      <td>${napkin_price}</td>
                      <td>${totalCost.toFixed(2)}</td>
                    </tr>
                  );
                }
              })}

              {props.job.items.map((item, index) => {
                const totalCost = item.price * item.count;
                item_total_price += totalCost;
                return (
                  <tr key={index}>
                    <td>{item.item_name}</td>
                    <td>{item.count}</td>
                    <td>${item.price}</td>
                    <td>${totalCost.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              {/* <tr>
                <td colSpan="3" className="total-label">
                  Total price:
                </td>
                <td className="total-price">
                  ${linen_total_price + napkin_total_price + item_total_price}
                </td>
              </tr> */}
              <tr>
                <td colSpan="3" className="total-label">
                  Deposit Amount:
                </td>
                <td className="total-price">
                  - ${props.job.deposit_amount_recieved}
                </td>
              </tr>
              <tr>
                <td colSpan="3" className="total-label">
                  <strong>Total price:</strong>
                </td>
                <td className="total-price">
                  <strong>
                    $
                    {linen_total_price +
                      napkin_total_price +
                      item_total_price -
                      props.job.deposit_amount_recieved}
                  </strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="notes">
          <h2>Notes</h2>
          <p>{props.job.notes}</p>
        </div>

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
