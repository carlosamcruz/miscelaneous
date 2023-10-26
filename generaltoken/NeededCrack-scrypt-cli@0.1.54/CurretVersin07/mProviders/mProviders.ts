//export let pvtkey: string = '';
import { DefaultProvider, sha256, toHex, PubKey, bsv, TestWallet, Tx, toByteString, ByteString, hash256 } from "scrypt-ts";

export async function broadcast(tx: any, homenetwork: any): Promise <string>
{
  //console.log(`Message received in worker: ${event.data}`);
  //const url = new URL('https://www.example.com/path?query=value');
  let poolID: number = 3; //default = 3 Bitails Big TX
  let npools: number = 4
  let TxHexBsv: string = tx;
  let urlAdress01: string = 'https://api.whatsonchain.com/v1/bsv/main/tx/raw';
  let urlAdress02: string = 'https://mapi.gorillapool.io/mapi/tx';
  let urlAdress03: string = 'https://api.bitails.io/tx/broadcast';
  let urlAdress04: string = 'https://api.bitails.io/tx/broadcast/multipart';
  let txID: string = new bsv.Transaction(tx).id;


  if(homenetwork === bsv.Networks.testnet)
  {
    urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/test/tx/raw';
    urlAdress02 = 'https://testnet-mapi.gorillapool.io/mapi/tx';
    urlAdress03 = 'https://test-api.bitails.io/tx/broadcast';
    urlAdress04 = 'https://test-api.bitails.io/tx/broadcast/multipart';
  }

  /////////////////////////////////////////////////
  //JESUS is the LORD!!!
  /////////////////////////////////////////////////

  let url: URL;

  console.log('pool id', poolID)

  let TXJson;

  let bcFinish = false
  let cycle = 0
  while(!bcFinish && cycle < npools * 2)
  {


      switch(poolID)
      {
        case 0: url = new URL(urlAdress01);
                TXJson = `{"txhex": "${TxHexBsv}" }`; 
          break;
        case 1: url = new URL(urlAdress02);
                TXJson = `{"rawTx": "${TxHexBsv}" }`;
            break;
        case 2: url = new URL(urlAdress03);
                TXJson = `{"raw": "${TxHexBsv}" }`
          break;
        default: url = new URL(urlAdress04);
                TXJson = `{"raw": "${TxHexBsv}" }`
          break;
      }
  

      try {

        console.log('URL', url)

        let resp ='';
        if(poolID === 3)
        { 
            //https://stackoverflow.com/questions/46640024/how-do-i-post-form-data-with-fetch-api
            const formData = new FormData();

            formData.append('raw', new Blob([Buffer.from(TxHexBsv, 'hex')]));
            formData.append('filename', 'raw');
 
            const response = await fetch(url, {  
              method: 'POST',
              //body: content,
              body: formData,
              //headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}             
            }).then(response=>response.text())//then(response=>response.json())
            .then(data=>{
              resp = data; 
              //console.log(data); 
            });
        }
        else
        {
            await fetch(url, {  
              method: 'POST',
              //body: content,
              body: TXJson,
              //headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'} 
              headers: {
                    'Content-Type': 'application/json',
                    'accept': 'text/plain'
              }

            }).then(response=>response.text())//then(response=>response.json())
            .then(data=>{
              resp = data; 
              //console.log(data); 
            });
        }
              
        if (resp.indexOf(txID) !== -1) {
          
          console.log('Sucess: ', resp);
          bcFinish = true
        } else {

          bcFinish = false
          console.log('Not Sucess: ', resp);
        }

      } catch (e) {
        console.error(e);
      }

      cycle ++;
      poolID ++;
      poolID = poolID % npools;

      console.log('Pool id: ', poolID)
      
    }

    if(bcFinish)
    {
      return txID
    }
    else
    {
      return ''
    }
}


interface UTXO {
  height: number;
  time: number;
  txId: string;
  outputIndex: number;
  satoshis: number;
  script: string;
}

