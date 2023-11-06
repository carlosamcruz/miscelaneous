////////////////////////////////////////////////////////////
//Criar o Smart Contract
////////////////////////////////////////////////////////////
//Scrypt crew
import { TicTacToe } from './src/contracts/tictactoe'
import { getDefaultSigner, sleep } from './tests/utils/txHelper'
import {PubKeyHash, bsv, PubKey, toHex, TestWallet, DefaultProvider, buildPublicKeyHashScript, hash160, findSig, buildOpreturnScript, toByteString} from 'scrypt-ts'

(async () => { 

    // Read the private key from the .env file.
    // The default private key inside the .env file is meant to be used for the Bitcoin testnet.
    // See https://scrypt.io/docs/bitcoin-basics/bsv/#private-keys
    //const privateKey = bsv.PrivateKey.fromWIF(process.env.PRIVATE_KEY)
    ///const privateKey = bsv.PrivateKey.fromWIF("cRrpFeyrAHW62H8sSRZ28XwMhqqFjRBe2kkVHZ7b4r3SYrJyQ47D")
    const privateKey2 = bsv.PrivateKey.fromHex("ccbf6b06cb35e102f42ecfaa5de55ab6cd35431b95f6ee4fd5199ad90943c5cf", bsv.Networks.testnet)
    const privateKey3 = bsv.PrivateKey.fromHex("79342a4c317817a80a298fe116147a74e4e90912a4f321e588a4db67204e29b0", bsv.Networks.testnet)
    
    // Prepare signer.
    // See https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#prepare-a-signer-and-provider

    const Alice = new TestWallet(privateKey2, new DefaultProvider({network: bsv.Networks.testnet}))
    const Bob = new TestWallet(privateKey3, new DefaultProvider({network: bsv.Networks.testnet}))
    //const Me = new TestWallet(privateKey, new DefaultProvider({network: bsv.Networks.testnet}))

    await TicTacToe.compile() 
  
    let pbkeyBob = bsv.PublicKey.fromPrivateKey(privateKey3)
    let pbkeyAlice = bsv.PublicKey.fromPrivateKey(privateKey2)

    const counter = new TicTacToe(PubKey(toHex(pbkeyAlice)), PubKey(toHex(pbkeyBob))) 


    let provDf = new DefaultProvider({network: bsv.Networks.testnet})

    let pvtkey = privateKey3

    await provDf.connect()
    let tx3 = new bsv.Transaction

    tx3 = await provDf.getTransaction('0c2845eb3e4fe618cf0895eaddf8b27d7b1d6f533ac32e2f1d268d4b883f5631');

    let instance2 = TicTacToe.fromTx(tx3, 0)

    await instance2.connect(Bob)

    const nextInstance = instance2.next()

    let msg = 'New Game Started'
    

    let outputMsg = toHex((new bsv.Transaction.Output({
        script: buildOpreturnScript(Buffer.from(msg, "utf8").toString("hex")),
        satoshis: 0
    })).toBufferWriter().toBuffer())


    //console.log('HEX MSG 0: ', (msg))
    //console.log('HEX MSG 1: ', toHex(msg))
    //console.log('HEX MSG 2: ', Buffer.from(msg, "utf8").toString("hex"))

    instance2.bindTxBuilder('alert', async function () {

        const changeAddress = bsv.Address.fromPrivateKey(pvtkey)
   
        const unsignedTx: bsv.Transaction = new bsv.Transaction()
        //.addInputFromPrevTx(current.from?.tx as bsv.Transaction, current.from?.outputIndex)
        .addInputFromPrevTx(tx3, 0)
        //.from(options.utxos);

        unsignedTx.addOutput(new bsv.Transaction.Output({
            script: nextInstance.lockingScript,
            satoshis: instance2.balance,
        }))

        unsignedTx.addOutput(new bsv.Transaction.Output({
            script: buildPublicKeyHashScript(hash160(instance2.alice)),
            satoshis: 1
        }))
        unsignedTx.addOutput(new bsv.Transaction.Output({
            script: buildPublicKeyHashScript(hash160(instance2.bob)),
            satoshis: 1
        }))

        unsignedTx.addOutput(new bsv.Transaction.Output({
            script: buildOpreturnScript(Buffer.from(msg, "utf8").toString("hex")),
            satoshis: 0
        }))
        .change(changeAddress)

        //console.log("UnsignedTX: ", toHex((unsignedTx.outputs[3]).toBufferWriter().toBuffer()))
    
        return Promise.resolve({
            tx: unsignedTx,
            atInputIndex: 0,
            nexts: [
            ]
        })

    });

    



  
    // connect to a signer 
    //await counter.connect(Alice)
    await counter.connect(Bob) 
    //await counter.connect(Me) 
  
    //const balance = 2000 
  
    // contract deployment 
    //const deployTx = await counter.deploy(balance) 


    const { tx: deployTx } = await instance2.methods.alert(
        // the first argument `sig` is replaced by a callback function which will return the needed signature
        (sigResps) => findSig(sigResps, pbkeyBob),
        //Buffer.from(msg, "utf8").toString("hex"),
        outputMsg,
    )



    console.log('Counter deploy tx:', deployTx.id)

} )()

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////