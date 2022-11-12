import React from 'react';
import Head from 'next/head';
import Button from 'react-bootstrap/Button';
import useContract from '../../services/useContract';
import { Header } from '../../components/layout/Header'
import NavLink from 'next/link';
import Web3 from 'web3'
export default function ResetAll() {
    const { contract, signerAddress } = useContract();

    async function ResetAllData() {

        await contract
            .reset_all()
            .send({
                feeLimit: 1_000_000_000,
                shouldPollResponse: false
            })
        window.location.reload();
    }

    function ResetBTN() {
        return (<>
            <Button style={{ margin: "17px 0 0px 0px", width: "100%" }} onClick={ResetAllData}>
                Reset
            </Button>
        </>)
    }


    return (
        <><>
            <Head>
                <title>Reset All Data</title>
                <meta name="description" content="Reset All Data" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header></Header>
            <div className="row" style={{ "height": "100%" }}>
                <div className='createevents col' >
                    <div style={{ background: "transparent", padding: "19px", borderRadius: "4px", height: "100%", border: "white solid" }}>
                        <ResetBTN />
                    </div>
                </div>
            </div>

        </>
        </>
    );
}
