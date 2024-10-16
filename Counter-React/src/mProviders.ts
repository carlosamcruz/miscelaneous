//export let pvtkey: string = '';
import { DefaultProvider, sha256, toHex, PubKey, bsv, TestWallet, Tx, toByteString, ByteString, hash256 } from "scrypt-ts";

//////////////////////////////////////////////////////////////////////////////////////////
// Jesus is the Lord
//////////////////////////////////////////////////////////////////////////////////////////

//https://witnessonchain.com/
//export async function oracleWoC(myURL: string): Promise <exchagePRICE[]>
//export async function oracleWoC(myURL: string): Promise <any>

export async function oracleWoC(myURL: string): Promise <any>
{

  //console.log(`Message received in worker: ${event.data}`);
  //const url = new URL('https://www.example.com/path?query=value');
  //let poolID: number = 0; //default = WoC
  let npools: number = 1 // somente WoC por enquanto

  console.log('Até aqui: ', myURL)

  /////////////////////////////////////////////////
  //JESUS is the LORD!!!
  /////////////////////////////////////////////////

  let url: URL;

 
  let resp ='';

  let bcFinish = false
  let cycle = 0

  let exchangePrice;
  
  let result;
  while(!bcFinish && cycle < npools * 2)
  {

      //url = new URL('https://witnessonchain.com/v1/rates/BSV_USDC')
      url = new URL(myURL)
      
    
      console.log('URL', url)

      /*

      app.use('/', async (req, res) => {
        const response = await fetch('https://witnessonchain.com/v1/info', {
          headers: {
            'Access-Control-Allow-Origin': '*', // Replace '*' with specific origins for production
          },
        });
        const data = await response.json();
        res.json(data);

        console.log('res: ', res)
      });
      */


      try {

        console.log('URL', url)

        

        await fetch(url
           
           ,{
          /*,  headers: {
              'Access-Control-Allow-Origin': 'http://localhost:3000', // Replace '*' with specific origins for production
            },*/
            method: 'GET',
            //mode: 'no-cors'
          }
          )
        .then(response => 

        //{
          response.text()
          //postMessage(data);
          //resp = data;
          // Use the data from the response here
          //console.log('Success Text: ', JSON.stringify(response))
          //console.log('Success Text: ', JSON.stringify(response))
       //}
      
        )
       .then(data => {
           //postMessage(data);
           resp = data;
           // Use the data from the response here
           console.log('Success Data: ', resp)
        })
        .catch(error => {
            //console.error(error);
            //postMessage(0);
            resp = '';
        });
          


        
        console.log('Success: ', resp);

        //result = JSON.parse('['+ resp + ']');

        //console.log('Result Int: ', result)
        //console.log('Index Not Found: ', resp.indexOf('Not Found'))


       //{"rate":47.355999999999995,"time":1700413530,"currency":"USD"} 
        //if (resp.indexOf('[]') !== -1  || resp.indexOf('"time":') !== -1 || resp.indexOf('"height":') !== -1 ) {
       if (resp.indexOf('Not Found') === -1 ) {
          
          console.log('Success: ', resp);
          bcFinish = true

          result = JSON.parse('['+ resp + ']');

          console.log('Result Int: ', result)

        } 

      } catch (e) {
        console.error(e);
      }

      cycle ++;
      
    }

    if(bcFinish)
    {
      ///return resp
      //return exchangePrice
      return result
    }
    else
    {
      //return ''
      //return exchangePrice
      return result
    }    
}

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////
// Jesus is the Lord
//////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////
// OBS: API atualizada 
//////////////////////////////////////////////////////////////////////////////////////////

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
          
          //console.log('Success: ', resp);
          bcFinish = true
        } else {

          bcFinish = false
          console.log('Not Success: ', resp);
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

//////////////////////////////////////////////////////////////////////////////////////////
// Jesus is the Lord
//////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////
// OBS: API planejada para ser descontinuada
// **************** Atualizar 
//////////////////////////////////////////////////////////////////////////////////////////

//export async function listUnspent(addOrScriptHash: any, homenetwork: any): Promise <string>
export async function listUnspent(addOrScriptHash: any, homenetwork: any): Promise <UTXO[]>
{
  //console.log(`Message received in worker: ${event.data}`);
  //const url = new URL('https://www.example.com/path?query=value');
  let poolID: number = 0; //default = WoC
  let npools: number = 2


  if(poolID === 1000)//Não usar a nova API por enquanto.
  {
    let UTXOconf = await listUnspentConfWOC(addOrScriptHash, homenetwork)
    let UTXOunconf = await listUnspentUnconfWOC(addOrScriptHash, homenetwork)

    let size1 = 0
    size1 = UTXOconf.length

    let utxos: UTXO[] = []

    for(let i = 0; i < UTXOconf.length; i++)
    {
      if(UTXOconf[i].outputIndex > -1)
      {
        utxos.push(UTXOconf[i])
      }
    }

    for(let i = 0; i < UTXOunconf.length; i++)
    {

      if(UTXOunconf[i].outputIndex > -1)
      {
        utxos.push(UTXOunconf[i])
      }
    
    }
    console.log('Conf UTXOs: ', UTXOconf)
    console.log('Unconf UTXOs: ', UTXOunconf)

    console.log('UTXOs: ', utxos)

    return utxos
  }

//https://api.whatsonchain.com/v1/bsv/main/address/12XFn6p1H831shGhbd1UobrVqXFEpCBTPp/unspent
//https://api.bitails.io/address/12XFn6p1H831shGhbd1UobrVqXFEpCBTPp/unspent

  let urlAdress01: string = 'https://api.whatsonchain.com/v1/bsv/main/address/';
  let urlAdress02: string = 'https://api.bitails.io/address/';

  if(addOrScriptHash.length === 64)
  {

    console.log('Hash Length: ', addOrScriptHash.length)
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
          
          //console.log('Success: ', resp);
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
          //console.log('Not Success: ', resp);
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

    console.log('UTXOs: ', utxos)

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


//export async function listUnspent(addOrScriptHash: any, homenetwork: any): Promise <string>
export async function listUnspentUnconfWOC(addOrScriptHash: any, homenetwork: any): Promise <UTXO[]>
{
  //console.log(`Message received in worker: ${event.data}`);
  //const url = new URL('https://www.example.com/path?query=value');
  let poolID: number = 0; //default = WoC
  let npools: number = 1

//https://api.whatsonchain.com/v1/bsv/main/address/12XFn6p1H831shGhbd1UobrVqXFEpCBTPp/unspent
//https://api.bitails.io/address/12XFn6p1H831shGhbd1UobrVqXFEpCBTPp/unspent

  let urlAdress01: string = 'https://api.whatsonchain.com/v1/bsv/main/address/';
  //let urlAdress02: string = 'https://api.bitails.io/address/';

  if(addOrScriptHash.length === 64)
  {

    console.log('Hash Length: ', addOrScriptHash.length)
    //https://api.whatsonchain.com/v1/bsv/main/script/995ea8d0f752f41cdd99bb9d54cb004709e04c7dc4088bcbbbb9ea5c390a43c3/unspent
    //Returns a response as long as the response message is less than 1MB in size.

    //https://api.bitails.io/scripthash/408d9e88bf59190a2504b0d5e8075fd456c1fe6c593a58177f6df5200e61d118/unspent

    urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/main/script/';
    //urlAdress02 = 'https://api.bitails.io/scripthash/';
    //urlAdress03 = 'https://test-api.bitails.io/tx/broadcast';
    //urlAdress04 = 'https://test-api.bitails.io/tx/broadcast/multipart';
  }

  if(homenetwork === bsv.Networks.testnet)
  {
    urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/test/address/';
    //urlAdress02 = 'https://test-api.bitails.io/address/';

    if(addOrScriptHash.length === 64)
    {
      //https://api.whatsonchain.com/v1/bsv/main/script/995ea8d0f752f41cdd99bb9d54cb004709e04c7dc4088bcbbbb9ea5c390a43c3/unspent
      //Returns a response as long as the response message is less than 1MB in size.
  
      //https://api.bitails.io/scripthash/408d9e88bf59190a2504b0d5e8075fd456c1fe6c593a58177f6df5200e61d118/unspent
  
      urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/test/script/';
      //urlAdress02 = 'https://test-api.bitails.io/scripthash/';
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

      //url = new URL(urlAdress01 + addOrScriptHash + '/unspent');
      url = new URL(urlAdress01 + addOrScriptHash + '/unconfirmed/unspent');
      /*
      switch(poolID)
      {
        case 0: url = new URL(urlAdress01 + addOrScriptHash + '/unspent');
                //TXJson = `{"txhex": "${TxHexBsv}" }`; 
          break;
        default: url = new URL(urlAdress02 + addOrScriptHash + '/unspent');
                //TXJson = `{"rawTx": "${TxHexBsv}" }`;
          break;
      }
      */
    
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
          
          //console.log('Success: ', resp);
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
            res = JSON.parse(resp.substring(resp.indexOf('['), resp.indexOf(']') + 1)); //Nova WoC
            //utxos = res.body.map((item: any) => ({
            utxos = res.map((item: any) => ({
              height: 0,
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
          //console.log('Not Success: ', resp);
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


//export async function listUnspent(addOrScriptHash: any, homenetwork: any): Promise <string>
export async function listUnspentConfWOC(addOrScriptHash: any, homenetwork: any): Promise <UTXO[]>
{
  //console.log(`Message received in worker: ${event.data}`);
  //const url = new URL('https://www.example.com/path?query=value');
  let poolID: number = 0; //default = WoC
  let npools: number = 1

//https://api.whatsonchain.com/v1/bsv/main/address/12XFn6p1H831shGhbd1UobrVqXFEpCBTPp/unspent
//https://api.bitails.io/address/12XFn6p1H831shGhbd1UobrVqXFEpCBTPp/unspent

  let urlAdress01: string = 'https://api.whatsonchain.com/v1/bsv/main/address/';
  //let urlAdress02: string = 'https://api.bitails.io/address/';

  if(addOrScriptHash.length === 64)
  {

    console.log('Hash Length: ', addOrScriptHash.length)
    //https://api.whatsonchain.com/v1/bsv/main/script/995ea8d0f752f41cdd99bb9d54cb004709e04c7dc4088bcbbbb9ea5c390a43c3/unspent
    //Returns a response as long as the response message is less than 1MB in size.

    //https://api.bitails.io/scripthash/408d9e88bf59190a2504b0d5e8075fd456c1fe6c593a58177f6df5200e61d118/unspent

    urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/main/script/';
    //urlAdress02 = 'https://api.bitails.io/scripthash/';
    //urlAdress03 = 'https://test-api.bitails.io/tx/broadcast';
    //urlAdress04 = 'https://test-api.bitails.io/tx/broadcast/multipart';
  }

  if(homenetwork === bsv.Networks.testnet)
  {
    urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/test/address/';
    //urlAdress02 = 'https://test-api.bitails.io/address/';

    if(addOrScriptHash.length === 64)
    {
      //https://api.whatsonchain.com/v1/bsv/main/script/995ea8d0f752f41cdd99bb9d54cb004709e04c7dc4088bcbbbb9ea5c390a43c3/unspent
      //Returns a response as long as the response message is less than 1MB in size.
  
      //https://api.bitails.io/scripthash/408d9e88bf59190a2504b0d5e8075fd456c1fe6c593a58177f6df5200e61d118/unspent
  
      urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/test/script/';
      //urlAdress02 = 'https://test-api.bitails.io/scripthash/';
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

      //url = new URL(urlAdress01 + addOrScriptHash + '/unspent');
      url = new URL(urlAdress01 + addOrScriptHash + '/confirmed/unspent');
      /*
      switch(poolID)
      {
        case 0: url = new URL(urlAdress01 + addOrScriptHash + '/unspent');
                //TXJson = `{"txhex": "${TxHexBsv}" }`; 
          break;
        default: url = new URL(urlAdress02 + addOrScriptHash + '/unspent');
                //TXJson = `{"rawTx": "${TxHexBsv}" }`;
          break;
      }
      */
    
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
          
          //console.log('Success: ', resp);
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
            res = JSON.parse(resp.substring(resp.indexOf('['), resp.indexOf(']') + 1)); //Nova WoC
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
          //console.log('Not Success: ', resp);
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



//////////////////////////////////////////////////////////////////////////////////////////
// Jesus is the Lord
//////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////
// OBS: API atualizada 
//////////////////////////////////////////////////////////////////////////////////////////

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
          
          //console.log('Success: ', resp);
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

interface STXO {
  txId: string;
  inputIndex: number;
}


//////////////////////////////////////////////////////////////////////////////////////////
// Jesus is the Lord
//////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////
// OBS: API nova, sem planos para descontinuidade
//////////////////////////////////////////////////////////////////////////////////////////

//export async function getSpentOutput(txid: any, vout: number, homenetwork: any): Promise <string>
export async function getSpentOutput(txid: any, vout: number, homenetwork: any): Promise <STXO[]>
//export async function listUnspent(addOrScriptHash: any, homenetwork: any): Promise <UTXO[]>
{
  //console.log(`Message received in worker: ${event.data}`);
  //const url = new URL('https://www.example.com/path?query=value');
  let poolID: number = 0; //default = 1 Bitails Big TX
  let npools: number = 1

  let position = vout.toString()

  //let stxo: STXO [];
  let stxo;

 
  //https://api.whatsonchain.com/v1/bsv/<network>/tx/<hash>/hex
  let urlAdress01: string = 'https://api.whatsonchain.com/v1/bsv/main/tx/' + txid + '/' + position + '/spent';
  //let urlAdress02: string = 'https://api.bitails.io/download/tx/' + txid;

  if(homenetwork === bsv.Networks.testnet)
  {
    urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/test/tx/' + txid + '/' + position + '/spent';
    //urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/test/tx/' + txid + '/hex';
    //urlAdress02 = 'https://test-api.bitails.io/download/tx/' + txid;
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
        default: url = new URL(urlAdress01);
                //TXJson = `{"txhex": "${TxHexBsv}" }`; 
          break;
      }
    
      //console.log('URL ABCDEF', url)

      try {

        console.log('URL', url)

        /////////////////////////////////////////////////
        //JESUS is the LORD!!!
        /////////////////////////////////////////////////
        //Using WoC

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
            //resp = '';
            resp = error;
        });

        //postMessage(dataHEX);
                  
        if (resp.length > 0 ) {
          
          //console.log('Success: ', resp);
          bcFinish = true


          if(resp.indexOf('txid') !== -1)
          {
            let res = JSON.parse('[' + resp + ']');
            stxo = res.map((item: any) => ({
            //utxos = res.body.map((item: any) => ({
              txId: item.txid,
              inputIndex: item.vin,
            }));
          }
          else
          {
            stxo = [{
              //utxos = res.body.map((item: any) => ({
                txId: '',
                inputIndex: -1,
              }]
          }
          console.log('STXO: ', stxo)

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
      //return resp
      //return utxos
      return stxo
    }
    else
    {
      //return ''
      //return utxos
      return stxo
    }
    
}


//////////////////////////////////////////////////////////////////////////////////////////
// Jesus is the Lord
//////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////
// OBS: Usando novo modelo de API WOC, completar com Bitails
//////////////////////////////////////////////////////////////////////////////////////////

//export async function listUnspent(addOrScriptHash: any, homenetwork: any): Promise <string>
export async function scriptHistory(addOrScriptHash: any, homenetwork: any): Promise <UTXO[]>
{
  //console.log(`Message received in worker: ${event.data}`);
  //const url = new URL('https://www.example.com/path?query=value');
  let poolID: number = 0; //default = WoC
  let npools: number = 1 // somente WoC por enquanto

//https://api.whatsonchain.com/v1/bsv/main/address/12XFn6p1H831shGhbd1UobrVqXFEpCBTPp/unspent
//https://api.bitails.io/address/12XFn6p1H831shGhbd1UobrVqXFEpCBTPp/unspent

  //let urlAdress01: string = 'https://api.whatsonchain.com/v1/bsv/main/address/';
  //let urlAdress02: string = 'https://api.bitails.io/address/';

  //if(addOrScriptHash.length === 64)
  //{

    console.log('Hash Length: ', addOrScriptHash.length)
    //https://api.whatsonchain.com/v1/bsv/main/script/995ea8d0f752f41cdd99bb9d54cb004709e04c7dc4088bcbbbb9ea5c390a43c3/unspent
    //Returns a response as long as the response message is less than 1MB in size.

    //https://api.bitails.io/scripthash/408d9e88bf59190a2504b0d5e8075fd456c1fe6c593a58177f6df5200e61d118/unspent

    let urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/main/script/';
    let urlAdress02 = 'https://api.bitails.io/scripthash/';
    //urlAdress03 = 'https://test-api.bitails.io/tx/broadcast';
    //urlAdress04 = 'https://test-api.bitails.io/tx/broadcast/multipart';
  //}

  if(homenetwork === bsv.Networks.testnet)
  {
    //urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/test/address/';
    //urlAdress02 = 'https://test-api.bitails.io/address/';

    //if(addOrScriptHash.length === 64)
    //{
      //https://api.whatsonchain.com/v1/bsv/main/script/995ea8d0f752f41cdd99bb9d54cb004709e04c7dc4088bcbbbb9ea5c390a43c3/unspent
      //Returns a response as long as the response message is less than 1MB in size.
  
      //https://api.bitails.io/scripthash/408d9e88bf59190a2504b0d5e8075fd456c1fe6c593a58177f6df5200e61d118/unspent
  
      urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/test/script/';
      urlAdress02 = 'https://test-api.bitails.io/scripthash/';
      //urlAdress03 = 'https://test-api.bitails.io/tx/broadcast';
      //urlAdress04 = 'https://test-api.bitails.io/tx/broadcast/multipart';
    //}  
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
        case 0: url = new URL(urlAdress01 + addOrScriptHash + '/confirmed/history');
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
             
        //if (resp.indexOf('[]') !== -1  || resp.indexOf('"time":') !== -1 || resp.indexOf('"height":') !== -1 ) {
       if (resp.indexOf('Not Found') !== -1  || resp.indexOf('"time":') !== -1 || resp.indexOf('"height":') !== -1 ) {
          
          console.log('Success: ', resp);
          bcFinish = true

          /*
          console.log('resp Length: ', resp.length)
          console.log('index "result": ', resp.indexOf('"result":'))
          console.log('index "error": ', resp.indexOf(',"error"'))
          let index0 = resp.indexOf('"result":');
          let index1 = resp.indexOf(',"error"');
          console.log('index Index0: ', index0)
          console.log('index Index0: ', index1)

          //console.log('res: ', resp.substring(index0 + 9, resp.length - index1));
          console.log('res: ', resp.substring(0, resp.length));
          console.log('res: ', resp.substring(77 + 9, resp.length - 177));

          console.log('res: ', resp.substring(index0 + 9, resp.length - (resp.length - index1)));
          */

          


          //let res = JSON.parse(resp);
          //{"result":

          if (resp.indexOf('Not Found') !== -1)
          {
            let res = JSON.parse('[{"tx_hash":"","height":-2}]');
            utxos = res.map((item: any) => ({
              height: item.height,
              txId: item.tx_hash,
            }));

          }
          else //if(poolID == 0)
          {
            let index0 = resp.indexOf('"result":[')
            let jsonSTR = resp.substring(index0 + 9, resp.length)
            jsonSTR = jsonSTR.substring(0, jsonSTR.indexOf(']') + 1)
            console.log('res: ', resp.substring(resp.indexOf('"result":[') + 9, resp.length - (resp.length - resp.indexOf(',"error"'))));
            console.log('jsonSTR: ',jsonSTR)



            //'"result":'
            //let res = JSON.parse(resp.substring(10, resp.length - 1));
            //let res = JSON.parse(resp.substring(resp.indexOf('"result":') + 9, resp.length - (resp.length - resp.indexOf(',"error"'))));
            let res = JSON.parse(jsonSTR);

            console.log('res: ', res);
  
            //utxos = res.body.map((item: any) => ({
            utxos = res.map((item: any) => ({
              height: item.height,
              txId: item.tx_hash,
            }));
          }
          /*
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
          */
          //console.log("UTXO: ", utxos)
        } else {

          bcFinish = false
          //console.log('Not Success: ', resp);
          let res = JSON.parse('[{"tx_hash":"","height":-2}]');
          utxos = res.map((item: any) => ({
            height: item.height,
            //time: -2,
            txId: item.tx_hash,
            //outputIndex: item.tx_pos,
            //satoshis: item.value,
            //script: '',
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

//////////////////////////////////////////////////////////////////////////////////////////
// Jesus is the Lord
//////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////
// OBS: Usando novo modelo de API WOC, completar com Bitails
//////////////////////////////////////////////////////////////////////////////////////////

//export async function listUnspent(addOrScriptHash: any, homenetwork: any): Promise <string>
export async function scriptHistoryUnc(addOrScriptHash: any, homenetwork: any): Promise <UTXO[]>
{
  //console.log(`Message received in worker: ${event.data}`);
  //const url = new URL('https://www.example.com/path?query=value');
  let poolID: number = 0; //default = WoC
  let npools: number = 1 // somente WoC por enquanto

//https://api.whatsonchain.com/v1/bsv/main/address/12XFn6p1H831shGhbd1UobrVqXFEpCBTPp/unspent
//https://api.bitails.io/address/12XFn6p1H831shGhbd1UobrVqXFEpCBTPp/unspent

  //let urlAdress01: string = 'https://api.whatsonchain.com/v1/bsv/main/address/';
  //let urlAdress02: string = 'https://api.bitails.io/address/';

  //if(addOrScriptHash.length === 64)
  //{

    console.log('Hash Length: ', addOrScriptHash.length)
    //https://api.whatsonchain.com/v1/bsv/main/script/995ea8d0f752f41cdd99bb9d54cb004709e04c7dc4088bcbbbb9ea5c390a43c3/unspent
    //Returns a response as long as the response message is less than 1MB in size.

    //https://api.bitails.io/scripthash/408d9e88bf59190a2504b0d5e8075fd456c1fe6c593a58177f6df5200e61d118/unspent

    let urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/main/script/';
    let urlAdress02 = 'https://api.bitails.io/scripthash/';
    //urlAdress03 = 'https://test-api.bitails.io/tx/broadcast';
    //urlAdress04 = 'https://test-api.bitails.io/tx/broadcast/multipart';
  //}

  if(homenetwork === bsv.Networks.testnet)
  {
    //urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/test/address/';
    //urlAdress02 = 'https://test-api.bitails.io/address/';

    //if(addOrScriptHash.length === 64)
    //{
      //https://api.whatsonchain.com/v1/bsv/main/script/995ea8d0f752f41cdd99bb9d54cb004709e04c7dc4088bcbbbb9ea5c390a43c3/unspent
      //Returns a response as long as the response message is less than 1MB in size.
  
      //https://api.bitails.io/scripthash/408d9e88bf59190a2504b0d5e8075fd456c1fe6c593a58177f6df5200e61d118/unspent
  
      urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/test/script/';
      urlAdress02 = 'https://test-api.bitails.io/scripthash/';
      //urlAdress03 = 'https://test-api.bitails.io/tx/broadcast';
      //urlAdress04 = 'https://test-api.bitails.io/tx/broadcast/multipart';
    //}  
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
        case 0: url = new URL(urlAdress01 + addOrScriptHash + '/unconfirmed/history');
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
          
        console.log('Success: ', resp);
       //if (resp.indexOf('[]') !== -1  || resp.indexOf('"time":') !== -1 || resp.indexOf('"height":') !== -1 ) {
        if (resp.indexOf('[]') === -1 ) {
       //if (resp.indexOf('Not Found') !== -1  || resp.indexOf('"time":') !== -1 || resp.indexOf('"height":') !== -1 ) {
          
          console.log('Success: ', resp);
          bcFinish = true


          if (resp.indexOf('Not Found') !== -1)
          {
            let res = JSON.parse('[{"tx_hash":"","height":-2}]');
            utxos = res.map((item: any) => ({
              height: item.height,
              txId: item.tx_hash,
            }));

          }
          else //if(poolID == 0)
          {
            let index0 = resp.indexOf('"result":[')
            let jsonSTR = resp.substring(index0 + 9, resp.length)
            jsonSTR = jsonSTR.substring(0, jsonSTR.indexOf(']') + 1)
            console.log('res: ', resp.substring(resp.indexOf('"result":[') + 9, resp.length - (resp.length - resp.indexOf(',"error"'))));
            console.log('jsonSTR: ',jsonSTR)



            //'"result":'
            //let res = JSON.parse(resp.substring(10, resp.length - 1));
            //let res = JSON.parse(resp.substring(resp.indexOf('"result":') + 9, resp.length - (resp.length - resp.indexOf(',"error"'))));
            let res = JSON.parse(jsonSTR);

            console.log('res: ', res);
  
            //utxos = res.body.map((item: any) => ({
            utxos = res.map((item: any) => ({
              height: item.height,
              txId: item.tx_hash,
            }));
          }

        } else {

          bcFinish = false
          //console.log('Not Success: ', resp);
          let res = JSON.parse('[{"tx_hash":"","height":-2}]');
          utxos = res.map((item: any) => ({
            height: item.height,
            //time: -2,
            txId: item.tx_hash,
            //outputIndex: item.tx_pos,
            //satoshis: item.value,
            //script: '',
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

//////////////////////////////////////////////////////////////////////////////////////////
// Jesus is the Lord
//////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////
// OBS: WoC Only
// https://api.whatsonchain.com/v1/bsv/main/exchangerate
//////////////////////////////////////////////////////////////////////////////////////////

interface exchagePRICE {
  rate: number,
  time: number,
  currecy: string,
}

//export async function listUnspent(addOrScriptHash: any, homenetwork: any): Promise <string>
export async function exchangeRate(): Promise <exchagePRICE[]>
{
  //console.log(`Message received in worker: ${event.data}`);
  //const url = new URL('https://www.example.com/path?query=value');
  //let poolID: number = 0; //default = WoC
  let npools: number = 1 // somente WoC por enquanto


  /////////////////////////////////////////////////
  //JESUS is the LORD!!!
  /////////////////////////////////////////////////

  let url: URL;

 
  let resp ='';

  let bcFinish = false
  let cycle = 0

  let exchangePrice;
  while(!bcFinish && cycle < npools * 2)
  {

      url = new URL('https://api.whatsonchain.com/v1/bsv/main/exchangerate')
    
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
             

       //{"rate":47.355999999999995,"time":1700413530,"currency":"USD"} 
        //if (resp.indexOf('[]') !== -1  || resp.indexOf('"time":') !== -1 || resp.indexOf('"height":') !== -1 ) {
       if (resp.indexOf('Not Found') !== -1  || resp.indexOf('"time":') !== -1 || resp.indexOf('"rate":') !== -1 ) {
          
          console.log('Success: ', resp);
          bcFinish = true


          if (resp.indexOf('Not Found') !== -1)
          {
            //let res = JSON.parse('[{"tx_hash":"","height":-2}]');
            let res = JSON.parse('[{"rate":0,"time":0,"currency":"USD"}]');
            exchangePrice = res.map((item: any) => ({
              rate: item.rate,
              time: item.time,
              currecy: item.currency,
            }));

          }
          else //if(poolID == 0)
          {
            let res = JSON.parse('['+ resp + ']');

            console.log('res: ', res);
  
            //utxos = res.body.map((item: any) => ({
              exchangePrice = res.map((item: any) => ({
                rate: item.rate,
                time: item.time,
                currecy: item.currency,  
            }));
          }

        } 

      } catch (e) {
        console.error(e);
      }

      cycle ++;
      
    }

    if(bcFinish)
    {
      ///return resp
      return exchangePrice
    }
    else
    {
      //return ''
      return exchangePrice
    }    
}