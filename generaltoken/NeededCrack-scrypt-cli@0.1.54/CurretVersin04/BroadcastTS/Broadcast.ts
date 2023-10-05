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


  let bcFinish = false
  let cycle = 0
  while(!bcFinish && cycle < npools * 2)
  {
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
