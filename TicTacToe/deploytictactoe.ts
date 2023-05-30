////////////////////////////////////////////////////////////
//Criar o Smart Contract
////////////////////////////////////////////////////////////
//Scrypt crew
import { TicTacToe } from './src/contracts/tictactoe'
import { getDefaultSigner, sleep } from './tests/utils/txHelper'
import {PubKeyHash, bsv, PubKey, toHex, TestWallet, DefaultProvider} from 'scrypt-ts'

(async () => { 

    // Read the private key from the .env file.
    // The default private key inside the .env file is meant to be used for the Bitcoin testnet.
    // See https://scrypt.io/docs/bitcoin-basics/bsv/#private-keys
    //const privateKey = bsv.PrivateKey.fromWIF(process.env.PRIVATE_KEY)
    const privateKey = bsv.PrivateKey.fromWIF("cRrpFeyrAHW62H8sSRZ28XwMhqqFjRBe2kkVHZ7b4r3SYrJyQ47D")
    const privateKey2 = bsv.PrivateKey.fromHex("ccbf6b06cb35e102f42ecfaa5de55ab6cd35431b95f6ee4fd5199ad90943c5cf", bsv.Networks.testnet)
    const privateKey3 = bsv.PrivateKey.fromHex("79342a4c317817a80a298fe116147a74e4e90912a4f321e588a4db67204e29b0", bsv.Networks.testnet)
    
    // Prepare signer.
    // See https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#prepare-a-signer-and-provider

    const Alice = new TestWallet(privateKey2, new DefaultProvider({network: bsv.Networks.testnet}))
    const Bob = new TestWallet(privateKey3, new DefaultProvider({network: bsv.Networks.testnet}))
    const Me = new TestWallet(privateKey, new DefaultProvider({network: bsv.Networks.testnet}))

    await TicTacToe.compile() 
  
    let pbkeyBob = bsv.PublicKey.fromPrivateKey(privateKey3)
    let pbkeyAlice = bsv.PublicKey.fromPrivateKey(privateKey2)

    const counter = new TicTacToe(PubKey(toHex(pbkeyAlice)), PubKey(toHex(pbkeyBob))) 
  
    // connect to a signer 
    //await counter.connect(Alice)
    await counter.connect(Bob) 
    //await counter.connect(Me) 
  
    const balance = 2000 
  
    // contract deployment 
    const deployTx = await counter.deploy(balance) 
    console.log('Counter deploy tx:', deployTx.id)

} )()

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////