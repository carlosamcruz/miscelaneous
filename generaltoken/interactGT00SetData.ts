////////////////////////////////////////////////////////////////////////////////
// JESUS is the LORD of ALL
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//Seting Token Data Interaction
////////////////////////////////////////////////////////////////////////////////
import { GeneralToken } from './src/contracts/generaltoken'
import { TestWallet, findSig, bsv, DefaultProvider, hash160, ByteString, toHex, sha256} from 'scrypt-ts'
import { buildPublicKeyHashScript} from 'scrypt-ts'

import * as fs from 'fs';

//Data File
const filePath = './tokendata/GenTokenlData.txt';  

function stringToHex(str: string): string {
    let hexString = '';
    for (let i = 0; i < str.length; i++) {
      const hex = str.charCodeAt(i).toString(16);
      hexString += hex.length === 2 ? hex : '0' + hex;
    }
    return hexString;
  }

function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

////////////////////////////////////////////////////////////////////////////////
// JESUS is the LORD of ALL
////////////////////////////////////////////////////////////////////////////////

(async () => {

    let dataToChain: ByteString = '00'

    // Alternatively, you can read the file synchronously
    try {
        const data = fs.readFileSync(filePath);
        dataToChain = bytesToHex(data)
    } catch (err) {
        console.error('Error reading file:', err);
    }
 
    await GeneralToken.compile()

    //const privateKey2 = bsv.PrivateKey.fromHex("ccbf6b06cb35e102f42ecfaa5de55ab6cd35431b95f6ee4fd5199ad90943c5cf", bsv.Networks.testnet)
    const privateKey2 = bsv.PrivateKey.fromHex('79342a4c317817a80a298fe116147a74e4e90912a4f321e588a4db67204e29b0', bsv.Networks.testnet)
   
    // Prepare signer.
    // See https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#prepare-a-signer-and-provider
    const Alice = new TestWallet(privateKey2, new DefaultProvider({network: bsv.Networks.testnet}))

    let provDf = new DefaultProvider({network: bsv.Networks.testnet})

    await provDf.connect()
    let tx3 = new bsv.Transaction

    tx3 = await provDf.getTransaction('e0bf91804091bacd57a39c3fc7fadb8b01d6baf7d378503f3902e4503017d5cb')

    let finish = false

    let newData = dataToChain;

    ////////////////////////////////////////////////////////////////////////////////
    // JESUS is the LORD of ALL
    ////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////
    //External Patch:
    ////////////////////////////////////////////////////////////////////

    let dataSize = (newData.length/2).toString(16)

    while(dataSize.length < 8)
        dataSize = '0' + dataSize

    let newDataInfo = '000000' + '00' + '00000000'
    let dataInfo1 = '000000'
    let dataInfo2 = '00'
    let dataInfo3 = dataSize

    newDataInfo = dataInfo1 + dataInfo2 + dataSize
    //(newData.length + newDataInfo.length)
    //newData = newData + newDataInfo

    //0xae = 174
    if( ((((newData.length + newDataInfo.length) / 2) + 3) & 0xff) % 0xae === 0 ||
        (((((newData.length + newDataInfo.length) / 2) + 4) & 0xff) % 0xae === 0  
            && ((newData.length + newDataInfo.length) / 2) > 0xff  && ((newData.length + newDataInfo.length) / 2) <= 0xffff ) ||
        (((((newData.length + newDataInfo.length) / 2) + 6) & 0xff) % 0xae === 0 
            && ((newData.length + newDataInfo.length) / 2) > 0xffff && ((newData.length + newDataInfo.length) / 2) < 0xffffffff)
    )
    {
        //newDataInfo = '0000'
        newDataInfo = dataInfo1 + '02' + dataSize
        newData = newData + '0000' + newDataInfo
        console.log('175 ')

    }
    //0xaf = 175
    else 
    if( ((((newData.length + newDataInfo.length) / 2) + 3) & 0xff) % 0xaf === 0 ||
        (((((newData.length + newDataInfo.length) / 2) + 4) & 0xff) % 0xaf === 0  
            && ((newData.length + newDataInfo.length) / 2) > 0xff  && ((newData.length + newDataInfo.length) / 2) <= 0xffff)||
        (((((newData.length + newDataInfo.length) / 2) + 6) & 0xff) % 0xaf === 0 
            && ((newData.length + newDataInfo.length) / 2) > 0xffff && ((newData.length + newDataInfo.length) / 2) < 0xffffffff)
    )
    {   
        newDataInfo = dataInfo1 + '01' + dataSize
        newData = newData + '00' + newDataInfo
        console.log('174')
    }
    else
    {
        newData = newData + newDataInfo
    }

    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    console.log('TXID Current State: ', tx3.id)

    let posNew1 = 0 // Output Index of the Contract in the Current State TX
    let instance2 = GeneralToken.fromTx(tx3, posNew1)
    //Inform to the system the right output index of the contract and its sequence
    tx3.pvTxIdx(tx3.id, posNew1, sha256(tx3.outputs[posNew1].script.toHex()))

    let pbkeyAlice = bsv.PublicKey.fromPrivateKey(privateKey2)

    let pvtkey = privateKey2;
    let pbkey = pbkeyAlice;

    //https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#method-with-signatures

    const balance = instance2.balance
    const nextInstance = instance2.next()
    //finish = true

    if(!finish)
    {
        nextInstance.data = newData;
    }
    
    await instance2.connect(Alice)

    instance2.bindTxBuilder('setupToken', async function () {

            const changeAddress = bsv.Address.fromPrivateKey(pvtkey)
       
            const unsignedTx: bsv.Transaction = new bsv.Transaction()
            .addInputFromPrevTx(tx3, posNew1)

            if (finish) 
            {    
                unsignedTx.addOutput(new bsv.Transaction.Output({
                    script: buildPublicKeyHashScript(hash160(instance2.alice)),
                    satoshis: balance
                }))
                .change(changeAddress)
            }
            else
            {
                unsignedTx.addOutput(new bsv.Transaction.Output({
                    script: nextInstance.lockingScript,
                    satoshis: balance,
                }))
                .change(changeAddress)
            }            

            return Promise.resolve({
                tx: unsignedTx,
                atInputIndex: 0,
                nexts: [
                ]
            });              
    });
   
    const { tx: callTx } = await instance2.methods.setupToken(

        // the first argument `sig` is replaced by a callback function which will return the needed signature
        (sigResps) => findSig(sigResps, pbkey),
        finish,
        newData,
    )

    console.log('TXID New State: ', callTx.id)     
        
})()          

