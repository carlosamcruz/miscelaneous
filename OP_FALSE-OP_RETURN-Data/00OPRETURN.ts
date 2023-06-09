/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Jesus is the Lord
/////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//OP_FALSE OP_RETURN DATA
////////////////////////////////////////////////////////////////////////////////
//import { Helloworld } from './src/contracts/helloworld'
import { toByteString, bsv, DefaultProvider, TestWallet, toHex} from 'scrypt-ts'

(async () => {

    const privateKey = bsv.PrivateKey.fromHex("79342a4c317817a80a298fe116147a74e4e90912a4f321e588a4db67204e29b0", bsv.Networks.testnet) 
 
    const Alice = new TestWallet(privateKey, new DefaultProvider({network: bsv.Networks.testnet}))
    let toADD = await Alice.getDefaultAddress()

    let provDf = new DefaultProvider({network: bsv.Networks.testnet})

    await provDf.connect()

    let tx = new bsv.Transaction

    //UTXOs do Endereço do Dono
    let UTXOs = await provDf.listUnspent(await Alice.getDefaultAddress())

    //Put your text data here
    let data = toByteString('Test OP_RETURN', true)

    let scriptDROP = 'OP_FALSE OP_RETURN ' + data

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Jesus is the Lord
/////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//Etapa para Calculo da Taxa de Rede
/////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    let tx2 = new bsv.Transaction()
    let tSatoshis = 0
     
    /////////////////////////////////////////////////
    //A taxa vem do endereço
    /////////////////////////////////////////////////
    for(let i = 0; i < UTXOs.length; i++)
    {
        tx2.from(UTXOs[i])
        tSatoshis = tSatoshis + UTXOs[i].satoshis
    }
        
    //OP_FALSE OP_RETURN DATA
    tx2.addOutput(new bsv.Transaction.Output({
        script: bsv.Script.fromASM(scriptDROP),
        satoshis: 0,
    }))

    //Change ADD
    tx2.addOutput(new bsv.Transaction.Output({
        script: bsv.Script.buildPublicKeyHashOut(toADD),
        satoshis: tSatoshis,
    }))

    tx2 = tx2.seal()
    tx2 = tx2.sign(privateKey)

    // Para o Calcula da TAXA de rede

    let rawTX = toHex(tx2)
    let feeTX;

    feeTX = Math.floor((toHex(tx2).length/2)*0.05) + 1


/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Jesus is the Lord
/////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//Etapa de Construção Final da TX
/////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    tx2 = new bsv.Transaction()

    for(let i = 0; i < UTXOs.length; i++)
    {
        tx2.from(UTXOs[i])
    }

    //OP_FALSE OP_RETURN DATA
    tx2.addOutput(new bsv.Transaction.Output({
        script: bsv.Script.fromASM(scriptDROP),
        satoshis: 0,
    }))
    //TX do ADD
    tx2.addOutput(new bsv.Transaction.Output({
        script: bsv.Script.buildPublicKeyHashOut(toADD),
        satoshis: tSatoshis - feeTX,
    }))

    tx2 = tx2.seal().sign(privateKey)
    
    rawTX = toHex(tx2)
    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Jesus is the Lord
    /////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Broadcast TX
    const txId = await provDf.sendRawTransaction(rawTX)
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

    console.log('\nRaw TX: ', rawTX)
    console.log('TXID: ', txId)

})()

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
