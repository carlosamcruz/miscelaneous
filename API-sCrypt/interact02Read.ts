////////////////////////////////////////////////////////////
//Versão 2: Leitura de Estado do Contrato com a API do sCrypt
////////////////////////////////////////////////////////////
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

    // Prepare signer.
    // See https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#prepare-a-signer-and-provider
    
    //let provDf = new DefaultProvider({network: bsv.Networks.testnet})
    let provDf = new ScryptProvider()
 
    const signer = new TestWallet(
        privateKey,
        provDf
    )

    await Statefulsc02.compile()

    //const balance = 1000
    await provDf.connect()
    let tx3 = new bsv.Transaction

    //Usando apenas o TXID do deploy
    //tx3 = await provDf.getTransaction('9db302681cb7638964975f3ee90f65b1e33753ed86eb927dceb9666c0d9bb247')
    tx3 = await provDf.getTransaction('ab3962c7b06bd8fda698c442e48ad73a2e5bad91cbe7b84d8f9d6658f2bdb283')
   
    console.log('Test TX3: ', tx3.id)
 
    const contractId = {
       // The deployment transaction id
       txId: tx3.id,
       // The output index
       outputIndex: 0,
    }     

    const currentInstance = await Scrypt.contractApi.getLatestInstance(
        Statefulsc02,
        contractId
    )

    await currentInstance.connect(signer)
  
    console.log( 'Counter: ', currentInstance.count)
    console.log( 'Script Hash: ', currentInstance.scriptHash)

} )()
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////