//export let pvtkey: string = '';
import { ByteString, bsv, sha256, toHex} from "scrypt-ts";
import { ContentType } from './OrdinalsContentType';


////////////////////////////////////////////////////////////////////
//Jesus is the Lord!!!
////////////////////////////////////////////////////////////////////

export interface myUTXOs {
  height: number;
  time: number;
  txId: string;
  outputIndex: number;
  satoshis: number;
  script: string;
  scriptHash: string;
  type: number //0 = P2PK // 1 = P2PKH // ... //10 - 100 (P2PKH tokens)// 101 - 200 Smart Contracts // 103 = GPToken
  spent: number
}

//Não funcionou para o proposito desejado
export interface myUTXOsB {
  height: number;
  time: number;
  txId: Uint8Array;
  outputIndex: number;
  satoshis: number;
  script: Uint8Array;
  scriptHash: Uint8Array;
  type: number //0 = P2PK // 1 = P2PKH // ... //10 - 100 (P2PKH tokens)// 101 - 200 Smart Contracts // 103 = GPToken
  spent: number
}

//Não funcionou para o proposito desejado
export interface myUTXOsB2 {
  height: number;
  time: number;
  txId: number[];
  outputIndex: number;
  satoshis: number;
  script: number[];
  scriptHash: number[];
  type: number //0 = P2PK // 1 = P2PKH // ... //10 - 100 (P2PKH tokens)// 101 - 200 Smart Contracts // 103 = GPToken
  spent: number
}

export const myData = {
  data: ''
};


export const myUTXOData = {
  utxoData: ''
}

export function setMyData(newData: any) {
  myData.data = newData;
}

export function setMyUTXOsData(newData: any) {
  myUTXOData.utxoData = newData;
}

export const convertBinaryToHexString = (binaryString: any) => {
  const bytes = [];
  for (let i = 0; i < binaryString.length; i++) {
    const byte = binaryString.charCodeAt(i).toString(16).padStart(2, '0');
    bytes.push(byte);
  }
  return bytes.join('');
};

export const sleep = async (miliSeconds: number) => {
  return new Promise((resolve) => {
      setTimeout(() => {
          resolve({})
          console.log("Waited for: ", miliSeconds, " ms")
      }, miliSeconds)
  })
}

////////////////////////////////////////////////////////////////////
//Jesus is the Lord!!!
////////////////////////////////////////////////////////////////////

//Transforma uma string qualquer em uma string hexadecimal
export function utxoDataUpdata(rawTX: string, txId: string, finalUTXOs: any, token: number ): string {

  //let txToUtxos = new bsv.Transaction
  //txToUtxos.fromString(rawTX)
  
  let MyUtxosCurrent: myUTXOs[] = []

  if(myUTXOData.utxoData.length > 2 )
  {        
    //console.log('my UTXOs Json String 233 (Aqui): ', myUTXOData.utxoData)

    //Coloca os Dados Atuais
    let res = JSON.parse(myUTXOData.utxoData);
    MyUtxosCurrent = res.map((item: any) => ({
      height: item.height,
      time: item.time,
      txId: item.txId,
      outputIndex: item.outputIndex,
      satoshis: item.satoshis,
      script: item.script,
      scriptHash: item.scriptHash,
      type: item.type,
      spent: item.spent
    }));

  }

  //Acrescenta os Novos UTXOs do Endereço
  //console.log('Limiar para Acrescenta os Novos UTXOs do Endereço')
  if(finalUTXOs != null)
  {
    //console.log('Entrou para Acrescenta os Novos UTXOs do Endereço')
    for(let i = 0; i < finalUTXOs.length; i++)
    {
      
        for(let j = 0; j < MyUtxosCurrent.length; j++)
        {
          //if(MyUtxosCurrent[j] === MyUtxos[i])
          if(  MyUtxosCurrent[j].outputIndex === finalUTXOs[i].outputIndex
            && MyUtxosCurrent[j].txId === finalUTXOs[i].txId)
          {
            break;
          }
          if(j === (MyUtxosCurrent.length - 1))
          {
            //console.log('Entrou aqui!!!')

            //Verificação para auxiliar UTXO list a incluir scripts que não fora classificados na criação
            let scriptType = 2;
            switch (finalUTXOs[i].script.length) {
              case 50:
                {
                  if(finalUTXOs[i].script.substring(0,6) === '76a914' && finalUTXOs[i].script.substring(46,50) === '88ac')
                    scriptType = 2
                  else
                  scriptType = -1
                  break;
                }
              case 134:
                {
                  if(finalUTXOs[i].script.substring(0,2) === '41' && finalUTXOs[i].script.substring(132,134) === 'ac')
                    scriptType = 0
                  else
                    scriptType = -1
                  break;
                }
              case 70:
                {
                  if(finalUTXOs[i].script.substring(0,2) === '21' && finalUTXOs[i].script.substring(68,70) === 'ac')
                    scriptType = 1
                  else
                    scriptType = -1
                  break;
                }  
              default:
                {
                  if(finalUTXOs[i].script.indexOf('47656e6572616c20507572706f736520546f6b656e') != -1)
                  {
                    scriptType = 103;

                  }
                  else
                  {
                    scriptType = -1;
                  }
                }
                
            }   
            
            let thisUtxo: myUTXOs = {
              height: finalUTXOs[i].height,
              time: finalUTXOs[i].time,
              txId: finalUTXOs[i].txId,
              outputIndex: finalUTXOs[i].outputIndex,
              satoshis: finalUTXOs[i].satoshis,
              script: finalUTXOs[i].script,
              scriptHash: hexToLittleEndian(sha256(finalUTXOs[i].script)),
              type: scriptType,
              spent: 0
            }
            MyUtxosCurrent.push(thisUtxo);
  
            break;
          }
        }

        if(MyUtxosCurrent.length === 0)
        {
          //console.log('Entrou aqui!!!')

          //Verificação para auxiliar UTXO list a incluir scripts que não fora classificados na criação
          let scriptType = 2;
          switch (finalUTXOs[i].script.length) {
            case 50:
              {
                if(finalUTXOs[i].script.substring(0,6) === '76a914' && finalUTXOs[i].script.substring(46,50) === '88ac')
                  scriptType = 2
                else
                scriptType = -1
                break;
              }
            case 134:
              {
                if(finalUTXOs[i].script.substring(0,2) === '41' && finalUTXOs[i].script.substring(132,134) === 'ac')
                  scriptType = 0
                else
                  scriptType = -1
                break;
              }
            case 70:
              {
                if(finalUTXOs[i].script.substring(0,2) === '21' && finalUTXOs[i].script.substring(68,70) === 'ac')
                  scriptType = 1
                else
                  scriptType = -1
                break;
              }  
            default:
              scriptType = -1;
          }   
          
          let thisUtxo: myUTXOs = {
            height: finalUTXOs[i].height,
            time: finalUTXOs[i].time,
            txId: finalUTXOs[i].txId,
            outputIndex: finalUTXOs[i].outputIndex,
            satoshis: finalUTXOs[i].satoshis,
            script: finalUTXOs[i].script,
            scriptHash: hexToLittleEndian(sha256(finalUTXOs[i].script)),
            type: scriptType,
            spent: 0
          }
          MyUtxosCurrent.push(thisUtxo);

          //break;
        }

    }
  }

  if(rawTX != '')
  {
    let txToUtxos = new bsv.Transaction
    txToUtxos.fromString(rawTX)
  
    //Remove os Utxos Gastos nos Inputs da Transação Atual
    for(let i = 0; i < txToUtxos.inputs.length; i++  )
    {
        MyUtxosCurrent = MyUtxosCurrent.filter(
          (utxo) => !(utxo.txId === toHex(txToUtxos.inputs[i].prevTxId)
                   && utxo.outputIndex === (txToUtxos.inputs[i].outputIndex))
          );
    }
  
    //Acrescenta os Utxos dos Outputs da Transação Atual
    for(let i = 0; i < txToUtxos.outputs.length; i++  )
    {
        let scriptType = 2;
  
        /*
        if(txToUtxos.outputs[i].script.toHex().length > 200)
        {
          ///scriptType = 103;
          scriptType = token;
        }
        */
  
        //Verifica se o Script é de um dos scripts padrões
        //Caso contrário, adota to tipo de token indicado
        switch (txToUtxos.outputs[i].script.toHex().length) {
          case 50:
            {
              if( txToUtxos.outputs[i].script.toHex().substring(0,6) === '76a914'
                  && txToUtxos.outputs[i].script.toHex().substring(46,50) === '88ac')
                scriptType = 2
              else
                scriptType = token;
              break;
            }
          case 134:
            {
              if(    txToUtxos.outputs[i].script.toHex().substring(0,2) === '41' 
                  && txToUtxos.outputs[i].script.toHex().substring(132,134) === 'ac')
                scriptType = 0
              else
                scriptType = token;
              break;
            }
          case 70:
            {
              if( txToUtxos.outputs[i].script.toHex().substring(0,2) === '21' 
                  && txToUtxos.outputs[i].script.toHex().substring(68,70) === 'ac')
                scriptType = 1
              else
                scriptType = token;
              break;
            }  
          default:
            scriptType = token;
        }     
  
        let thisUtxo: myUTXOs = {
          height: 0,
          time: -1,
          txId: txId,
          outputIndex: i,
          satoshis: txToUtxos.outputs[i].satoshis,
          script: txToUtxos.outputs[i].script.toHex(),
          scriptHash: hexToLittleEndian(sha256(txToUtxos.outputs[i].script.toHex())),
          type: scriptType,
          spent: 0
        }
        MyUtxosCurrent.push(thisUtxo);
    }
  }

  let myJsonStrUTXOs2 = JSON.stringify(MyUtxosCurrent)
  //console.log('my UTXOs Json String 222: ', myJsonStrUTXOs2)

  setMyUTXOsData(myJsonStrUTXOs2)

  return myJsonStrUTXOs2;
}


