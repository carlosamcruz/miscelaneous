import React, { useRef, FC, useState} from 'react';

import './App.css';

import { DefaultProvider, sha256, toHex, PubKey, bsv, TestWallet, Tx, toByteString, PubKeyHash, hash160, int2ByteString, SmartContract } from "scrypt-ts";

import { OddOrEvenContract } from "./contracts/oddOrEvenContract";

import {homepvtKey, homenetwork, compState} from './Home';
import { chainInfoWoC } from './mProviders';

//const provider = new DefaultProvider({network: bsv.Networks.testnet});
const provider = new DefaultProvider({network: homenetwork});
let Alice: TestWallet
let signerExt: TestWallet

function PageSC01OddOrEvenCreate() {

  const [deployedtxid, setdeptxid] = useState("");
  const labelRef = useRef<HTMLLabelElement | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  let txlink2 = ""
 
  const gameKeyIn = useRef<any>(null);
  const value = useRef<any>(null);
  const optionP1In = useRef<any>(null);
  const oddness = useRef<any>(null);


  const deploy = async (amount: any) => {

    //if(homepvtKey.length != 64 || gameKeyIn.current.value.length != 64 || value.current.value < 1000 )
    if(homepvtKey.length != 64 )
    {
      alert('Wrong Private Key!!!')
    }
    else if(gameKeyIn.current.value.length != 64){

      alert('Game key length must be a 64 hex string!!!')
    } 
    else if(!value.current.value || value.current.value < 1000){

      alert('Minimum acceptable value for game is 1000 sats!!!')
    } 
    else if(!optionP1In.current.value || optionP1In.current.value < 0 || optionP1In.current.value > 10){

      alert('Only 0 to 10 numbers are accepted!!!')
    }
    else if(!oddness.current.value || oddness.current.value < 0 || oddness.current.value > 1){

      alert('Oddness can only be 0 or 1!!!')
    }
    else
    {
      setdeptxid("Wait!!!")

      //TODO:


    }
  };



  return (
    <div className="App">

        <header className="App-header">
          

        <h2 style={{ fontSize: '34px', paddingBottom: '20px', paddingTop: '5px'}}>

          <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
          Odd or Even Challange - Create
        
        </h2>

        <a href='https://medium.com/@cktcracker/create-a-gptoken-19a0ae6b3a32' target="_blank" rel="noopener noreferrer"
          style={{ fontSize: '14px', paddingBottom: '20px', color: 'yellow' }}>
            Instructions of Use
        </a>

        
        <div style={{ textAlign: 'center', paddingBottom: '20px' }}>
                  
                  <label style={{ fontSize: '14px', paddingBottom: '5px' }}
                    >Amount of Satoshis for The Challange:  
                  </label>     
        </div>

        <div style={{ display: 'inline-block', textAlign: 'center', paddingBottom: '20px' }}>
            <label style={{ fontSize: '14px', paddingBottom: '0px' }}  
                > 
                    <input ref={value} type="number" name="PVTKEY1" min="1" placeholder="satoshis (min 1000 sat)" />
                </label>     
        </div>

        <div>
        <div style={{ display: 'inline-block', textAlign: 'center', paddingBottom: '20px' }}>
            <label style={{ fontSize: '14px', paddingBottom: '5px' }}  
                > 
                  {/* <input ref={localPvtKey} type="hex" name="PVTKEY1" min="1" defaultValue={'PVT KEY'} placeholder="hex" />*/}
                  <input ref={gameKeyIn} type="hex" name="GameKey" min="1" placeholder="256 bits game key (hex)" />
                </label>     
            </div>
        </div>

        <div>
        <div style={{ display: 'inline-block', textAlign: 'center', paddingBottom: '20px' }}>
            <label style={{ fontSize: '14px', paddingBottom: '5px' }}  
                > 
                  {/* <input ref={localPvtKey} type="hex" name="PVTKEY1" min="1" defaultValue={'PVT KEY'} placeholder="hex" />*/}
                  <input ref={optionP1In} type="number" name="OptionNumber" min="1" placeholder="# from 0 to 10" />
                </label>     
            </div>
        </div>

        <div>
        <div style={{ display: 'inline-block', textAlign: 'center', paddingBottom: '20px' }}>
            <label style={{ fontSize: '14px', paddingBottom: '5px' }}  
                > 
                  {/* <input ref={localPvtKey} type="hex" name="PVTKEY1" min="1" defaultValue={'PVT KEY'} placeholder="hex" />*/}
                  <input ref={oddness} type="number" name="OptionNumber" min="1" placeholder="0 = even | 1 = odd" />
                </label>     
            </div>
        </div>
        

        <button className="insert" onClick={deploy}
                style={{ fontSize: '14px', paddingBottom: '2px', marginLeft: '5px'}}
        >Deploy</button>
                              
        {
          deployedtxid.length === 64?
          
         /* <button onClick={handleCopyClick}>Copy to ClipBoard</button> */

          <div>
          <div className="label-container" style={{ fontSize: '12px', paddingBottom: '0px', paddingTop: '20px' }}>
            <p className="responsive-label" style={{ fontSize: '12px' }}>TXID: {deployedtxid} </p>
          </div>
          <div className="label-container" style={{ fontSize: '12px', paddingBottom: '20px', paddingTop: '0px' }}>
            <p className="responsive-label" style={{ fontSize: '12px' }}>TX link: {' '} 
                <a href={linkUrl} target="_blank" style={{ fontSize: '12px', color: 'cyan'}}>
                {linkUrl}</a></p>
          </div>
        </div>
          
          
          :

          <div className="label-container" style={{ fontSize: '12px', paddingBottom: '20px', paddingTop: '20px' }}>
          <p className="responsive-label" style={{ fontSize: '12px' }}>{deployedtxid} </p>
        </div>
          
      }

      </header>
    </div>
  );
}

export default PageSC01OddOrEvenCreate;