//export async function listUnspent(addOrScriptHash: any, homenetwork: any): Promise <string>
export async function listUnspent(addOrScriptHash: any, homenetwork: any): Promise <UTXO[]>
{
  //console.log(`Message received in worker: ${event.data}`);
  //const url = new URL('https://www.example.com/path?query=value');
  let poolID: number = 0; //default = 1 Bitails Big TX
  let npools: number = 2

//https://api.whatsonchain.com/v1/bsv/main/address/12XFn6p1H831shGhbd1UobrVqXFEpCBTPp/unspent
//https://api.bitails.io/address/12XFn6p1H831shGhbd1UobrVqXFEpCBTPp/unspent

  let urlAdress01: string = 'https://api.whatsonchain.com/v1/bsv/main/address/';
  let urlAdress02: string = 'https://api.bitails.io/address/';

  if(addOrScriptHash.length === 64)
  {
    //https://api.whatsonchain.com/v1/bsv/main/script/995ea8d0f752f41cdd99bb9d54cb004709e04c7dc4088bcbbbb9ea5c390a43c3/unspent
    //Returns a response as long as the response message is less than 1MB in size.

    //https://api.bitails.io/scripthash/408d9e88bf59190a2504b0d5e8075fd456c1fe6c593a58177f6df5200e61d118/unspent

    urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/main/script/';
    urlAdress02 = 'https://api.bitails.io/scripthash/';
    //urlAdress03 = 'https://test-api.bitails.io/tx/broadcast';
    //urlAdress04 = 'https://test-api.bitails.io/tx/broadcast/multipart';
  }

  if(homenetwork === bsv.Networks.testnet)
  {
    urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/test/address/';
    urlAdress02 = 'https://test-api.bitails.io/address/';

    if(addOrScriptHash.length === 64)
    {
      //https://api.whatsonchain.com/v1/bsv/main/script/995ea8d0f752f41cdd99bb9d54cb004709e04c7dc4088bcbbbb9ea5c390a43c3/unspent
      //Returns a response as long as the response message is less than 1MB in size.
  
      //https://api.bitails.io/scripthash/408d9e88bf59190a2504b0d5e8075fd456c1fe6c593a58177f6df5200e61d118/unspent
  
      urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/test/script/';
      urlAdress02 = 'https://test-api.bitails.io/scripthash/';
      //urlAdress03 = 'https://test-api.bitails.io/tx/broadcast';
      //urlAdress04 = 'https://test-api.bitails.io/tx/broadcast/multipart';
    }  
  }

  /////////////////////////////////////////////////
  //JESUS is the LORD!!!
  /////////////////////////////////////////////////

  let url: URL;

  console.log('pool id', poolID)

  let resp ='';

  let bcFinish = false
  let cycle = 0

  let utxoScript = ''
  if(addOrScriptHash.length !== 64)
  {
    utxoScript = bsv.Script.buildPublicKeyHashOut(addOrScriptHash).toHex()
  }

  let utxos;
  while(!bcFinish && cycle < npools * 2)
  {
      switch(poolID)
      {
        case 0: url = new URL(urlAdress01 + addOrScriptHash + '/unspent');
                //TXJson = `{"txhex": "${TxHexBsv}" }`; 
          break;
        default: url = new URL(urlAdress02 + addOrScriptHash + '/unspent');
                //TXJson = `{"rawTx": "${TxHexBsv}" }`;
          break;
      }
    
      console.log('URL', url)

      try {

        console.log('URL', url)

        await fetch(url)
        .then(response => response.text()                   
        )
        .then(data => {
           //postMessage(data);
           resp = data;
           // Use the data from the response here
        })
        .catch(error => {
            //console.error(error);
            //postMessage(0);
            resp = '';
        });
             
        if (resp.indexOf('[]') !== -1  || resp.indexOf('"time":') !== -1 || resp.indexOf('"height":') !== -1 ) {
          
          console.log('Sucess: ', resp);
          bcFinish = true

          let res = JSON.parse(resp);

          if (resp.indexOf('[]') !== -1)
          {
            let res = JSON.parse('[{"height":-2,"tx_pos":-1,"tx_hash":"","value":0}]');
            utxos = res.map((item: any) => ({
              height: item.height,
              time: -2,
              txId: item.tx_hash,
              outputIndex: item.tx_pos,
              satoshis: item.value,
              script: utxoScript,
            }));

          }
          else if(poolID == 0)
          {
            //utxos = res.body.map((item: any) => ({
            utxos = res.map((item: any) => ({
              height: item.height,
              time: -1,
              txId: item.tx_hash,
              outputIndex: item.tx_pos,
              satoshis: item.value,
              script: utxoScript,
            }));
          }
          else
          {
            res = JSON.parse(resp.substring(resp.indexOf('['), resp.indexOf(']') + 1));
            utxos = res.map((item: any) => ({
            //utxos = res.body.map((item: any) => ({
              height: -1,
              time: item.time,
              txId: item.txid,
              outputIndex: item.vout,
              satoshis: item.satoshis,
              script: utxoScript,
            }));
          }
          //console.log("UTXO: ", utxos)
        } else {

          bcFinish = false
          console.log('Not Sucess: ', resp);
          let res = JSON.parse('[{"height":-2,"tx_pos":-1,"tx_hash":"","value":0}]');
          utxos = res.map((item: any) => ({
            height: item.height,
            time: -2,
            txId: item.tx_hash,
            outputIndex: item.tx_pos,
            satoshis: item.value,
            script: '',
          }));

        }

      } catch (e) {
        console.error(e);
      }

      cycle ++;
      poolID ++;
      poolID = poolID % npools;

      console.log('Pool id: ', poolID)
      
    }

    if(bcFinish)
    {
      ///return resp
      return utxos
    }
    else
    {
      //return ''
      return utxos
    }    
}

