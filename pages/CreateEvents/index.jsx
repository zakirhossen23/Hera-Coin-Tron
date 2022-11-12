import React, { useState } from 'react'
import Head from 'next/head'
import Button from 'react-bootstrap/Button'
import UseFormInput from '../../components/components/UseFormInput'
import UseFormTextArea from '../../components/components/UseFormTextArea'
import useContract from '../../services/useContract'
import { Header } from '../../components/layout/Header'
import NavLink from 'next/link'
import isServer from '../../components/isServer'
import { NFTStorage, File } from 'nft.storage'
import Web3 from 'web3'
export default function CreateEvents() {
  const { contract, signerAddress } = useContract()
  const [EventImage, setEventImage] = useState([])
  if (isServer()) return null

  //Storage API for images and videos
  const NFT_STORAGE_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJDMDBFOGEzZEEwNzA5ZkI5MUQ1MDVmNDVGNUUwY0Q4YUYyRTMwN0MiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NDQ3MTgxOTY2NSwibmFtZSI6IlplbmNvbiJ9.6znEiSkiLKZX-a9q-CKvr4x7HS675EDdaXP622VmYs8'
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })

  //Input fields
  const [EventTitle, EventTitleInput] = UseFormInput({
    defaultValue: '',
    type: 'text',
    placeholder: 'Event Title',
    id: '',
  })
  const [EventDescription, EventDescriptionInput] = UseFormTextArea({
    defaultValue: '',
    placeholder: 'Event Description',
    id: '',
    rows: 4,
  })
  const [EventDate, EventDateInput] = UseFormInput({
    defaultValue: '',
    type: 'datetime-local',
    placeholder: 'Event End Date ',
    id: 'enddate',
  })
  const [EventGoal, EventGoalInput] = UseFormInput({
    defaultValue: '',
    type: 'text',
    placeholder: 'Event Goal in TRX',
    id: 'goal',
  })

  //Downloading plugin function
  function downloadURI(uri, name) {
    var link = document.createElement('a')
    link.download = name
    link.href = uri
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  //Creating plugin function
  async function CreatePlugin(src) {
    const output = `<html><head></head><body><iframe src="${src}" style="width: 100%;height: 100%;" /></body></html>`
    // Download it
    const blob = new Blob([output])
    const fileDownloadUrl = URL.createObjectURL(blob)
    downloadURI(fileDownloadUrl, 'Generated Plugin.html')
    console.log(output)
  }

  //Function after clicking Create Event Button
  async function createEvent() {

    var CreateEVENTBTN = document.getElementById('CreateEVENTBTN')
    CreateEVENTBTN.disabled = true
    let allFiles = []
    for (let index = 0; index < EventImage.length; index++) {
      //Gathering all files link
      const element = EventImage[index]
      const metadata = await client.storeBlob(element)
      const urlImageEvent = {
        url: 'https://' + metadata + '.ipfs.nftstorage.link',
        type: element.type,
      }
      allFiles.push(urlImageEvent)
    }

    //Creating an object of all information to store in EVM
    const createdObject = {
      title: 'Asset Metadata',
      type: 'object',
      properties: {
        Title: {
          type: 'string',
          description: EventTitle,
        },
        Description: {
          type: 'string',
          description: EventDescription,
        },
        Date: {
          type: 'string',
          description: EventDate,
        },
        Goal: {
          type: 'string',
          description: EventGoal,
        },
        logo: {
          type: 'string',
          description: allFiles[0],
        },
        wallet: {
          type: 'string',
          description: window.tronWeb.defaultAddress.base58,
        },
        typeimg: {
          type: 'string',
          description: 'Event',
        },
        allFiles,
      },
    }
    console.log('======================>Creating Event')
    try {
      // Creating Event in EVM
      await contract
        .createEvent(window.tronWeb.defaultAddress.base58, JSON.stringify(createdObject))
        .send({
          feeLimit: 1_000_000_000,
          shouldPollResponse: false
        })

      //Getting the event id of new one
      let eventid = await contract.totalEvent().call()
      if (document.getElementById('plugin').checked) {
        await CreatePlugin(
          `http://${window.location.host}/donation/auction?[${Number(eventid) - 1}]`,
        )
      }
    } catch (error) {
      console.error(error)
      window.location.href = '/login' //If found any error then it will let the user to login page
    }
    window.location.href = '/donation' //If it created sucessfully then it will redirect to donation
    CreateEVENTBTN.disabled = false
  }

  function CreateEventBTN() {
    if (
      window.localStorage.getItem('Type') != 'manager' &&
      typeof window.ethereum !== 'undefined'
    ) {
      return (
        <>
          <NavLink href="/login?[/CreateEvents]">
            <Button style={{ margin: '17px 0 0px 0px', width: '100%' }}>
              Login as Event Manager
            </Button>
          </NavLink>
        </>
      )
    }
    return (
      <>
        <Button
          id="CreateEVENTBTN"
          style={{ margin: '17px 0 0px 0px', width: '100%' }}
          onClick={createEvent}
        >
          Create Event
        </Button>
      </>
    )
  }
  function FilehandleChange(event) {
    // If user uploaded images/videos

    for (let index2 = 0; index2 < event.target.files.length; index2++) {
      setEventImage((pre) => [...pre, event.target.files[index2]])
    }
  }

  function AddBTNClick(event) {
    //Clicking on +(Add) Function
    var EventImagePic = document.getElementById('EventImage')
    EventImagePic.click()
  }

  function DeleteSelectedImages(event) {
    //Deleting the selected image
    var DeleteBTN = event.currentTarget
    var idImage = Number(DeleteBTN.getAttribute('id'))
    var newImages = []
    var allUploadedImages = document.getElementsByName('deleteBTN')
    for (let index = 0; index < EventImage.length; index++) {
      if (index != idImage) {
        const elementDeleteBTN = allUploadedImages[index]
        elementDeleteBTN.setAttribute('id', newImages.length.toString())
        const element = EventImage[index]
        newImages.push(element)
      }
    }
    setEventImage(newImages)
  }

  return (
    <>
      <>
        <Head>
          <title>Create Event</title>
          <meta name="description" content="Create Event" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header></Header>
        <div className="row createevents-container" style={{ height: '100%' }}>
          <div className="createevents col">
            <div
              style={{
                background: 'rgb(255 255 255)',
                padding: '19px',
                borderRadius: '1rem',
                height: '100%',
                border: 'solid #e2f6f6'
              }}
            >
              <div style={{ margin: '0px 0px 30px 0px' }}>
                <h1>Create Event</h1>
              </div>

              <div style={{ margin: '18px 0' }}>
                <h6>Event Title</h6>
                {EventTitleInput}
              </div>

              <div style={{ margin: '18px 0' }}>
                <h6>Event Description</h6>
                {EventDescriptionInput}
              </div>

              <div style={{ margin: '18px 0' }}>
                <h6>Event End Date</h6>
                {EventDateInput}
              </div>
              <div style={{ margin: '18px 0' }}>
                <h6>Event Goal</h6>
                {EventGoalInput}
              </div>
              <div style={{ height: '200px' }}>
                <div className="Event-Create-file-container">
                  <input
                    className="file-input"
                    hidden
                    onChange={FilehandleChange}
                    id="EventImage"
                    name="EventImage"
                    type="file"
                    multiple="multiple"
                  />
                  <div className="Event-UploadedFileContainer">
                    {EventImage.map((item, i) => {
                      return (
                        <div key={item.name} className="Event-Images">
                          <button onClick={DeleteSelectedImages} name="deleteBTN" id={i}>
                            X
                          </button>
                          {item.type.includes('image') ? (
                            <img
                              className="Event-Images-imagebox"
                              src={URL.createObjectURL(item)}
                            />
                          ) : (
                            <>
                              <div className="Event-Uploaded-File-Container">
                                <img
                                  className="Event-Uploaded-File-clip-icon"
                                  src="https://cdn1.iconfinder.com/data/icons/web-page-and-iternet/90/Web_page_and_internet_icons-10-512.png"
                                />
                                <span className="Event-Uploaded-File-name">
                                  {item.name.substring(0, 10)}...
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      )
                    })}
                    <div className="Event-ImageAdd">
                      <button
                        id="Add-Image"
                        onClick={AddBTNClick}
                        className="Event-ImageAdd-button"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  margin: '18px 0px',
                  display: 'flex',
                  alignContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <input type="checkbox" id="plugin" />
                <h5 style={{ margin: '0' }}>Generate Plugin?</h5>
              </div>
              <CreateEventBTN />
            </div>
          </div>
        </div>
      </>
    </>
  )
}