////////////////////////////////////////////////////////////////////
//Jesus is the Lord!!!
////////////////////////////////////////////////////////////////////

//Transforma uma string qualquer em uma string hexadecimal
export function stringToHex(str: string): string {
  let hexString = '';
  for (let i = 0; i < str.length; i++) {
    const hex = str.charCodeAt(i).toString(16);
    hexString += hex.length === 2 ? hex : '0' + hex;
  }
  return hexString;
}

////////////////////////////////////////////////////////////////////
//Jesus is the Lord!!!
////////////////////////////////////////////////////////////////////

//Converte uma string de array de bytes em Hexastring

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

////////////////////////////////////////////////////////////////////
//Jesus is the Lord!!!
////////////////////////////////////////////////////////////////////

//Converte uma string hexadecimal em um array de bytes

export function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(Math.ceil(hex.length / 2));
  
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, (i * 2) + 2), 16);
  }
  
  return bytes;
}

//Não funcionou para o proposito desejado
export function hexToBytesNumber(hex: string): number[] {
  //const bytes = new Uint8Array(Math.ceil(hex.length / 2));

  const bytes : number[] = [Math.ceil(hex.length / 2)]
  
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, (i * 2) + 2), 16);
  }
  return bytes;
}

export function littleEndian(hexString: string): string {
  // Split the hex string into pairs of two characters
  const hexPairs = hexString.match(/.{1,2}/g);

  // Reverse the array of hex pairs and join them back into a string
  const reversedHex = hexPairs ? hexPairs.reverse().join("") : "";

  return reversedHex;
}

export function hexToLittleEndian(hexString: string): string {
  // Remove the '0x' prefix if present
  //console.log('Hex str: ', hexString)


  let result = ""

  for(let i = (hexString.length/2) - 1; i >= 0; i --)
  {
      result += hexString.substring(2*i, 2*i + 2) 
  }

  return result;
}