export async function getTransaction(txid: any, homenetwork: any): Promise <string>
//export async function listUnspent(addOrScriptHash: any, homenetwork: any): Promise <UTXO[]>
{
  //console.log(`Message received in worker: ${event.data}`);
  //const url = new URL('https://www.example.com/path?query=value');
  let poolID: number = 0; //default = 1 Bitails Big TX
  let npools: number = 2

//https://api.whatsonchain.com/v1/bsv/<network>/tx/<hash>/hex
  let urlAdress01: string = 'https://api.whatsonchain.com/v1/bsv/main/tx/' + txid + '/hex';
  let urlAdress02: string = 'https://api.bitails.io/download/tx/' + txid;

  if(homenetwork === bsv.Networks.testnet)
  {
    urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/test/tx/' + txid + '/hex';
    urlAdress02 = 'https://test-api.bitails.io/download/tx/' + txid;
  }

  /////////////////////////////////////////////////
  //JESUS is the LORD!!!
  /////////////////////////////////////////////////

  let url: URL;

  console.log('pool id', poolID)

  let resp ='';

  let bcFinish = false
  let cycle = 0


  while(!bcFinish && cycle < npools * 2)
  {
      switch(poolID)
      {
        case 0: url = new URL(urlAdress01);
                //TXJson = `{"txhex": "${TxHexBsv}" }`; 
          break;
        default: url = new URL(urlAdress02);
                //TXJson = `{"rawTx": "${TxHexBsv}" }`;
          break;
      }
    
      console.log('URL ABCDEF', url)

      try {

        console.log('URL', url)


        if(poolID === 1) 
        {
            await fetch(url)
            //.then(response => response.text())
            .then(response => response.arrayBuffer())
            .then(data => {
                //let dataHEX: number[] = [data.byteLength];
                const view = new DataView(data); //Para visualizar o Dado do ArrayBuffer
                let dataHEX: number[] = [data.byteLength];
                
                for (let i = 0; i < data.byteLength; i++) {
                    dataHEX[i] = view.getUint8(i);
                }
                //postMessage(dataHEX);
                //resp = convertBinaryToHexString(dataHEX);

                resp = dataHEX.map(byte => byte.toString(16).padStart(2, '0')).join('');

                
                console.log('BITAILS TX: ', resp)
                //console.log("\n\nChar:", SHA256G.ByteToStrHex(dataHEX)); //não pode ser usada neste contexto;
                // Use the data from the response here
            })
            .catch(error => {
                //console.error(error);
                //postMessage(0);
                resp = '';
            });
        
        } 
        /////////////////////////////////////////////////
        //JESUS is the LORD!!!
        /////////////////////////////////////////////////
        //Using WoC
        else {
    
            await fetch(url)
            .then(response => response.text())
            .then(data => {
               //postMessage(data);
               // Use the data from the response here
               resp = data;
            })
            .catch(error => {
                //console.error(error);
                //postMessage(0);
                resp = '';
            });
        }
        //postMessage(dataHEX);
                  
        if (resp.length > 0 ) {
          
          console.log('Sucess: ', resp);
          bcFinish = true
        }

      } catch (e) {
        console.error(e);
      }

      cycle ++;
      poolID ++;
      poolID = poolID % npools;

      console.log('Pool id: ', poolID)
      
    }

    if(bcFinish)
    {
      return resp
      //return utxos
    }
    else
    {
      return ''
      //return utxos
    }    
}