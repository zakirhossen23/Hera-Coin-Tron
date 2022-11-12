
import React, { useState, useEffect } from 'react';
import usContract from '../../../services/api/useContractApi';
import send_token from '../../../services/api/sendToken';

export default async function handler(req, res) {
  //Variables
  let id = Number(req.query.id)
  let privatekey = req.body.privatekey
  let biddingPrice = req.body.BidPrice

  const contract = usContract(privatekey);
  let output = null;
  async function fetchContractData() {
    if (contract) {
      try {
        const tokenURI = JSON.parse(await contract.tokenURI(id));
        //Transfer
        if (biddingPrice < Number(tokenURI.properties.price.description)) {
          output = JSON.stringify({
            status: "error",
            message: `The bid price is lower than ${tokenURI.properties.price.description}!`
          })
          console.log(output);
          return;
        }
        let senderAddress = "";
        try {
          senderAddress = await send_token(biddingPrice.toString(), tokenURI.properties.wallet.description, privatekey)
        } catch (error) {
          output = JSON.stringify({
            status: "error",
            from:"Transferring Error",
            message: error
          })
          console.log(output);
          return;
        }

        //Contract
        var parsed = tokenURI;
        let eventId = Number(tokenURI.properties.eventID);
        parsed['properties']['price']['description'] = biddingPrice.toString();
        let currentDate = new Date();
        const createdObject = {
          title: 'Asset Metadata Bids',
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: senderAddress
            },
            bid: {
              type: 'string',
              description: biddingPrice
            },
            time: {
              type: 'string',
              description: currentDate
            }
          }
        };
        const totalraised = await contract.getEventRaised(eventId);
        console.log(totalraised)
        let Raised = 0;
        Raised = Number(totalraised) + Number(biddingPrice);        
         await contract.createBid(id, JSON.stringify(createdObject), JSON.stringify(parsed), eventId, Raised.toString());

        output = JSON.stringify({
          status: "success",
          message: `Bid successful`
        })
        console.log(output);
      } catch (error) {
        output = {
          status: "error",
          from:"Full Error",
          message: error,

        };
      }
    }
  }

  await fetchContractData();

  res.status(200).json(output)
}


// Sample Data
// {
//   "privatekey": "fb57cdb52c16a26a9f54d37ce8f106bc4a334772d5c376c08f009e042cb0a7fe",
//   "BidPrice": 0.05
// }


