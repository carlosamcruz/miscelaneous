////////////////////////////////////////////////////////////////////////////////
// JESUS is the LORD of ALL
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//Sell - Cancel Order Token Interaction
////////////////////////////////////////////////////////////////////////////////
import { GeneralToken } from './src/contracts/generaltoken'
import { TestWallet, findSig, bsv, DefaultProvider, hash160, ByteString} from 'scrypt-ts'
import { buildPublicKeyHashScript, sha256, PubKey, toHex} from 'scrypt-ts'

////////////////////////////////////////////////////////////////////////////////
// JESUS is the LORD of ALL
////////////////////////////////////////////////////////////////////////////////

(async () => {

    await GeneralToken.compile()

    const privateKey2 = bsv.PrivateKey.fromHex("ccbf6b06cb35e102f42ecfaa5de55ab6cd35431b95f6ee4fd5199ad90943c5cf", bsv.Networks.testnet)
    //const privateKey2 = bsv.PrivateKey.fromHex('79342a4c317817a80a298fe116147a74e4e90912a4f321e588a4db67204e29b0', bsv.Networks.testnet)

    //Preferential Buyer 
    //const privateKeyX = bsv.PrivateKey.fromHex('b8b9a38e0bb59b09abf02f1e616d16fe060a74be3957519f64505ca090938f95', bsv.Networks.testnet)

    //No Preferential Buyer - Owner's PK
    const privateKeyX = bsv.PrivateKey.fromHex('79342a4c317817a80a298fe116147a74e4e90912a4f321e588a4db67204e29b0', bsv.Networks.testnet)
    
  
    // Prepare signer.
    // See https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#prepare-a-signer-and-provider
    const Alice = new TestWallet(privateKey2, new DefaultProvider({network: bsv.Networks.testnet}))

    let provDf = new DefaultProvider({network: bsv.Networks.testnet})

    await provDf.connect()
    let tx3 = new bsv.Transaction

    tx3 = await provDf.getTransaction('36d2cb0a6f849dd6d7073707208fb897838c50c8970545e8174dca783682a19f')

    let orderCancel = false

    console.log('TXID Current State: ', tx3.id)

    let posNew1 = 0 // Output Index of the Contract in the Current State TX
    let instance2 = GeneralToken.fromTx(tx3, posNew1)
    //Inform to the system the right output index of the contract and its sequence
    tx3.pvTxIdx(tx3.id, posNew1, sha256(tx3.outputs[posNew1].script.toHex()))

    let pbkeyAlice = bsv.PublicKey.fromPrivateKey(privateKey2)
    let pbkeyUserX = bsv.PublicKey.fromPrivateKey(privateKeyX)

    let pvtkey = privateKey2;
    let pbkey = pbkeyAlice;

    const balance = instance2.balance
    const nextInstance = instance2.next()

    if(!orderCancel)
    {
        nextInstance.sell = true
        nextInstance.toBuyer = PubKey(toHex(pbkeyUserX))
        nextInstance.price = 2000n
    }
    else
    {
        nextInstance.sell = false
        nextInstance.price = 0n
    }
    
    await instance2.connect(Alice)

    instance2.bindTxBuilder('sellOrder', async function () {

            const changeAddress = bsv.Address.fromPrivateKey(pvtkey)
       
            const unsignedTx: bsv.Transaction = new bsv.Transaction()
            .addInputFromPrevTx(tx3, 0)

            unsignedTx.addOutput(new bsv.Transaction.Output({
                script: nextInstance.lockingScript,
                satoshis: balance,
            }))
            .change(changeAddress)
        
            return Promise.resolve({
                tx: unsignedTx,
                atInputIndex: 0,
                nexts: [
                ]
            });              
    });
    
    const { tx: callTx } = await instance2.methods.sellOrder(

        // the first argument `sig` is replaced by a callback function which will return the needed signature
        (sigResps) => findSig(sigResps, pbkey),
        !orderCancel,
        nextInstance.price,
        PubKey(toHex(pbkeyUserX))
    )
    console.log('TXID New State: ', callTx.id)     
        
})()          


