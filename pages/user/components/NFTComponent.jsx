import React, { useState, useEffect } from 'react'
import isServer from '../../../components/isServer'
export default function NFTComponent({ Id, EventID, name, price, image, signer, wallet, isGifted, showingFunc, unwrapingFunc }) {

  if (isServer()) return <></>
  return (<>
    <div className="LSPs-asset-wrapper">
      <div className="LSPs-preview-card" >
        <div className="d-flex flex-lg-row-reverse h-50 p-1 w-100">
          <small className="LSPs-supply">{price} TRX </small>
        </div>
        <div style={{ height: "70%", display: "flex", justifyContent: "center" }}>
          <img src={image} className="h-100 main-nav" />
        </div>
        <div className="LSPs-infos position-relative">
          <small style={{ bottom: "30%" }} className="balance-amount position-absolute">
            {name.substring(0, 17)}
          </small>
        </div>
     
      </div>
    </div>


  </>)
}
