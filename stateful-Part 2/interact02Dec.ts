////////////////////////////////////////////////////////////
//Versão 2: Decrementa Contador do Contator
////////////////////////////////////////////////////////////
//Scrypt crew
import { Statefulsc02 } from './src/contracts/statefulsc02'
//import { getDefaultSigner, sleep } from './tests/testnet/util/txHelper'
import { getDefaultSigner, sleep } from './tests/utils/txHelper'
import { MethodCallOptions, DefaultProvider, bsv, TestWallet } from 'scrypt-ts' 
  
(async () => { 

    const privateKey = bsv.PrivateKey.fromHex("ccbf6b06cb35e102f42ecfaa5de55ab6cd35431b95f6ee4fd5199ad90943c5cf", bsv.Networks.testnet)

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
     tx3 = await provDf.getTransaction('6331c7476bfd1bb8960aeb39316fa3b76ab5c07aa4062f751c16ec2093b822bc')
 
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
         nextInstance.decrement() 
  
         // call the method of current instance to apply the updates on chain 
         //const { tx: tx_i } = await currentInstance.methods.incrementOnChain({
         const { tx: callTx } = await currentInstance.methods.decrementOnChain({    
             next: { 
                 instance: nextInstance, 
                 balance, 
             }, 
         } as MethodCallOptions<Statefulsc02>) 

         tx3 = await provDf.getTransaction(callTx.id)
  
         console.log( 'Counter: ', currentInstance.count - 1n)
         console.log( 'TXID: ', callTx.id)

         // update the current instance reference 
         currentInstance = nextInstance 
      } 

} )()
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////