////////////////////////////////////////////////////////////////////
//Jesus is the Lord!!!
////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////
//Retorna PAD de formatação do dado a ser enviado para a blockchain
/////////////////////////////////////////////////////////////////////
export function dataInfoFormat(hexStringData: string, fileName: string): string []
{
      //////////////////////////////////////////////////////////
      //Data Input
      //////////////////////////////////////////////////////////
      let dataToChain: ByteString = '00'

      let newData = dataToChain;

      //vem de fora
      newData = hexStringData; //vem de fora

      let dataSize = (newData.length/2).toString(16)

      while(dataSize.length < 8)
          dataSize = '0' + dataSize

      let newDataInfo = '000000' + '00' + '00000000'
      //Default Text File
      //let dataInfo1 = '000000'
      let dataInfo1 = '000001'

      let typeOfContent = ''

      //if(selectedFile !== null)
      if(fileName !== '')
      {
        //switch(selectedFile.name.split('.')[1])
        switch(fileName.split('.')[1])
        {
          case 'txt': 
            dataInfo1 = '000001';
            typeOfContent = ContentType.TEXT_UTF8
            break;
          case 'jfif': 
            dataInfo1 = '000002';
            typeOfContent = ContentType.JPG
            break;
          case 'jpg': 
            dataInfo1 = '000003';
            typeOfContent = ContentType.JPG
            break;          
          case 'jpeg': 
            dataInfo1 = '000004';
            typeOfContent = ContentType.JPEG
            break;              
          case 'm4a': 
            dataInfo1 = '000005';
            typeOfContent = ContentType.MP4
            break;              
          case 'mov': 
            dataInfo1 = '000006';
            typeOfContent = ContentType.VIDEO_MP4
            break;              
          case 'mp3': 
            dataInfo1 = '000007';
            typeOfContent = ContentType.AUDIO_MPEG
            break;              
          case 'mp4': 
            dataInfo1 = '000008';
            typeOfContent = ContentType.MP4
            break;  
          case 'mpeg': 
            dataInfo1 = '000009';
            typeOfContent = ContentType.MPEG
            break;  
          case 'mpg': 
            dataInfo1 = '00000a';
            break;          
          case 'pdf': 
            dataInfo1 = '00000b';
            typeOfContent = ContentType.PDF
            break;                      
          case 'png': 
            dataInfo1 = '00000c';
            typeOfContent = ContentType.PNG
            break;   
          case 'ppt': 
            dataInfo1 = '00000d';
            typeOfContent = ContentType.TEXT
            break;   
          case 'pptx': 
            dataInfo1 = '00000e';
            typeOfContent = ContentType.TEXT
            break;   
          case 'rar': 
            dataInfo1 = '00000f';
            typeOfContent = ContentType.MODEL_GLTF_BINARY
            break;         
          case 'rtf': 
            dataInfo1 = '000010';
            typeOfContent = ContentType.MODEL_GLTF_BINARY
            break;                
          case 'tif': 
            dataInfo1 = '000011';
            typeOfContent = ContentType.MODEL_GLTF_BINARY
            break;            
          case 'tiff': 
            dataInfo1 = '000012';
            typeOfContent = ContentType.MODEL_GLTF_BINARY
            break;            
          case 'wav': 
            dataInfo1 = '000013';
            typeOfContent = ContentType.WAV
            break;                
          case 'wma': 
            dataInfo1 = '000014';
            typeOfContent = ContentType.AUDIO_WAV
            break;            
          case 'wmv': 
            dataInfo1 = '000015';
            typeOfContent = ContentType.WEBM
            break;            
          case 'xls': 
            dataInfo1 = '000016';
            typeOfContent = ContentType.MODEL_GLTF_BINARY
            break;            
          case 'xlsx': 
            dataInfo1 = '000017';
            typeOfContent = ContentType.MODEL_GLTF_BINARY
            break;            
          case 'zip': 
            dataInfo1 = '000018';
            typeOfContent = ContentType.MODEL_GLTF_BINARY
            break;              
          case 'webp': 
            dataInfo1 = '000019';
            typeOfContent = ContentType.WEBP
            break;              
          case 'html': 
            dataInfo1 = '00001a';
            typeOfContent = ContentType.TEXT_HTML_UTF8
            break;          
          case 'csv': 
            dataInfo1 = '00001b';
            typeOfContent = ContentType.TEXT_UTF8
            break;
          case 'bmp': 
            dataInfo1 = '00001c';
            typeOfContent = ContentType.IMAGE_JPEG
            break;                        
          default:
            typeOfContent = ContentType.MODEL_GLTF_BINARY
            dataInfo1 = '000000';
        }
      }

      let dataInfo2 = '00'
      let dataInfo3 = dataSize

      newDataInfo = dataInfo1 + dataInfo2 + dataSize

      //newData = newData + newDataInfo

      ////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////

      return [typeOfContent, dataInfo1, dataInfo2, dataInfo3]
}
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////
//Jesus is the Lord!!!
////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////
//Retorna DADO + PAD de formatação a ser enviado para a blockchain 
//  versão para smart contracts em sCrypt, para resolver:
//  0xae = 174 e 0xaf = 175 
/////////////////////////////////////////////////////////////////////
export function dataFormatScryptSC(hexStringData: string, fileName: string): string
{
      //////////////////////////////////////////////////////////
      //Data Input
      //////////////////////////////////////////////////////////
      let dataToChain: ByteString = '00'

      let newData = dataToChain;

      //vem de fora
      newData = hexStringData; //vem de fora

      let dataSize = (newData.length/2).toString(16)

      while(dataSize.length < 8)
          dataSize = '0' + dataSize

      let newDataInfo = '000000' + '00' + '00000000'


      let dataFormatInfo = dataInfoFormat(hexStringData, fileName)

      //Default Text File
      //let dataInfo1 = '000000'
      //let dataInfo1 = '000001'

      //let typeOfContent = ''
      let typeOfContent = dataFormatInfo[0]
      //let dataInfo1 = '000001'
      let dataInfo1 = dataFormatInfo[1]
      //let dataInfo2 = '00'
      let dataInfo2 = dataFormatInfo[2]
      //let dataInfo3 = dataSize
      let dataInfo3 = dataFormatInfo[3]

      //newDataInfo = dataInfo1 + dataInfo2 + dataSize
      newDataInfo = dataInfo1 + dataInfo2 + dataInfo3

      ////////////////////////////////////////////////////////////////////
      //Jesus is the Lord!!!
      ////////////////////////////////////////////////////////////////////

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
          //console.log('175 ')

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
          //console.log('174')
      }
      else
      {
          newData = newData + newDataInfo
      }

      ////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////

      return newData
}
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////
//Jesus is the Lord!!!
////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////
//Retorna tipo de arquivo a partir do dado recuperado da Blockchain
/////////////////////////////////////////////////////////////////////
export function fileTypeFromData(fileType: string): any []
{
  let defaultData = false;
  let fType = ''

  switch(fileType)
  {
      case '000001': 
        fType = ('txt')
        break;
      case '000002': 
        fType = ('jfif')
        //fType = ('jpg')
        break;
      case '000003': 
        fType = ('jpg')
        break;          
      case '000004': 
        //dataInfo1 = '000004';
        fType = ('jpeg')
        break;              
      case '000005': 
        //dataInfo1 = '000005';
        fType = ('m4a')
        break;              
      case '000006': 
        //dataInfo1 = '000006';
        fType = ('mov')
        break;              
      case '000007': 
        //dataInfo1 = '000007';
        fType = ('mp3')
        break;              
      case '000008': 
        //dataInfo1 = '000008';
        fType = ('mp4')
        break;  
      case '000009': 
        //dataInfo1 = '000009';
        fType = ('mpeg')
        break;  
      case '00000a': 
        //dataInfo1 = '00000a';
        fType = ('mpg')
        break;          
      case '00000b': 
        //dataInfo1 = '00000b';
        fType = ('pdf')
        break;                      
      case '00000c': 
        //dataInfo1 = '00000c';
        fType = ('png')
        break;   
      case '00000d': 
        //dataInfo1 = '00000d';
        fType = ('ppt')
        break;   
      case '00000e': 
        //dataInfo1 = '00000e';
        fType = ('pptx')
        break;   
      case '00000f': 
        //dataInfo1 = '00000f';
        fType = ('rar')
        break;         
      case '000010': 
        //dataInfo1 = '000010';
        fType = ('rtf')
        break;                
      case '000011': 
        //dataInfo1 = '000011';
        fType = ('tif')
        break;            
      case '000012': 
        //dataInfo1 = '000012';
        fType = ('tiff')
        break;            
      case '000013': 
        //dataInfo1 = '000013';
        fType = ('wav')
        break;                
      case '000014': 
        //dataInfo1 = '000014';
        fType = ('wma')
        break;            
      case '000015': 
        //dataInfo1 = '000015';
        fType = ('wmv')
        break;            
      case '000016': 
        //dataInfo1 = '000016';
        fType = ('xls')
        break;            
      case '000017': 
        //dataInfo1 = '000017';
        fType = ('xlsx')
        break;            
      case '000018': 
        //dataInfo1 = '000018';
        fType = ('zip')
        break;            
      case '000019': 
        //dataInfo1 = '000017';
        fType = ('webp')
        break;            
      case '00001a': 
        //dataInfo1 = '000018';
        fType = ('html')
        break;            
      case '00001b': 
        //dataInfo1 = '000018';
        fType = ('csv')
        break;            
      case '00001c': 
        //dataInfo1 = '000018';
        fType = ('bmp')
        break;       
      case '000000': 
        //dataInfo1 = '000018';
        fType = ('bin')
        break;  
      default:
        defaultData = true;
        fType = ('txt');
  }

  return [fType, defaultData]

}
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////
//Jesus is the Lord!!!
////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////
//UTXO script size: o script deve estar completo
// Return the Little endian size of a complete Bitcoin Script
////////////////////////////////////////////////////////////////////

export function scriptUxtoSize(scriptHex: string): string
{
        ////////////////////////////////////////////
      // Ajuste do tamanho do Script e indicação do byte de tamanho em bytes
      // Só pode ser indicado a partir desta posição para não dar conflito
      // se o script ultrapassar os bytes indicados para os dados
      ////////////////////////////////////////////

      let Out1Script = scriptHex

      let out1size = "00";
      let out1ScriptType = "006a"; // OP_Return
      let out1DataSizeType = "4c"; //only one byte
      let byteSizeout1size = "";
      let out1DataSize = "00"; //only one byte

      out1size = (Out1Script.length / 2).toString(16);


      //console.log('Output Size 0: ', out1size)

          
      if (out1size.length % 2 == 1) {
        out1size = "0" + out1size;
      }
          
      if (Out1Script.length / 2 >= 0x01 && Out1Script.length / 2 <= 0xfc) 
      {
        // out1size = out1size;
        byteSizeout1size = "";
        out1size = byteSizeout1size + hexToLittleEndian(out1size);
        //console.log('Output Size 1: ', out1size)

      } 
      else if (Out1Script.length / 2 >= 0x00fd && Out1Script.length / 2 <= 0xffff) 
      {
         byteSizeout1size = "fd";
         while (out1size.length < 4) 
         {
           out1size = "0" + out1size;
         }
         out1size = byteSizeout1size + hexToLittleEndian(out1size);
         //console.log('Output Size 2: ', out1size)
      } 
      //else if (Out1Script.length / 2 >= 0x00010000 && Out1Script.length / 2 <= 0x000182b8)
      else if (Out1Script.length / 2 >= 0x00010000 && Out1Script.length / 2 <= 0xffffffff) 
      {
         byteSizeout1size = "fe";
         while (out1size.length < 8) 
         {
            out1size = "0" + out1size;
         }
          out1size = byteSizeout1size + hexToLittleEndian(out1size);
          //console.log('Output Size 2: ', out1size)
      }
      

      return out1size
}

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////
// Pubsh data size: o dado deve estar completo
// Return the Little endian size of a complete Bitcoin Script
////////////////////////////////////////////////////////////////////

