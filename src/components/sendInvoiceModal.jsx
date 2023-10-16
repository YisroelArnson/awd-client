import React, { useState } from "react";

function SendInvoiceModal(props) {
  const [email, setEmail] = useState("");

  const closeModal = () => {
    props.setSendInvoiceModalOpen(false);
  };

  const sendEmail = () => {
    // Implement your logic to send the email here.
    // You can access the 'email' state to get the email input value.
  };

  return (
    <div>
      <div className="send-email-modal">
        <div className="modal-content">
          <button class="close-button" onClick={() => closeModal()}>
            x
          </button>
          <button
            onClick={() => {
              props.emailInvoice(props.job.client_email);
              closeModal();
            }}
          >
            Send Email to {props.job.client_email}
          </button>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={() => {
              props.emailInvoice(email);
              closeModal();
            }}
          >
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
}

export default SendInvoiceModal;
