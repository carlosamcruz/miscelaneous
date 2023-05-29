////////////////////////////////////////////////////////////////////////////////
//Spend the Output
////////////////////////////////////////////////////////////////////////////////
import { P2PKH } from './src/contracts/p2pkh'
import { getDefaultSigner } from './tests/utils/txHelper'
import { MethodCallOptions, toHex, findSig, toByteString, sha256, utxoFromOutput, bsv, WhatsonchainProvider, DefaultProvider, Sig, PubKey } from 'scrypt-ts'
import { TestWallet, PubKeyHash, hash160 } from 'scrypt-ts'

(async () => {

    const privateKey = bsv.PrivateKey.fromHex("79342a4c317817a80a298fe116147a74e4e90912a4f321e588a4db67204e29b0", bsv.Networks.testnet)   
  
    // Prepare signer.
    // See https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#prepare-a-signer-and-provider


    //let pbKHash = PubKeyHash('57a4882008bac913efb3bd470343a73c6bd1acc7')
    //let pbKHash = PubKeyHash(bsv.PublicKey.fromPrivateKey(privateKey).toAddress)

    let pbKHash = PubKeyHash(hash160(bsv.PublicKey.fromPrivateKey(privateKey).toHex()))


    await P2PKH.compile()

    //Segunda Forma de Carregar a Transação - GetTX
    let provDf = new DefaultProvider({network: bsv.Networks.testnet})

    let Alice = new TestWallet(privateKey, provDf)

    await provDf.connect()
    let tx3 = new bsv.Transaction
    tx3 = await provDf.getTransaction('365671d0f2ac688917077ed6c0faf98d59d696e733586563b1f20128b0ae35fc')

    console.log('Test TX3: ', tx3.id)

    //Para carregar o SC que será executado
    const instance2 = P2PKH.fromTx(tx3, 0)

    // connect to a signer
    await instance2.connect(Alice)

    //let publicKey = PubKey('03b54a083254daa9ae7cd0edd5690daef9302253e9d6d390f71bbde5a3ed359702')
    //let pbkey = bsv.PublicKey.fromString('03b54a083254daa9ae7cd0edd5690daef9302253e9d6d390f71bbde5a3ed359702')

    let pbkey = bsv.PublicKey.fromPrivateKey(privateKey)

    //https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#method-with-signatures

    // call
    const { tx: callTx } = await instance2.methods.unlock(
        // the first argument `sig` is replaced by a callback function which will return the needed signature
        (sigResps) => findSig(sigResps, pbkey),

        // the second argument is still the value of `pubkey`
        PubKey(toHex(pbkey))
    );

    console.log('P2PKH contract `unlock` called: ', callTx.id)

})()

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