export function pushDataSize(scriptHex: string): string
{
      ////////////////////////////////////////////
      // Ajuste do tamanho do Script e indicação do byte de tamanho em bytes
      // Só pode ser indicado a partir desta posição para não dar conflito
      // se o script ultrapassar os bytes indicados para os dados
      ////////////////////////////////////////////

      let Out1Script = scriptHex

      let out1size = "00";
      let out1ScriptType = "006a"; // OP_Return
      let out1DataSizeType = "4c"; //only one byte
      let byteSizeout1size = "";
      let out1DataSize = "00"; //only one byte

      out1size = (Out1Script.length / 2).toString(16);


      //console.log('Output Size 0: ', out1size)

          
      if (out1size.length % 2 == 1) {
        out1size = "0" + out1size;
      }
          
      if (Out1Script.length / 2 >= 0x01 && Out1Script.length / 2 <= 0x4b) 
      {
        // out1size = out1size;
        byteSizeout1size = "";
        out1size = byteSizeout1size + hexToLittleEndian(out1size);
        //console.log('Output Size 1: ', out1size)

      }
      else if (Out1Script.length / 2 >= 0x4c && Out1Script.length / 2 <= 0xff) 
      {
         byteSizeout1size = "4c";
         while (out1size.length < 2) 
         {
           out1size = "0" + out1size;
         }
         out1size = byteSizeout1size + hexToLittleEndian(out1size);
         //console.log('Output Size 2: ', out1size)
      }
      
      else if (Out1Script.length / 2 >= 0x0100 && Out1Script.length / 2 <= 0xffff) 
      {
         byteSizeout1size = "4d";
         while (out1size.length < 4) 
         {
           out1size = "0" + out1size;
         }
         out1size = byteSizeout1size + hexToLittleEndian(out1size);
         //console.log('Output Size 2: ', out1size)
      } 
      //else if (Out1Script.length / 2 >= 0x00010000 && Out1Script.length / 2 <= 0x000182b8)
      else if (Out1Script.length / 2 >= 0x00010000 && Out1Script.length / 2 <= 0xffffffff) 
      {
         byteSizeout1size = "4e";
         while (out1size.length < 8) 
         {
            out1size = "0" + out1size;
         }
          out1size = byteSizeout1size + hexToLittleEndian(out1size);
          //console.log('Output Size 2: ', out1size)
      }
      

      return out1size
}

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////
//Jesus is the Lord!!!
////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////
//  Contrato de Erro: 
/////////////////////////////////////////////////////////////////////

