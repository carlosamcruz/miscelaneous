/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Jesus is the Lord
/////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//PUSH DATA on a P2PKH Output
////////////////////////////////////////////////////////////////////////////////
import { bsv, DefaultProvider, TestWallet, toHex, toByteString} from 'scrypt-ts'

(async () => {

    //let pvScritp = false //Using no previous script 
    let pvScritp = true //Using previous script
    let satsToScript = 1000

    let utxoIndex = 0
    let toGetTX = 'e529b9584b8e8ee7580994801608f70979e18645e4afa8af6d3d7309e99281fa';
 
    const privateKey = bsv.PrivateKey.fromHex("79342a4c317817a80a298fe116147a74e4e90912a4f321e588a4db67204e29b0", bsv.Networks.testnet)
 
    const Alice = new TestWallet(privateKey, new DefaultProvider({network: bsv.Networks.testnet}))
    let toADD = await Alice.getDefaultAddress()

    let provDf = new DefaultProvider({network: bsv.Networks.testnet})
    await provDf.connect()

    let tx = new bsv.Transaction
    tx = await provDf.getTransaction(toGetTX)

    //UTXOs do Endereço do Dono
    let UTXOs = await provDf.listUnspent(await Alice.getDefaultAddress())

    console.log('Previous TX: ', tx.id)

    let sendADD = await Alice.getDefaultAddress() // you can send it to any address you want
 
    //Your data here
    let data = toByteString('Test PUSH DATA', true)
    let scriptDROP = 'OP_DUP OP_HASH160 ' + toHex(sendADD.hashBuffer) + ' OP_EQUALVERIFY OP_CHECKSIG ' + data + ' OP_DROP'

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Jesus is the Lord
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
//Etapa para Calculo da Taxa de Rede
/////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    let tx2 = new bsv.Transaction()
    let tSatoshis = 0

    if(pvScritp)
    {
        //Using previous script
        tx2.addInputFromPrevTx(tx, utxoIndex)
    }
  
    /////////////////////////////////////////////////
    //A taxa vem somente da carteira
    /////////////////////////////////////////////////
    for(let i = 0; i < UTXOs.length; i++)
    {
        tx2.from(UTXOs[i])
        tSatoshis = tSatoshis + UTXOs[i].satoshis
    }
        
    //TX do Contrato
    if(pvScritp)
    {
        //Using previous script
        tx2.addOutput(new bsv.Transaction.Output({
            script: bsv.Script.fromASM(scriptDROP),
            satoshis: tx.outputs[utxoIndex].satoshis,
        }))
    }
    else
    {
        //Using new script
        tSatoshis = tSatoshis - satsToScript //take the satoshis that will be locked from the total ammount

        tx2.addOutput(new bsv.Transaction.Output({
            script: bsv.Script.fromASM(scriptDROP),
            satoshis: satsToScript,
        }))
    }

    //TX do ADD
    tx2.addOutput(new bsv.Transaction.Output({
        script: bsv.Script.buildPublicKeyHashOut(toADD),
        satoshis: tSatoshis,
    }))


    tx2 = tx2.seal()
    tx2 = tx2.sign(privateKey)

    // Para o Calcula da TAXA de rede

    let rawTX = toHex(tx2)
    let feeTX;
    if(rawTX.substring(82, 84) === '00')
    {
        feeTX = Math.floor(((toHex(tx2).length/2) - ('00'.length/2) + (tx2.DERSEC()[0].length/2))*0.05) + 1
    } 
    else
    {
        feeTX = Math.floor((toHex(tx2).length/2)*0.05) + 1
    }

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Jesus is the Lord
/////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//Etapa de Construção Final da TX
/////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    tx2 = new bsv.Transaction()
    
    if(pvScritp)
    {
        //Using previous script
        tx2.addInputFromPrevTx(tx, utxoIndex)
    }


    for(let i = 0; i < UTXOs.length; i++)
    {
        tx2.from(UTXOs[i])
    }

    //TX do Contrato

    if(pvScritp)
    {
        //Using previous script
        tx2.addOutput(new bsv.Transaction.Output({
            script: bsv.Script.fromASM(scriptDROP),
            satoshis: tx.outputs[utxoIndex].satoshis,
        }))
    }
    else
    {
        //Using new script
        tx2.addOutput(new bsv.Transaction.Output({
            script: bsv.Script.fromASM(scriptDROP),
            satoshis: satsToScript,
        }))
    }

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

    //Inserção da Assinatura do Script
    if(rawTX.substring(82, 84) === '00')
    {
        rawTX = rawTX.substring(0, 82) + tx2.DERSEC()[0] + rawTX.substring(84, rawTX.length)
    } 

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

    console.log('\nRaw TX: ', rawTX)

    const txId = await provDf.sendRawTransaction(rawTX)
    console.log('\nTXID: ', txId)

})()

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
