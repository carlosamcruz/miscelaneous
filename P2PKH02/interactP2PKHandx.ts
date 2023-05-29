////////////////////////////////////////////////////////////////////////////////
//Interagir com o Contrato
////////////////////////////////////////////////////////////////////////////////
import { P2PKHandX } from './src/contracts/p2pkhandx'
import { getDefaultSigner } from './tests/utils/txHelper'
import { MethodCallOptions, toHex, findSig, toByteString, sha256, utxoFromOutput, bsv, TestWallet, DefaultProvider, Sig, PubKey } from 'scrypt-ts'
//import { PubKeyHash, Ripemd160, PubKey, Sig } from 'scrypt-ts'


(async () => {


    //Test Or
    //const privateKey = bsv.PrivateKey.fromHex("0b201f5c35930d255c29fbfce7c493d6eb327245c3ed81b7fd75088d6fc9be5b", bsv.Networks.testnet)
    //Original
    const privateKey = bsv.PrivateKey.fromHex("79342a4c317817a80a298fe116147a74e4e90912a4f321e588a4db67204e29b0", bsv.Networks.testnet)   
    let Alice = new TestWallet(privateKey, new DefaultProvider({network: bsv.Networks.testnet}))


    await P2PKHandX.compile()

    const message = toByteString('hello world 2', true)
    //const message = toByteString('hello world', true)


    //Segunda Forma de Carregar a Transação - GetTX
    let provDf = new DefaultProvider({network: bsv.Networks.testnet})

    await provDf.connect()
    let tx3 = new bsv.Transaction
    tx3 = await provDf.getTransaction('db7d91ba7f33b9ddfb76b5d79d50539cc54573da0d388ba600c61f2b676a7025')

    console.log('Test TX3: ', tx3.id)

    //Para carregar o SC que será executado
    const instance2 = P2PKHandX.fromTx(tx3, 0)

    // connect to a signer
    //await instance2.connect(getDefaultSigner())
    await instance2.connect(Alice)

    //let publicKey = PubKey('03b54a083254daa9ae7cd0edd5690daef9302253e9d6d390f71bbde5a3ed359702')
    let pbkeyOR = bsv.PublicKey.fromString('03c0e0bf0bbcdc53be9542359aeb1dde7c6289743b7b3460c12e2d57a478c6e489')//correta
    //let pbkeyOR = bsv.PublicKey.fromString('03b54a083254daa9ae7cd0edd5690daef9302253e9d6d390f71bbde5a3ed359702')//incorreta
    let pbkey = bsv.PublicKey.fromPrivateKey(privateKey)

    //https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#method-with-signatures

    // call
    const { tx: callTx } = await instance2.methods.unlock(
        // the first argument `sig` is replaced by a callback function which will return the needed signature
        (sigResps) => findSig(sigResps, pbkey),

        // the second argument is still the value of `pubkey`
        PubKey(toHex(pbkey)),
        //PubKey(toHex(pbkeyOR)),
        message
    );

    console.log('P2PKH contract `unlock` called: ', callTx.id)

})()

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////