import React, { useState, useEffect } from 'react';
import NavLink from 'next/link';

declare let window: any;

export function Nav(): JSX.Element {
    const [acc, setAcc] = useState('');
    const [accfull, setAccFull] = useState('');
    const [Balance, setBalance] = useState('');

    const [isSigned, setSigned] = useState(false);
    async function fetchInfo() {
        if (window.tronLink == null) {
            window.document.getElementById("withoutSign").style.display = "none";
            window.document.getElementById("withSign").style.display = "none";
            window.document.getElementById("installTronLink").style.display = "";
            return;
        }
        if (window.tronWeb.defaultAddress.base58 != null && window.localStorage.getItem("TronLink") == "true") {
            let Balance = await window.tronWeb.trx.getBalance(window.tronWeb.defaultAddress.base58);

            let subbing = 10;

            if (window.innerWidth > 500) {
                subbing = 20;

            }
            
            setAccFull(window.tronWeb.defaultAddress.base58);
            setAcc(window.tronWeb.defaultAddress.base58.toString().substring(0, subbing) + "...");

            setBalance(Balance / 1000000 + " TRX");
            setSigned(true);
            try {

                window.document.getElementById("withoutSign").style.display = "none";
                window.document.getElementById("withSign").style.display = "";
            } catch (error) {

            }
        } else {
            setSigned(false);
            window.document.getElementById("withoutSign").style.display = "";
            window.document.getElementById("withSign").style.display = "none";
        }
    }
    useEffect(() => {
        setInterval(async () => {
            await fetchInfo();
        }, 1000)

    }, []);
    function NavButtons(): JSX.Element {

        return (<>
            <li>
                <NavLink href="/donation" id="donationbtnNav">
                    Donation
                </NavLink>
            </li>

            <li>
                <NavLink href="/CreateEvents">
                    Create Events
                </NavLink>
            </li>

        </>)
    }


    async function onClickDisConnectTronLink() {
        window.localStorage.setItem("TronLink", "")
        window.localStorage.setItem("Type", "")
        window.location.href = "/"
    }

    return (
        <nav className="main-nav">
            <ul>
                <NavButtons />

                <li className='Nav walletstatus'>
                    <div id='withoutSign' className="wallets">
                        <NavLink href="/login?[/]">
                            <div className="wallet">
                                <button type="button" className="btn btn-secondary  loginBTN" aria-disabled="false">
                                    Login
                                </button>
                            </div>
                        </NavLink>
                    </div>
                    <div id='installTronLink' style={{ display: "none" }} className="wallets">

                        <div className="wallet">
                            <button type="button" onClick={() => { window.open("https://chrome.google.com/webstore/detail/TronLink/nkbihfbeogaeaoehlefnkodbefgpgknn", "_blank") }} className="btn btn-secondary installBTN" aria-disabled="false">
                                TronLink
                            </button>
                        </div>
                    </div>

                    <div id="withSign" className="wallets" style={{ display: "none" }}>

                        <div className="wallet" style={{ height: 48 }}>
                            <div className="align-items-center d-flex h-100 wallet__wrapper" >
                                <div className="wallet__info" >
                                    <a href={`/user/${accfull}`} className="align-items-center d-flex text-primary wallet_address" >
                                        <div className="wallet__address" style={{ fontSize: 14, letterSpacing: "0.5px" }}>
                                            {acc}
                                        </div>
                                    </a>
                                    <div className='align-items-center d-flex text-primary' style={{ fontSize: '12px', letterSpacing: '0.6px' }}>
                                        {Balance}
                                    </div>
                                </div>
                                <button type="button" onClick={onClickDisConnectTronLink} className="btn btn-logout" style={{ padding: 0 }}>
                                    <span className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" height={32} width={32} style={{ fill: "rgb(255 0 0)" }}>
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M18.4753 18.2903H19.295H20.1146V21.5162V23.9355H15.1966L15.1967 27L13.0492 26.2799L8.11633 24.662C7.4459 24.433 7 24.2782 7 24.2782V7H8.63938C8.66196 7 8.68378 7.00459 8.70558 7.00919C8.72248 7.01275 8.73936 7.0163 8.75659 7.01772C8.76929 7.01605 8.78125 7.01267 8.79315 7.00931C8.80968 7.00464 8.8261 7 8.84424 7H17.6556H20.1146V11.8387H19.295H18.4753L18.4754 8.61267L17.6556 8.61281H13.8376H11.918L15.1966 9.41936V22.3226H18.4753V21.5162V18.2903ZM23.153 11.2686L27 15.0644C27 15.0644 26.7522 15.3194 26.4318 15.6346L23.153 18.8605L21.7541 20.2257L21.7539 15.8709H17.6556V15.0645V14.2581H21.7539L21.7541 9.90301L23.153 11.2686Z"
                                            />
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </div>

                    </div>
                </li>
            </ul>
        </nav>
    )
}
