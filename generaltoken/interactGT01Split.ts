////////////////////////////////////////////////////////////////////////////////
// JESUS is the LORD of ALL
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//Split Token Interaction
////////////////////////////////////////////////////////////////////////////////
import { GeneralToken } from './src/contracts/generaltoken'
import { TestWallet, findSig, bsv, DefaultProvider, hash160, ByteString, toHex, PubKey, hash256, sha256} from 'scrypt-ts'
import { buildPublicKeyHashScript} from 'scrypt-ts'

////////////////////////////////////////////////////////////////////////////////
// JESUS is the LORD of ALL
////////////////////////////////////////////////////////////////////////////////

(async () => {

    await GeneralToken.compile()

    //Split 1
    const privateKey3 = bsv.PrivateKey.fromHex("ccbf6b06cb35e102f42ecfaa5de55ab6cd35431b95f6ee4fd5199ad90943c5cf", bsv.Networks.testnet)
    const privateKey2 = bsv.PrivateKey.fromHex('79342a4c317817a80a298fe116147a74e4e90912a4f321e588a4db67204e29b0', bsv.Networks.testnet)

    //Split 2
    //const privateKey2 = bsv.PrivateKey.fromHex("ccbf6b06cb35e102f42ecfaa5de55ab6cd35431b95f6ee4fd5199ad90943c5cf", bsv.Networks.testnet)
    //const privateKey3 = bsv.PrivateKey.fromHex('79342a4c317817a80a298fe116147a74e4e90912a4f321e588a4db67204e29b0', bsv.Networks.testnet)

    // Prepare signer.
    // See https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#prepare-a-signer-and-provider
    const Alice = new TestWallet(privateKey2, new DefaultProvider({network: bsv.Networks.testnet}))
    const Bob = new TestWallet(privateKey3, new DefaultProvider({network: bsv.Networks.testnet}))

    let provDf = new DefaultProvider({network: bsv.Networks.testnet})

    await provDf.connect()
    let tx3 = new bsv.Transaction

    tx3 = await provDf.getTransaction('efd4a5f6f78f45cbc1b30f4e1e2cf9621712b3cead26ac058e2bad84da11243d')

    let finish = false

    console.log('TXID Current State: ', tx3.id)

    let posNew1 = 0 // Output Index of the Contract in the Current State TX
    let instance2 = GeneralToken.fromTx(tx3, posNew1)
    //Inform to the system the right output index of the contract and its sequence
    tx3.pvTxIdx(tx3.id, posNew1, sha256(tx3.outputs[posNew1].script.toHex()))


    let pbkeyAlice = bsv.PublicKey.fromPrivateKey(privateKey2)
    let pbkeyBob = bsv.PublicKey.fromPrivateKey(privateKey3)

    //let numberOfSendTokens = 50n
    //let numberOfSendTokens = 25n
    let numberOfSendTokens = 3n
    //let toNewOwner = PubKey(toHex(pbkeyBob))
    let toNewOwner = PubKey(toHex(pbkeyAlice))

////////////////////////////////////////////////////////////////
// Jogo
////////////////////////////////////////////////////////////////

    let pvtkey = privateKey2;
    let pbkey = pbkeyAlice;

    //https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#method-with-signatures

    const balance = instance2.balance
    const nextInstance = instance2.next()
    //let price = 3000n

    if(!finish)
    {
        //nextInstance.price = 2000n
    }
   
    await instance2.connect(Alice)

    instance2.bindTxBuilder('split', async function () {

            const changeAddress = bsv.Address.fromPrivateKey(pvtkey)
       
            const unsignedTx: bsv.Transaction = new bsv.Transaction()
            .addInputFromPrevTx(tx3, posNew1)
            
            if(nextInstance.thisSupply == numberOfSendTokens)
            {
                nextInstance.alice = toNewOwner

                unsignedTx.addOutput(new bsv.Transaction.Output({
                    script: nextInstance.lockingScript,
                    satoshis: balance,
                })).change(changeAddress)
            }
            else
            {                               
                nextInstance.thisSupply = nextInstance.thisSupply - numberOfSendTokens

                unsignedTx.addOutput(new bsv.Transaction.Output({
                    script: nextInstance.lockingScript,
                    satoshis: balance,
                }))
                
                nextInstance.alice = toNewOwner
                nextInstance.thisSupply = numberOfSendTokens

                unsignedTx.addOutput(new bsv.Transaction.Output({
                    script: nextInstance.lockingScript,
                    satoshis: balance,
                })).change(changeAddress)
            }            
                
            return Promise.resolve({
                tx: unsignedTx,
                atInputIndex: 0,
                nexts: [
                ]
            });              
    });
    
    const { tx: callTx } = await instance2.methods.split(

        // the first argument `sig` is replaced by a callback function which will return the needed signature
        (sigResps) => findSig(sigResps, pbkey),
        numberOfSendTokens,
        toNewOwner//PubKey(toHex(pbkeyBob))
    )
    console.log('TXID New State: ', callTx.id)     
        
})()          


