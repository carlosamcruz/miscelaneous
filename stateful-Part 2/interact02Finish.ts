////////////////////////////////////////////////////////////
//Versão 2: Finaliza Contrato
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
     tx3 = await provDf.getTransaction('44df8144158e748f9c32fa966c6f51085a63b249c45da8f976e65019526adb4e')
 
     console.log('Test TX3: ', tx3.id)
   
      //Finalizar
      {
        const counterFinal = Statefulsc02.fromTx(tx3, 0)
        // connect to a signer
        //await instance.connect(getDefaultSigner())

        await counterFinal.connect(signer)

        const { tx: callTx } = await counterFinal.methods.finish()
        console.log('Final state: ', callTx.id)
      }

} )()
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////