export function erroSC(): string
{
  return '0100000001cf5d8f50dc3df9a9394691ad2fc69c40840493b59f02d416fb9f37e6d545f4a6000000006b483045022100da47b6d54d8606d87e9fddf08daa4e1e7c1e95a4bfd81863bf86c3f03370515402205c3c933bb7c634a0f9ffcf5694b3b6b9f62a2e3f89140962408bb2b7201104c6412103c0e0bf0bbcdc53be9542359aeb1dde7c6289743b7b3460c12e2d57a478c6e489ffffffff020100000000000000100061020101517a75610201015179877702000000000000001976a9148c51ed42f050b1bde974fb6649e25b782d168f4088ac00000000'
}

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////
//Jesus is the Lord!!!
////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////
//  Retorna o uma transação contendo o template atual do contrato: 
//
//  mPlaceTokens.ts
//
//  A necessidade do deploy ocorre, pois o sCrypt não deixa
//  simplesmente assinar a transação e entregar esta de forma
//  mais simples, sem executar o broadcast. Por isso, é mais
//  razoável usar um template desta forma: 
//
//  O template foi produzido a parte de um deploy na TestNet,
//  mas pode ser utilizado tanto na TestNet quanto na MainNet,
//  o usuário precisa necessariamente mudar a chave publica antes
//  de criar a ordem na rede, pois senão o pagamento vai a o
//  endereço onde o template foi criado.  
/////////////////////////////////////////////////////////////////////
export function mPlaceTokenTemplate(): string
{
      return '0100000001956c91e705473451674d618506d47620d3289943d29debe496970da0a7c3cef5000000006b483045022100a5a52c8725290e936d47f6d85c53ac609d4a77e41c7fb5f92e45cd8adfb9339d02203365cc023adb714641d9e5b6e7d32ecd795c50e676efef301940dd69ad3a5c84412103c0e0bf0bbcdc53be9542359aeb1dde7c6289743b7b3460c12e2d57a478c6e489ffffffff020100000000000000fddc4b0176018801a901ac2097dfd76851bf465e8f715593b217714858bbe9570ff3bd5e33840a34e20ff0262102ba79df5f8ae7604a9830f03c7933028186aede0675a16f025dc4f8be8eec0382201008ce7480da41702918d1ec8e6849ba32b4d65b1e40dc669c31a1e6306b266c00000000000000000000000000000000000000000000002103c0e0bf0bbcdc53be9542359aeb1dde7c6289743b7b3460c12e2d57a478c6e48961007901187a7501177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a0001177a7501167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a0001167a7501157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a0001157a7501147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a0001147a7501137a01137a01137a01137a01137a01137a01137a01137a01137a01137a01137a01137a01137a01137a01137a01137a01137a01137a01137a0001137a7501127a01127a01127a01127a01127a01127a01127a01127a01127a01127a01127a01127a01127a01127a01127a01127a01127a01127a0001127a7501117a01117a01117a01117a01117a01117a01117a01117a01117a01117a01117a01117a01117a01117a01117a01117a01117a0001117a75607a607a607a607a607a607a607a607a607a607a607a607a607a607a607a607a7561011e7900876301217961007901687f776100005279517f75007f77007901fd87635379537f75517f7761007901007e81517a7561537a75527a527a5379535479937f75537f77527a75517a67007901fe87635379557f75517f7761007901007e81517a7561537a75527a527a5379555479937f75557f77527a75517a67007901ff87635379597f75517f7761007901007e81517a7561537a75527a527a5379595479937f75597f77527a75517a675379517f75007f7761007901007e81517a7561537a75527a527a5379515479937f75517f77527a75517a6868685179517a75517a75517a75517a7561517a7561007961007982775179517951947f755179549451947f77007981527951799454945194517a75517a75517a75517a7561517951797f75537a75527a527a0000537953797f77610079537a75527a527a00527a75517a7561615179517951937f7551797f775179768b537a75527a527a75010051798791517a75610079916361005379005179557951937f7555797f77815579768b577a75567a567a567a567a567a567a750079014c9f630079547a75537a537a537a527956795579937f7556797f77527a75517a670079014c9c635279567951937f7556797f7761007901007e81517a7561547a75537a537a537a55795193567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014d9c635279567952937f7556797f7761007901007e81517a7561547a75537a537a537a55795293567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014e9c635279567954937f7556797f7761007901007e81517a7561547a75537a537a537a55795493567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670069686868685579547993567a75557a557a557a557a557a5579755179517a75517a75517a75517a7561011c7a75011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a61005379005179557951937f7555797f77815579768b577a75567a567a567a567a567a567a750079014c9f630079547a75537a537a537a527956795579937f7556797f77527a75517a670079014c9c635279567951937f7556797f7761007901007e81517a7561547a75537a537a537a55795193567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014d9c635279567952937f7556797f7761007901007e81517a7561547a75537a537a537a55795293567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014e9c635279567954937f7556797f7761007901007e81517a7561547a75537a537a537a55795493567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670069686868685579547993567a75557a557a557a557a557a5579755179517a75517a75517a75517a7561011b7a75011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a61005379005179557951937f7555797f77815579768b577a75567a567a567a567a567a567a750079014c9f630079547a75537a537a537a527956795579937f7556797f77527a75517a670079014c9c635279567951937f7556797f7761007901007e81517a7561547a75537a537a537a55795193567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014d9c635279567952937f7556797f7761007901007e81517a7561547a75537a537a537a55795293567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014e9c635279567954937f7556797f7761007901007e81517a7561547a75537a537a537a55795493567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670069686868685579547993567a75557a557a557a557a557a5579755179517a75517a75517a75517a7561011a7a7501197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a61005379005179557951937f7555797f77815579768b577a75567a567a567a567a567a567a750079014c9f630079547a75537a537a537a527956795579937f7556797f77527a75517a670079014c9c635279567951937f7556797f7761007901007e81517a7561547a75537a537a537a55795193567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014d9c635279567952937f7556797f7761007901007e81517a7561547a75537a537a537a55795293567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014e9c635279567954937f7556797f7761007901007e81517a7561547a75537a537a537a55795493567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670069686868685579547993567a75557a557a557a557a557a5579755179517a75517a75517a75517a756101197a7501187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a61005379005179557951937f7555797f77815579768b577a75567a567a567a567a567a567a750079014c9f630079547a75537a537a537a527956795579937f7556797f77527a75517a670079014c9c635279567951937f7556797f7761007901007e81517a7561547a75537a537a537a55795193567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014d9c635279567952937f7556797f7761007901007e81517a7561547a75537a537a537a55795293567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014e9c635279567954937f7556797f7761007901007e81517a7561547a75537a537a537a55795493567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670069686868685579547993567a75557a557a557a557a557a5579755179517a75517a75517a75517a756101187a7501177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a615279527951937f7552797f775279768b547a75537a537a537a75010051798791517a756101177a7501167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a6161005379005179557951937f7555797f77815579768b577a75567a567a567a567a567a567a750079014c9f630079547a75537a537a537a527956795579937f7556797f77527a75517a670079014c9c635279567951937f7556797f7761007901007e81517a7561547a75537a537a537a55795193567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014d9c635279567952937f7556797f7761007901007e81517a7561547a75537a537a537a55795293567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014e9c635279567954937f7556797f7761007901007e81517a7561547a75537a537a537a55795493567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670069686868685579547993567a75557a557a557a557a557a5579755179517a75517a75517a75517a7561816101167a7501157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a61005379005179557951937f7555797f77815579768b577a75567a567a567a567a567a567a750079014c9f630079547a75537a537a537a527956795579937f7556797f77527a75517a670079014c9c635279567951937f7556797f7761007901007e81517a7561547a75537a537a537a55795193567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014d9c635279567952937f7556797f7761007901007e81517a7561547a75537a537a537a55795293567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014e9c635279567954937f7556797f7761007901007e81517a7561547a75537a537a537a55795493567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670069686868685579547993567a75557a557a557a557a557a5579755179517a75517a75517a75517a756101157a7501147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a680126790141615179012179012179210ac407f0e4bd44bfc207355a778b046225a7068fc59ee7eda43ad905aadbffc800206c266b30e6a1319c66dc401e5bd6b432ba49688eecd118297041da8074ce08100123795679615679aa0079610079517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e01007e81517a75615779567956795679567961537956795479577995939521414136d08c5ed2bf3ba048afe6dcaebafeffffffffffffffffffffffffffffff00517951796151795179970079009f63007952799367007968517a75517a75517a7561527a75517a517951795296a0630079527994527a75517a6853798277527982775379012080517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e01205279947f7754537993527993013051797e527e54797e58797e527e53797e52797e57797e0079517a75517a75517a75517a75517a75517a75517a75517a75517a75517a75517a75517a75517a756100795779ac517a75517a75517a75517a75517a75517a75517a75517a75517a7561517a75517a756169012679610079610079547f75517a7561517961007901247f75547f77517a7561527961007901447f7501247f77517a7561537961007982775179517958947f7551790128947f77517a75517a7561547961007961007982775179517954947f75517958947f77517a75517a756161007901007e81517a7561517a756155796100796100798277517951790128947f755179012c947f77517a75517a756161007901007e81517a7561517a7561567961007982775179517953947f75517954947f77517a75517a7561577961007901687f7501447f77517a756101207f75007f77587961007901687f7501447f77517a756101207f7781517951795b7961007901687f776100005279517f75007f77007901fd87635379537f75517f7761007901007e81517a7561537a75527a527a5379535479937f75537f77527a75517a67007901fe87635379557f75517f7761007901007e81517a7561537a75527a527a5379555479937f75557f77527a75517a67007901ff87635379597f75517f7761007901007e81517a7561537a75527a527a5379595479937f75597f77527a75517a675379517f75007f7761007901007e81517a7561537a75527a527a5379515479937f75517f77527a75517a6868685179517a75517a75517a75517a7561517a75615c79610079610079827751795179012c947f7551790134947f77517a75517a756161007901007e81517a7561517a7561537953795379537960796079607960796079607960795a795a795a795a79011c795c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a7561011f7a011f7a011f7a011f7a011f7a011f7a011f7a011f7a011f7a011f7a011f7a011f7a75757575757575757575757501137a01137a01137a01137a01137a01137a01137a01137a012579012579597a597a7575577a577a577a577a577a577a012779011c79ac690116790087916900011c79a9610124790123797e01147e51797e0124797e0122797e517a75615b7961007958805279610079827700517902fd009f63517951615179517951938000795179827751947f75007f77517a75517a75517a7561517a75675179030000019f6301fd527952615179517951938000795179827751947f75007f77517a75517a75517a75617e517a756751790500000000019f6301fe527954615179517951938000795179827751947f75007f77517a75517a75517a75617e517a75675179090000000000000000019f6301ff527958615179517951938000795179827751947f75007f77517a75517a75517a75617e517a7568686868007953797e517a75517a75517a75617e517a75517a7561517a75587900a063007961597900a0635879610125790124797e01147e51797e0125797e0123797e517a75615a7961007958805279610079827700517902fd009f63517951615179517951938000795179827751947f75007f77517a75517a75517a7561517a75675179030000019f6301fd527952615179517951938000795179827751947f75007f77517a75517a75517a75617e517a756751790500000000019f6301fe527954615179517951938000795179827751947f75007f77517a75517a75517a75617e517a75675179090000000000000000019f6301ff527958615179517951938000795179827751947f75007f77517a75517a75517a75617e517a7568686868007953797e517a75517a75517a75617e517a75517a7561670068617e517a75007975680111795179aa87777777777777777777777777777777777777777777777777777777777777777777777777777777777767011e7951876301217961007901687f776100005279517f75007f77007901fd87635379537f75517f7761007901007e81517a7561537a75527a527a5379535479937f75537f77527a75517a67007901fe87635379557f75517f7761007901007e81517a7561537a75527a527a5379555479937f75557f77527a75517a67007901ff87635379597f75517f7761007901007e81517a7561537a75527a527a5379595479937f75597f77527a75517a675379517f75007f7761007901007e81517a7561537a75527a527a5379515479937f75517f77527a75517a6868685179517a75517a75517a75517a7561517a7561007961007982775179517951947f755179549451947f77007981527951799454945194517a75517a75517a75517a7561517951797f75537a75527a527a0000537953797f77610079537a75527a527a00527a75517a7561615179517951937f7551797f775179768b537a75527a527a75010051798791517a75610079916361005379005179557951937f7555797f77815579768b577a75567a567a567a567a567a567a750079014c9f630079547a75537a537a537a527956795579937f7556797f77527a75517a670079014c9c635279567951937f7556797f7761007901007e81517a7561547a75537a537a537a55795193567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014d9c635279567952937f7556797f7761007901007e81517a7561547a75537a537a537a55795293567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014e9c635279567954937f7556797f7761007901007e81517a7561547a75537a537a537a55795493567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670069686868685579547993567a75557a557a557a557a557a5579755179517a75517a75517a75517a7561011c7a75011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a61005379005179557951937f7555797f77815579768b577a75567a567a567a567a567a567a750079014c9f630079547a75537a537a537a527956795579937f7556797f77527a75517a670079014c9c635279567951937f7556797f7761007901007e81517a7561547a75537a537a537a55795193567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014d9c635279567952937f7556797f7761007901007e81517a7561547a75537a537a537a55795293567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014e9c635279567954937f7556797f7761007901007e81517a7561547a75537a537a537a55795493567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670069686868685579547993567a75557a557a557a557a557a5579755179517a75517a75517a75517a7561011b7a75011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a61005379005179557951937f7555797f77815579768b577a75567a567a567a567a567a567a750079014c9f630079547a75537a537a537a527956795579937f7556797f77527a75517a670079014c9c635279567951937f7556797f7761007901007e81517a7561547a75537a537a537a55795193567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014d9c635279567952937f7556797f7761007901007e81517a7561547a75537a537a537a55795293567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014e9c635279567954937f7556797f7761007901007e81517a7561547a75537a537a537a55795493567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670069686868685579547993567a75557a557a557a557a557a5579755179517a75517a75517a75517a7561011a7a7501197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a61005379005179557951937f7555797f77815579768b577a75567a567a567a567a567a567a750079014c9f630079547a75537a537a537a527956795579937f7556797f77527a75517a670079014c9c635279567951937f7556797f7761007901007e81517a7561547a75537a537a537a55795193567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014d9c635279567952937f7556797f7761007901007e81517a7561547a75537a537a537a55795293567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014e9c635279567954937f7556797f7761007901007e81517a7561547a75537a537a537a55795493567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670069686868685579547993567a75557a557a557a557a557a5579755179517a75517a75517a75517a756101197a7501187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a61005379005179557951937f7555797f77815579768b577a75567a567a567a567a567a567a750079014c9f630079547a75537a537a537a527956795579937f7556797f77527a75517a670079014c9c635279567951937f7556797f7761007901007e81517a7561547a75537a537a537a55795193567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014d9c635279567952937f7556797f7761007901007e81517a7561547a75537a537a537a55795293567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014e9c635279567954937f7556797f7761007901007e81517a7561547a75537a537a537a55795493567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670069686868685579547993567a75557a557a557a557a557a5579755179517a75517a75517a75517a756101187a7501177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a615279527951937f7552797f775279768b547a75537a537a537a75010051798791517a756101177a7501167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a6161005379005179557951937f7555797f77815579768b577a75567a567a567a567a567a567a750079014c9f630079547a75537a537a537a527956795579937f7556797f77527a75517a670079014c9c635279567951937f7556797f7761007901007e81517a7561547a75537a537a537a55795193567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014d9c635279567952937f7556797f7761007901007e81517a7561547a75537a537a537a55795293567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014e9c635279567954937f7556797f7761007901007e81517a7561547a75537a537a537a55795493567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670069686868685579547993567a75557a557a557a557a557a5579755179517a75517a75517a75517a7561816101167a7501157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a61005379005179557951937f7555797f77815579768b577a75567a567a567a567a567a567a750079014c9f630079547a75537a537a537a527956795579937f7556797f77527a75517a670079014c9c635279567951937f7556797f7761007901007e81517a7561547a75537a537a537a55795193567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014d9c635279567952937f7556797f7761007901007e81517a7561547a75537a537a537a55795293567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014e9c635279567954937f7556797f7761007901007e81517a7561547a75537a537a537a55795493567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670069686868685579547993567a75557a557a557a557a557a5579755179517a75517a75517a75517a756101157a7501147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a680126790141615179012179012179210ac407f0e4bd44bfc207355a778b046225a7068fc59ee7eda43ad905aadbffc800206c266b30e6a1319c66dc401e5bd6b432ba49688eecd118297041da8074ce08100123795679615679aa0079610079517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e01007e81517a75615779567956795679567961537956795479577995939521414136d08c5ed2bf3ba048afe6dcaebafeffffffffffffffffffffffffffffff00517951796151795179970079009f63007952799367007968517a75517a75517a7561527a75517a517951795296a0630079527994527a75517a6853798277527982775379012080517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e01205279947f7754537993527993013051797e527e54797e58797e527e53797e52797e57797e0079517a75517a75517a75517a75517a75517a75517a75517a75517a75517a75517a75517a75517a756100795779ac517a75517a75517a75517a75517a75517a75517a75517a75517a7561517a75517a756169012679610079610079547f75517a7561517961007901247f75547f77517a7561527961007901447f7501247f77517a7561537961007982775179517958947f7551790128947f77517a75517a7561547961007961007982775179517954947f75517958947f77517a75517a756161007901007e81517a7561517a756155796100796100798277517951790128947f755179012c947f77517a75517a756161007901007e81517a7561517a7561567961007982775179517953947f75517954947f77517a75517a7561577961007901687f7501447f77517a756101207f75007f77587961007901687f7501447f77517a756101207f7781517951795b7961007901687f776100005279517f75007f77007901fd87635379537f75517f7761007901007e81517a7561537a75527a527a5379535479937f75537f77527a75517a67007901fe87635379557f75517f7761007901007e81517a7561537a75527a527a5379555479937f75557f77527a75517a67007901ff87635379597f75517f7761007901007e81517a7561537a75527a527a5379595479937f75597f77527a75517a675379517f75007f7761007901007e81517a7561537a75527a527a5379515479937f75517f77527a75517a6868685179517a75517a75517a75517a7561517a75615c79610079610079827751795179012c947f7551790134947f77517a75517a756161007901007e81517a7561517a7561537953795379537960796079607960796079607960795a795a795a795a79011c795c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a7561011f7a011f7a011f7a011f7a011f7a011f7a011f7a011f7a011f7a011f7a011f7a011f7a75757575757575757575757501137a01137a01137a01137a01137a01137a01137a01137a012579012579597a597a7575577a577a577a577a577a577a01167964012d796751686301167963012d796700689167006869012d7963012e79011c7a75011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a012f79011c79ac6967012f79011c79ac696800012e7901187a7501177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a012e7963012d7901177a7501167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a012c7901167a7501157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a012b79011c7a75011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a012a79011b7a75011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a012979011a7a7501197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01287901197a7501187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a5a79616100610079635167010068517a7561011e796100798277005179014c9f63517951615179517951938000795179827751947f75007f77517a75517a75517a7561517a756751790200019f63014c527951615179517951938000795179827751947f75007f77517a75517a75517a75617e517a75675179030000019f63014d527952615179517951938000795179827751947f75007f77517a75517a75517a75617e517a756751790500000000019f63014e527954615179517951938000795179827751947f75007f77517a75517a75517a75617e517a7567006968686868007953797e517a75517a75517a75617e011d796100798277005179014c9f63517951615179517951938000795179827751947f75007f77517a75517a75517a7561517a756751790200019f63014c527951615179517951938000795179827751947f75007f77517a75517a75517a75617e517a75675179030000019f63014d527952615179517951938000795179827751947f75007f77517a75517a75517a75617e517a756751790500000000019f63014e527954615179517951938000795179827751947f75007f77517a75517a75517a75617e517a7567006968686868007953797e517a75517a75517a75617e011c796100798277005179014c9f63517951615179517951938000795179827751947f75007f77517a75517a75517a7561517a756751790200019f63014c527951615179517951938000795179827751947f75007f77517a75517a75517a75617e517a75675179030000019f63014d527952615179517951938000795179827751947f75007f77517a75517a75517a75617e517a756751790500000000019f63014e527954615179517951938000795179827751947f75007f77517a75517a75517a75617e517a7567006968686868007953797e517a75517a75517a75617e011b796100798277005179014c9f63517951615179517951938000795179827751947f75007f77517a75517a75517a7561517a756751790200019f63014c527951615179517951938000795179827751947f75007f77517a75517a75517a75617e517a75675179030000019f63014d527952615179517951938000795179827751947f75007f77517a75517a75517a75617e517a756751790500000000019f63014e527954615179517951938000795179827751947f75007f77517a75517a75517a75617e517a7567006968686868007953797e517a75517a75517a75617e011a796100798277005179014c9f63517951615179517951938000795179827751947f75007f77517a75517a75517a7561517a756751790200019f63014c527951615179517951938000795179827751947f75007f77517a75517a75517a75617e517a75675179030000019f63014d527952615179517951938000795179827751947f75007f77517a75517a75517a75617e517a756751790500000000019f63014e527954615179517951938000795179827751947f75007f77517a75517a75517a75617e517a7567006968686868007953797e517a75517a75517a75617e011979610079635167010068517a75617e011879610079009c630100670079686100798277005179014c9f63517951615179517951938000795179827751947f75007f77517a75517a75517a7561517a756751790200019f63014c527951615179517951938000795179827751947f75007f77517a75517a75517a75617e517a75675179030000019f63014d527952615179517951938000795179827751947f75007f77517a75517a75517a75617e517a756751790500000000019f63014e527954615179517951938000795179827751947f75007f77517a75517a75517a75617e517a7567006968686868007953797e517a75517a75517a7561517a75617e0117796100798277005179014c9f63517951615179517951938000795179827751947f75007f77517a75517a75517a7561517a756751790200019f63014c527951615179517951938000795179827751947f75007f77517a75517a75517a75617e517a75675179030000019f63014d527952615179517951938000795179827751947f75007f77517a75517a75517a75617e517a756751790500000000019f63014e527954615179517951938000795179827751947f75007f77517a75517a75517a75617e517a7567006968686868007953797e517a75517a75517a75617e5879517961007982775480517951797e0051807e517a75517a75617e517a75610079527961007958805279610079827700517902fd009f63517951615179517951938000795179827751947f75007f77517a75517a75517a7561517a75675179030000019f6301fd527952615179517951938000795179827751947f75007f77517a75517a75517a75617e517a756751790500000000019f6301fe527954615179517951938000795179827751947f75007f77517a75517a75517a75617e517a75675179090000000000000000019f6301ff527958615179517951938000795179827751947f75007f77517a75517a75517a75617e517a7568686868007953797e517a75517a75517a75617e517a75517a7561517a75517a7561517a75670001177a7501167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a011b79011b797e011a797e0119797e517a7568587900a063007961597900a0635879610125790124797e01147e51797e0125797e0123797e517a75615a7961007958805279610079827700517902fd009f63517951615179517951938000795179827751947f75007f77517a75517a75517a7561517a75675179030000019f6301fd527952615179517951938000795179827751947f75007f77517a75517a75517a75617e517a756751790500000000019f6301fe527954615179517951938000795179827751947f75007f77517a75517a75517a75617e517a75675179090000000000000000019f6301ff527958615179517951938000795179827751947f75007f77517a75517a75517a75617e517a7568686868007953797e517a75517a75517a75617e517a75517a7561670068617e517a75007975680111795179aa877777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777767011e7952876301217961007901687f776100005279517f75007f77007901fd87635379537f75517f7761007901007e81517a7561537a75527a527a5379535479937f75537f77527a75517a67007901fe87635379557f75517f7761007901007e81517a7561537a75527a527a5379555479937f75557f77527a75517a67007901ff87635379597f75517f7761007901007e81517a7561537a75527a527a5379595479937f75597f77527a75517a675379517f75007f7761007901007e81517a7561537a75527a527a5379515479937f75517f77527a75517a6868685179517a75517a75517a75517a7561517a7561007961007982775179517951947f755179549451947f77007981527951799454945194517a75517a75517a75517a7561517951797f75537a75527a527a0000537953797f77610079537a75527a527a00527a75517a7561615179517951937f7551797f775179768b537a75527a527a75010051798791517a75610079916361005379005179557951937f7555797f77815579768b577a75567a567a567a567a567a567a750079014c9f630079547a75537a537a537a527956795579937f7556797f77527a75517a670079014c9c635279567951937f7556797f7761007901007e81517a7561547a75537a537a537a55795193567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014d9c635279567952937f7556797f7761007901007e81517a7561547a75537a537a537a55795293567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014e9c635279567954937f7556797f7761007901007e81517a7561547a75537a537a537a55795493567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670069686868685579547993567a75557a557a557a557a557a5579755179517a75517a75517a75517a7561011c7a75011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a011b7a61005379005179557951937f7555797f77815579768b577a75567a567a567a567a567a567a750079014c9f630079547a75537a537a537a527956795579937f7556797f77527a75517a670079014c9c635279567951937f7556797f7761007901007e81517a7561547a75537a537a537a55795193567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014d9c635279567952937f7556797f7761007901007e81517a7561547a75537a537a537a55795293567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014e9c635279567954937f7556797f7761007901007e81517a7561547a75537a537a537a55795493567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670069686868685579547993567a75557a557a557a557a557a5579755179517a75517a75517a75517a7561011b7a75011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a011a7a61005379005179557951937f7555797f77815579768b577a75567a567a567a567a567a567a750079014c9f630079547a75537a537a537a527956795579937f7556797f77527a75517a670079014c9c635279567951937f7556797f7761007901007e81517a7561547a75537a537a537a55795193567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014d9c635279567952937f7556797f7761007901007e81517a7561547a75537a537a537a55795293567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014e9c635279567954937f7556797f7761007901007e81517a7561547a75537a537a537a55795493567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670069686868685579547993567a75557a557a557a557a557a5579755179517a75517a75517a75517a7561011a7a7501197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a01197a61005379005179557951937f7555797f77815579768b577a75567a567a567a567a567a567a750079014c9f630079547a75537a537a537a527956795579937f7556797f77527a75517a670079014c9c635279567951937f7556797f7761007901007e81517a7561547a75537a537a537a55795193567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014d9c635279567952937f7556797f7761007901007e81517a7561547a75537a537a537a55795293567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014e9c635279567954937f7556797f7761007901007e81517a7561547a75537a537a537a55795493567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670069686868685579547993567a75557a557a557a557a557a5579755179517a75517a75517a75517a756101197a7501187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a61005379005179557951937f7555797f77815579768b577a75567a567a567a567a567a567a750079014c9f630079547a75537a537a537a527956795579937f7556797f77527a75517a670079014c9c635279567951937f7556797f7761007901007e81517a7561547a75537a537a537a55795193567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014d9c635279567952937f7556797f7761007901007e81517a7561547a75537a537a537a55795293567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014e9c635279567954937f7556797f7761007901007e81517a7561547a75537a537a537a55795493567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670069686868685579547993567a75557a557a557a557a557a5579755179517a75517a75517a75517a756101187a7501177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a615279527951937f7552797f775279768b547a75537a537a537a75010051798791517a756101177a7501167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a01167a6161005379005179557951937f7555797f77815579768b577a75567a567a567a567a567a567a750079014c9f630079547a75537a537a537a527956795579937f7556797f77527a75517a670079014c9c635279567951937f7556797f7761007901007e81517a7561547a75537a537a537a55795193567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014d9c635279567952937f7556797f7761007901007e81517a7561547a75537a537a537a55795293567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014e9c635279567954937f7556797f7761007901007e81517a7561547a75537a537a537a55795493567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670069686868685579547993567a75557a557a557a557a557a5579755179517a75517a75517a75517a7561816101167a7501157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a01157a61005379005179557951937f7555797f77815579768b577a75567a567a567a567a567a567a750079014c9f630079547a75537a537a537a527956795579937f7556797f77527a75517a670079014c9c635279567951937f7556797f7761007901007e81517a7561547a75537a537a537a55795193567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014d9c635279567952937f7556797f7761007901007e81517a7561547a75537a537a537a55795293567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670079014e9c635279567954937f7556797f7761007901007e81517a7561547a75537a537a537a55795493567a75557a557a557a557a557a557975527956795579937f7556797f77527a75517a670069686868685579547993567a75557a557a557a557a557a5579755179517a75517a75517a75517a756101157a7501147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a01147a680126790141615179012179012179210ac407f0e4bd44bfc207355a778b046225a7068fc59ee7eda43ad905aadbffc800206c266b30e6a1319c66dc401e5bd6b432ba49688eecd118297041da8074ce08100123795679615679aa0079610079517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e01007e81517a75615779567956795679567961537956795479577995939521414136d08c5ed2bf3ba048afe6dcaebafeffffffffffffffffffffffffffffff00517951796151795179970079009f63007952799367007968517a75517a75517a7561527a75517a517951795296a0630079527994527a75517a6853798277527982775379012080517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e01205279947f7754537993527993013051797e527e54797e58797e527e53797e52797e57797e0079517a75517a75517a75517a75517a75517a75517a75517a75517a75517a75517a75517a75517a756100795779ac517a75517a75517a75517a75517a75517a75517a75517a75517a7561517a75517a756169012679610079610079547f75517a7561517961007901247f75547f77517a7561527961007901447f7501247f77517a7561537961007982775179517958947f7551790128947f77517a75517a7561547961007961007982775179517954947f75517958947f77517a75517a756161007901007e81517a7561517a756155796100796100798277517951790128947f755179012c947f77517a75517a756161007901007e81517a7561517a7561567961007982775179517953947f75517954947f77517a75517a7561577961007901687f7501447f77517a756101207f75007f77587961007901687f7501447f77517a756101207f7781517951795b7961007901687f776100005279517f75007f77007901fd87635379537f75517f7761007901007e81517a7561537a75527a527a5379535479937f75537f77527a75517a67007901fe87635379557f75517f7761007901007e81517a7561537a75527a527a5379555479937f75557f77527a75517a67007901ff87635379597f75517f7761007901007e81517a7561537a75527a527a5379595479937f75597f77527a75517a675379517f75007f7761007901007e81517a7561537a75527a527a5379515479937f75517f77527a75517a6868685179517a75517a75517a75517a7561517a75615c79610079610079827751795179012c947f7551790134947f77517a75517a756161007901007e81517a7561517a7561537953795379537960796079607960796079607960795a795a795a795a79011c795c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a755c7a7561011f7a011f7a011f7a011f7a011f7a011f7a011f7a011f7a011f7a011f7a011f7a011f7a75757575757575757575757501137a01137a01137a01137a01137a01137a01137a01137a012579012579597a597a7575577a577a577a577a577a577a01167969012779011679a2690128790119798791690114790087916301287901157987696800011c790001197a7501187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a01187a0001187a7501177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a01177a011c79011c797e012b797e011a797e527a75517a51795179a9610126790125797e01147e51797e0126797e0124797e517a7561012b7961007958805279610079827700517902fd009f63517951615179517951938000795179827751947f75007f77517a75517a75517a7561517a75675179030000019f6301fd527952615179517951938000795179827751947f75007f77517a75517a75517a75617e517a756751790500000000019f6301fe527954615179517951938000795179827751947f75007f77517a75517a75517a75617e517a75675179090000000000000000019f6301ff527958615179517951938000795179827751947f75007f77517a75517a75517a75617e517a7568686868007953797e517a75517a75517a75617e517a75517a75617e527a75517a517975597900a0635179615a7900a0635979610126790125797e01147e51797e0126797e0124797e517a75615b7961007958805279610079827700517902fd009f63517951615179517951938000795179827751947f75007f77517a75517a75517a7561517a75675179030000019f6301fd527952615179517951938000795179827751947f75007f77517a75517a75517a75617e517a756751790500000000019f6301fe527954615179517951938000795179827751947f75007f77517a75517a75517a75617e517a75675179090000000000000000019f6301ff527958615179517951938000795179827751947f75007f77517a75517a75517a75617e517a7568686868007953797e517a75517a75517a75617e517a75517a7561670068617e527a75517a517975680112795279aa877777777777777777777777777777777777777777777777777777777777777777777777777777777777777767006868686a01010001000100010001000101000100100000000002000000000000001976a9148c51ed42f050b1bde974fb6649e25b782d168f4088ac00000000'
}
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////



