////////////////////////////////////////////////////////////////////////////////
// JESUS is the LORD of ALL
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//Buying Token Interaction
////////////////////////////////////////////////////////////////////////////////
import { GeneralToken } from './src/contracts/generaltoken'
import { TestWallet, findSig, bsv, DefaultProvider, hash160, ByteString, toHex, PubKey, hash256} from 'scrypt-ts'
import { buildPublicKeyHashScript, sha256} from 'scrypt-ts'

////////////////////////////////////////////////////////////////////////////////
// JESUS is the LORD of ALL
////////////////////////////////////////////////////////////////////////////////

(async () => {


    await GeneralToken.compile()

    //const privateKey2 = bsv.PrivateKey.fromHex("ccbf6b06cb35e102f42ecfaa5de55ab6cd35431b95f6ee4fd5199ad90943c5cf", bsv.Networks.testnet)
    const privateKey2 = bsv.PrivateKey.fromHex('79342a4c317817a80a298fe116147a74e4e90912a4f321e588a4db67204e29b0', bsv.Networks.testnet)
    //const privateKey2 = bsv.PrivateKey.fromHex('b8b9a38e0bb59b09abf02f1e616d16fe060a74be3957519f64505ca090938f95', bsv.Networks.testnet)
  
    // Prepare signer.
    const Alice = new TestWallet(privateKey2, new DefaultProvider({network: bsv.Networks.testnet}))

    let provDf = new DefaultProvider({network: bsv.Networks.testnet})

    await provDf.connect()
    let tx3 = new bsv.Transaction

    tx3 = await provDf.getTransaction('33ce1a7f5bb13add530866b92549563ce2413da48c021048bacfa55b38648689')

    console.log('TXID Current State: ', tx3.id)

    let posNew1 = 0 // Output Index of the Contract in the Current State TX
    let instance2 = GeneralToken.fromTx(tx3, posNew1)
    //Inform to the system the right output index of the contract and its sequence
    tx3.pvTxIdx(tx3.id, posNew1, sha256(tx3.outputs[posNew1].script.toHex()))

    let pbkeyAlice = bsv.PublicKey.fromPrivateKey(privateKey2)

    let pvtkey = privateKey2;
    let pbkey = pbkeyAlice;

    const balance = instance2.balance
    const nextInstance = instance2.next()
    let price = 3000n

    nextInstance.alice = PubKey(toHex(pbkey))
    nextInstance.price = 0n
    nextInstance.sell = false
    
    await instance2.connect(Alice)

    instance2.bindTxBuilder('buying', async function () {

            const changeAddress = bsv.Address.fromPrivateKey(pvtkey)
       
            const unsignedTx: bsv.Transaction = new bsv.Transaction()
            .addInputFromPrevTx(tx3, 0)  

            unsignedTx.addOutput(new bsv.Transaction.Output({
                script: nextInstance.lockingScript,
                satoshis: balance,
            })).addOutput(new bsv.Transaction.Output({
                script: buildPublicKeyHashScript(hash160(instance2.alice)),
                satoshis: Number(price)
            })).change(changeAddress)
        
            return Promise.resolve({
                tx: unsignedTx,
                atInputIndex: 0,
                nexts: [
                ]
            });      
    });
    
    const { tx: callTx } = await instance2.methods.buying(
        // the first argument `sig` is replaced by a callback function which will return the needed signature
        PubKey(toHex(pbkey)),
        price,
    )
    console.log('TXID New State: ', callTx.id)     
})()          


