////////////////////////////////////////////////////////////////////////////////
// JESUS is the LORD of ALL
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////
//Criar o Smart Contract
////////////////////////////////////////////////////////////
import { GeneralToken } from './src/contracts/generaltoken'
import { getDefaultSigner, sleep } from './tests/utils/txHelper'
import {PubKeyHash, bsv, PubKey, toHex, TestWallet, DefaultProvider, toByteString} from 'scrypt-ts'

(async () => { 

    const privateKey3 = bsv.PrivateKey.fromHex("ccbf6b06cb35e102f42ecfaa5de55ab6cd35431b95f6ee4fd5199ad90943c5cf", bsv.Networks.testnet)
    const privateKey2 = bsv.PrivateKey.fromHex("79342a4c317817a80a298fe116147a74e4e90912a4f321e588a4db67204e29b0", bsv.Networks.testnet)
    
    const Alice = new TestWallet(privateKey2, new DefaultProvider({network: bsv.Networks.testnet}))
    const Bob = new TestWallet(privateKey3, new DefaultProvider({network: bsv.Networks.testnet}))

    console.log(('Teste de Token Generico na Blockchain'))

    await GeneralToken.compile() 
  
    let pbkeyBob = bsv.PublicKey.fromPrivateKey(privateKey3)
    let pbkeyAlice = bsv.PublicKey.fromPrivateKey(privateKey2)

    //Define Token Owner and Total Supply
    const counter = new GeneralToken(PubKey(toHex(pbkeyAlice)), 100n)

    await counter.connect(Bob) 
  
    const balance = 1000 
  
    // contract deployment 
    const deployTx = await counter.deploy(balance) 
    console.log('Counter deploy tx:', deployTx.id)
    
} )()