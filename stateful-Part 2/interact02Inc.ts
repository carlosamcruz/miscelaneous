////////////////////////////////////////////////////////////
//Versão 2: Incrementa Contador do Contator
////////////////////////////////////////////////////////////
//Scrypt crew
import { Statefulsc02 } from './src/contracts/statefulsc02'
//import { getDefaultSigner, sleep } from './tests/testnet/util/txHelper'
import { getDefaultSigner, sleep } from './tests/utils/txHelper'
import { MethodCallOptions, DefaultProvider, bsv, TestWallet } from 'scrypt-ts' 
  
(async () => { 

    //Chave Diferente
    const privateKey = bsv.PrivateKey.fromHex("79342a4c317817a80a298fe116147a74e4e90912a4f321e588a4db67204e29b0", bsv.Networks.testnet)

    // Prepare signer.
    // See https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#prepare-a-signer-and-provider
    
    let provDf = new DefaultProvider({network: bsv.Networks.testnet})
 
    const signer = new TestWallet(
        privateKey,
        provDf
    )

     await Statefulsc02.compile()

     const balance = 1000
     await provDf.connect()
     let tx3 = new bsv.Transaction
     tx3 = await provDf.getTransaction('00682ff256806682f0df970bfc79d3d783c296d8e4cdc741845c6b9540dfb6f9')
 
     console.log('Test TX3: ', tx3.id)
 
     //Para carregar o SC que será executado
     //const instance2 = Helloworld.fromTx(tx2, 0)
     const counter = Statefulsc02.fromTx(tx3, 0)
 
     // connect to a signer
     //await instance.connect(getDefaultSigner())
     await counter.connect(signer)

     // set current instance to be the deployed one 
     let currentInstance = counter 
  
     // call the method of current instance to apply the updates on chain 
     for (let i = 0; i < 3; ++i) { 
     //for (let i = 0; i < 1; ++i) {    
         // avoid mempool conflicts, sleep to allow previous tx "sink-into" the network 
         await sleep(2) 
  
         // create the next instance from the current 
         const nextInstance = currentInstance.next() 
  
         // apply updates on the next instance off chain 
         nextInstance.increment() 
  
         // call the method of current instance to apply the updates on chain 
         //const { tx: tx_i } = await currentInstance.methods.incrementOnChain({
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