/*
////////////////////////////////////////////////////////////////////
//Jesus is the Lord!!!
////////////////////////////////////////////////////////////////////

export function dataFormatScrypt(hexStringData: string, fileName: string): string
{
      //////////////////////////////////////////////////////////
      //Data Input
      //////////////////////////////////////////////////////////
      let dataToChain: ByteString = '00'

      let newData = dataToChain;

      //vem de fora
      newData = hexStringData; //vem de fora

      let dataSize = (newData.length/2).toString(16)

      while(dataSize.length < 8)
          dataSize = '0' + dataSize

      let newDataInfo = '000000' + '00' + '00000000'
      //Default Text File
      //let dataInfo1 = '000000'
      let dataInfo1 = '000001'

      let typeOfContent = ''

      //if(selectedFile !== null)
      if(fileName !== '')
      {
        //switch(selectedFile.name.split('.')[1])
        switch(fileName.split('.')[1])
        {
          case 'txt': 
            dataInfo1 = '000001';
            typeOfContent = ContentType.TEXT_UTF8
            break;
          case 'jfif': 
            dataInfo1 = '000002';
            typeOfContent = ContentType.JPG
            break;
          case 'jpg': 
            dataInfo1 = '000003';
            typeOfContent = ContentType.JPG
            break;          
          case 'jpeg': 
            dataInfo1 = '000004';
            typeOfContent = ContentType.JPEG
            break;              
          case 'm4a': 
            dataInfo1 = '000005';
            typeOfContent = ContentType.MP4
            break;              
          case 'mov': 
            dataInfo1 = '000006';
            typeOfContent = ContentType.VIDEO_MP4
            break;              
          case 'mp3': 
            dataInfo1 = '000007';
            typeOfContent = ContentType.AUDIO_MPEG
            break;              
          case 'mp4': 
            dataInfo1 = '000008';
            typeOfContent = ContentType.MP4
            break;  
          case 'mpeg': 
            dataInfo1 = '000009';
            typeOfContent = ContentType.MPEG
            break;  
          case 'mpg': 
            dataInfo1 = '00000a';
            break;          
          case 'pdf': 
            dataInfo1 = '00000b';
            typeOfContent = ContentType.PDF
            break;                      
          case 'png': 
            dataInfo1 = '00000c';
            typeOfContent = ContentType.PNG
            break;   
          case 'ppt': 
            dataInfo1 = '00000d';
            typeOfContent = ContentType.TEXT
            break;   
          case 'pptx': 
            dataInfo1 = '00000e';
            typeOfContent = ContentType.TEXT
            break;   
          case 'rar': 
            dataInfo1 = '00000f';
            typeOfContent = ContentType.MODEL_GLTF_BINARY
            break;         
          case 'rtf': 
            dataInfo1 = '000010';
            typeOfContent = ContentType.MODEL_GLTF_BINARY
            break;                
          case 'tif': 
            dataInfo1 = '000011';
            typeOfContent = ContentType.MODEL_GLTF_BINARY
            break;            
          case 'tiff': 
            dataInfo1 = '000012';
            typeOfContent = ContentType.MODEL_GLTF_BINARY
            break;            
          case 'wav': 
            dataInfo1 = '000013';
            typeOfContent = ContentType.WAV
            break;                
          case 'wma': 
            dataInfo1 = '000014';
            typeOfContent = ContentType.AUDIO_WAV
            break;            
          case 'wmv': 
            dataInfo1 = '000015';
            typeOfContent = ContentType.WEBM
            break;            
          case 'xls': 
            dataInfo1 = '000016';
            typeOfContent = ContentType.MODEL_GLTF_BINARY
            break;            
          case 'xlsx': 
            dataInfo1 = '000017';
            typeOfContent = ContentType.MODEL_GLTF_BINARY
            break;            
          case 'zip': 
            dataInfo1 = '000018';
            typeOfContent = ContentType.MODEL_GLTF_BINARY
            break;              
          case 'webp': 
            dataInfo1 = '000019';
            typeOfContent = ContentType.WEBP
            break;              
          case 'html': 
            dataInfo1 = '00001a';
            typeOfContent = ContentType.TEXT_HTML_UTF8
            break;          
          case 'csv': 
            dataInfo1 = '00001b';
            typeOfContent = ContentType.TEXT_UTF8
            break;
          case 'bmp': 
            dataInfo1 = '00001c';
            typeOfContent = ContentType.IMAGE_JPEG
            break;                        
          default:
            typeOfContent = ContentType.MODEL_GLTF_BINARY
            dataInfo1 = '000000';
        }
      }

      let dataInfo2 = '00'
      let dataInfo3 = dataSize

      newDataInfo = dataInfo1 + dataInfo2 + dataSize

      ////////////////////////////////////////////////////////////////////
      //Jesus is the Lord!!!
      ////////////////////////////////////////////////////////////////////

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

      return newData
}
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
*/