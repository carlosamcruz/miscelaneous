import React, { useRef } from 'react';
import logo from './logo.svg';
import './App.css';

import { DefaultProvider, sha256, toHex, PubKey, bsv, TestWallet, Tx, toByteString } from "scrypt-ts";
import { Helloworld } from "./contracts/helloworld";


const provider = new DefaultProvider({network: bsv.Networks.testnet});
let Alice: TestWallet
let signerExt: TestWallet
const privateKey = bsv.PrivateKey.fromHex("3c2ffdbb0a57c0cff0deacba15a92bf1d218dda9a9c7c668dd0640a6204b6394", bsv.Networks.testnet)   

function App() {

  const deploy = async (amount: any) => {

    Alice = new TestWallet(privateKey, provider)

    try {
      const signer = Alice
      const message = toByteString('hello world', true)
      const instance = new Helloworld(sha256(message))
      
      await instance.connect(signer);
          
      const deployTx = await instance.deploy(100)
      //console.log('Helloworld contract deployed: ', deployTx.id)
      //alert('deployed: ' + deployTx.id)

      let tx = new bsv.Transaction(deployTx);

      //tx.fromHex(deployTx)

      console.log('Helloworld contract deployed: ', tx.id)
      alert('deployed: ' + tx.id)


    } catch (e) {
      console.error('deploy HelloWorld failes', e)
      alert('deploy HelloWorld failes')
    }
  };


  const interact = async (amount: any) => {

    Alice = new TestWallet(privateKey, provider)

    try {

      const signer = Alice
      const message = toByteString('hello world', true)
      let tx = new bsv.Transaction
      tx = await provider.getTransaction(txid.current.value)
  
      console.log('Current State TXID: ', tx.id)

      const instance = Helloworld.fromTx(tx, 0) 
      await instance.connect(signer)
  
      const { tx: callTx } = await instance.methods.unlock(message)
      console.log('Helloworld contract `unlock` called: ', callTx.id)
      alert('unlock: ' + callTx.id)
  
    } catch (e) {
      console.error('deploy HelloWorld failes', e)
      alert('deploy HelloWorld failes')
    }
  };

  const txid = useRef<any>(null);

  return (
    <div className="App">
        <header className="App-header">

        <h2 style={{ fontSize: '34px', paddingBottom: '5px', paddingTop: '5px'}}>Hello World - sCrypt & React</h2>

        <div style={{ textAlign: 'center' }}>
                  
                  <label style={{ fontSize: '14px', paddingBottom: '5px' }}
                    >Press Deploy to Create the Contract:  
                  </label>     
        </div>
        <button className="insert" onClick={deploy}
                style={{ fontSize: '14px', paddingBottom: '2px', marginLeft: '5px'}}
        >Deploy</button>
                              

        {/* <img src={logo} className="App-logo" alt="logo" /> 
        
        <a
          className="App-link"
          href="https://www.youtube.com/watch?v=MnfzAx-A1oA&list=PLe_C0QmVAyivD40DXYtUVSAFmx7ntGjJZ"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn sCrypt
        </a>
        */}

        <div>

          <div style={{ textAlign: 'center' }}>
                
                <label style={{ fontSize: '14px', paddingBottom: '2px' }}
                  >Inform the Current TXID and press Unlock to use the Contract:  
                </label>     
          </div>

          <div style={{ display: 'inline-block', textAlign: 'center' }}>
            <label style={{ fontSize: '14px', paddingBottom: '5px' }}  
                > 
                    <input ref={txid} type="hex" name="PVTKEY1" min="1" defaultValue={'TXID'} placeholder="hex" />
                </label>     
            </div>
            <div style={{ display: 'inline-block', textAlign: 'center' }}>
                
                <button className="insert" onClick={interact}
                    style={{ fontSize: '14px', paddingBottom: '2px', marginLeft: '20px'}}
                >Unlock</button>

            </div>
        </div>                      
      </header>
    </div>
  );
}

export default App;