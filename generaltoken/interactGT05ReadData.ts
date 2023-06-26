////////////////////////////////////////////////////////////////////////////////
// JESUS is the LORD of ALL
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//Read Token Data Interaction
////////////////////////////////////////////////////////////////////////////////

import { GeneralToken } from './src/contracts/generaltoken'
import { TestWallet, findSig, bsv, DefaultProvider, hash160, ByteString} from 'scrypt-ts'
import { buildPublicKeyHashScript} from 'scrypt-ts'

import * as fs from 'fs';

//Data File
const filePath = './tokendata/GenTokenlDataRead.txt';  

function hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(Math.ceil(hex.length / 2));
    
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(hex.substring(i * 2, (i * 2) + 2), 16);
    }
    
    return bytes;
  }

(async () => {

    await GeneralToken.compile()

    let provDf = new DefaultProvider({network: bsv.Networks.testnet})

    await provDf.connect()
    let tx3 = new bsv.Transaction

    //Place here the TXID of the current state of the contract
    tx3 = await provDf.getTransaction('9e9a77b887b4e28cba63592b2ece2de377261763db2c461f2395b84b7ac1d1e8');

    console.log('TXID of Reading State: ', tx3.id)

    let posNew1 = 0 // Output Index of the Contract in the Current State TX
    let instance2 = GeneralToken.fromTx(tx3, posNew1)

    console.log('Data Size: ', instance2.data.length)
    console.log('Data Details: ', instance2.data.substring(instance2.data.length - 16, instance2.data.length))
    console.log('Data Size Final: ', (instance2.data.length - 16 )/2)

    //Convert from hex to bytes
    const bytes = hexToBytes(instance2.data.substring(0, instance2.data.length - 16));

    try {
        fs.writeFileSync(filePath, bytes);
        console.log("Data written to file successfully.");
      } catch (err) {
        console.error("Error writing to file:", err);
      }
        
})()          