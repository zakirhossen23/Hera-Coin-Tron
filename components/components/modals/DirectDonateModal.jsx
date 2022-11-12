import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import UseFormInput from '../UseFormInput'

export default function DirectDonateModal({
  show,
  onHide,
  eventId,
  contract,
  senderAddress,
  EventWallet,
}) {
  const [Alert, setAlert] = useState('')

  const Web3 = require('web3')

  const sleep = (milliseconds) => {
    //Custom sleep(n) code
    return new Promise((resolve) => setTimeout(resolve, milliseconds))
  }

  const [Amount, AmountInput] = UseFormInput({
    //Input field
    type: 'number',
    placeholder: 'Amount',
  })

  function activateWarningModal(TextAlert) {
    //Changing Warning Alert box text
    var alertELM = document.getElementById('alert')
    alertELM.style = 'contents'
    setAlert(TextAlert)
  }
  function activateWorkingModal(TextAlert) {
    //Changing Success Alert box text
    var alertELM = document.getElementById('workingalert')
    alertELM.style = 'contents'
    setAlert(TextAlert)
  }

  async function DonateCoin() {
    //Donate button function
    var DonateBTN = document.getElementById("DonateBTN");
    DonateBTN.disabled = true;

    try {
      activateWorkingModal("Transferring....")
   
      let AmountinFull = (Number(Amount) * 1000000).toLocaleString('fullwide', { useGrouping: false });
      console.log("Donating")

      var fromAddress = window.tronWeb.defaultAddress.base58; //address _from
      // Create an unsigned TRX transfer transaction
      const transactionobj = await tronWeb.transactionBuilder.sendTrx(
            EventWallet,
            AmountinFull,
            fromAddress
      );
      const signedtxn = await tronWeb.trx.sign(transactionobj);
      await tronWeb.trx.sendRawTransaction(signedtxn);
      const Raised = Number(await contract.getEventRaised(eventId).call()) + Number(Amount);
      activateWorkingModal("Done! Please confirm Updating Raised...")

      await contract							//Resending updating Raised 
        ._setEventRaised(Number(eventId), Raised.toString())
        .send({
          feeLimit: 1_000_000_000,
          shouldPollResponse: false
        })

      activateWorkingModal('Success!')
      window.document.getElementsByClassName('btn-close')[0].click()
      DonateBTN.disabled = false
      await sleep(200)
      window.location.reload()
    } catch (e) {
      //Got error
      console.error(e)
      activateWarningModal(`Error! Please try again!`)
      var alertELM = document.getElementById('workingalert')
      alertELM.style.display = 'none'
      DonateBTN.disabled = false;
      return
    }
  }
  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Donate Coin
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Form>
          <div id="alert" style={{ display: 'none', fontSize: '30px' }} className="alert alert-danger" role="alert">
            {Alert}
          </div>
          <div id="workingalert" style={{ display: 'none', fontSize: '30px' }} className="alert alert-success" role="alert" >
            {Alert}
          </div>
      

          <Form.Group className="mb-3" controlId="formGroupName">
            <Form.Label>Amount in TRX</Form.Label>
            {AmountInput}
          </Form.Group>
          <div className="d-grid">
            <Button variant="primary" id="DonateBTN" onClick={DonateCoin}>
              Donate
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
