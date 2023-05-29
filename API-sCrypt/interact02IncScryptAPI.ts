//////////////////////////////////////////////////////////////////////
//Versão 2: Incrementa Contador do Contrato através da API do sCrypt
//////////////////////////////////////////////////////////////////////
import { Statefulsc02 } from './src/contracts/statefulsc02'
import { getDefaultSigner, sleep } from './tests/utils/txHelper'
import { MethodCallOptions, DefaultProvider, bsv, TestWallet, Scrypt, ScryptProvider } from 'scrypt-ts' 
  
(async () => { 

    Scrypt.init({
        apiKey: 'testnet_20MWFUJKwwA4SAAxaM7fJseNQGIjy9LK4Ug7jk0b6ctCHnAGn',
        //network: bsv.Networks.testnet
        network: 'testnet'
    })

    //Chave Diferente
    const privateKey = bsv.PrivateKey.fromHex("79342a4c317817a80a298fe116147a74e4e90912a4f321e588a4db67204e29b0", bsv.Networks.testnet)

    //let provDf = new DefaultProvider({network: bsv.Networks.testnet})
    let provDf = new ScryptProvider()
 
    const signer = new TestWallet(
        privateKey,
        provDf
    )

    await Statefulsc02.compile()

    const balance = 1000

    await provDf.connect()
    let tx3 = new bsv.Transaction

    //Use the Deploy TXID
    tx3 = await provDf.getTransaction('ab3962c7b06bd8fda698c442e48ad73a2e5bad91cbe7b84d8f9d6658f2bdb283')
 
    console.log('Test TX3: ', tx3.id)
 
    const contractId = {
       // The deployment transaction id
       txId: tx3.id,
       // The output index
       outputIndex: 0,
    }     
 
    let currentInstance = await Scrypt.contractApi.getLatestInstance(
        Statefulsc02,
        contractId
    )

    await currentInstance.connect(signer)

    for (let i = 0; i < 3; ++i) {     
        // avoid mempool conflicts, sleep to allow previous tx "sink-into" the network 
        await sleep(2) 
     
        // create the next instance from the current 
        const nextInstance = currentInstance.next() 
     
        // apply updates on the next instance off chain 
        nextInstance.increment() 
     
        // call the method of current instance to apply the updates on chain 
        const { tx: callTx } = await currentInstance.methods.incrementOnChain({    
            next: { 
                instance: nextInstance, 
                balance, 
            }, 
        } as MethodCallOptions<Statefulsc02>) 
   
        tx3 = await provDf.getTransaction(callTx.id)
     
        console.log( 'Counter: ', currentInstance.count + 1n)
        console.log( 'TXID: ', callTx.id)
   
        // update the current instance reference 
        currentInstance = nextInstance 
    } 

} )()
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////