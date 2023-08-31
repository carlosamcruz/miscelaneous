////////////////////////////////////////////////////////////////////////////////
//Interagir com o Contrato
////////////////////////////////////////////////////////////////////////////////
import { P2PKHMULT } from './src/contracts/p2pkhMult'
import { getDefaultSigner, getDummySigner } from './tests/utils/txHelper'
import { MethodCallOptions, toHex, findSig, toByteString, sha256, utxoFromOutput, bsv, TestWallet, DefaultProvider, Sig, PubKey, findSigs } from 'scrypt-ts'
import { PubKeyHash, Ripemd160, FixedArray } from 'scrypt-ts'


(async () => {


    const privateKey = bsv.PrivateKey.fromHex("79342a4c317817a80a298fe116147a74e4e90912a4f321e588a4db67204e29b0", bsv.Networks.testnet) 
    const privateKey2 = bsv.PrivateKey.fromHex('a9342a4c317817a80a296fe116f47a74e4e90912a4f321e588a4db67204e29b0', bsv.Networks.testnet)

    //chave 2 errada
    //const privateKey2 = bsv.PrivateKey.fromHex('a9342a4c317817a80a296fe116f47a74e4e90912a4f321e588a4db67204e29b1', bsv.Networks.testnet)
    //const privateKey2 = bsv.PrivateKey.fromHex('0000000000000000000000000000000000000000000000000000000000000000', bsv.Networks.testnet)  

    //Multi PVT Keys in the Signeer
    //OBS: não é possível enviar um quantidade menor de chaves do que o script requer
    let privateKeys: bsv.PrivateKey[] = [privateKey, privateKey2]
    //let privateKeys: bsv.PrivateKey[] = [privateKey]

    await P2PKHMULT.compile()

    //Segunda Forma de Carregar a Transação - GetTX
    let provDf = new DefaultProvider({network: bsv.Networks.testnet})

    let Bob2 = new TestWallet(privateKeys, provDf)

    await provDf.connect()
    let tx3 = new bsv.Transaction
    tx3 = await provDf.getTransaction('ecd9436d999007ef569445024b071e4f897d4c7215a08ccb41002567bc26e890')

    console.log('Test TX3: ', tx3.id)

    //Para carregar o SC que será executado
    const instance2 = P2PKHMULT.fromTx(tx3, 0)

    // connect to a signer
    await instance2.connect(Bob2)

    let pbkey = bsv.PublicKey.fromPrivateKey(privateKey)
    let pbkey2 = bsv.PublicKey.fromPrivateKey(privateKey2)

    //OBS: não é possível enviar um quantidade menor de chaves do que o script requer
    let publicKeys: FixedArray<PubKey, 2> = [PubKey(toHex(pbkey)), PubKey(toHex(pbkey2))]
    //let publicKeys: FixedArray<PubKey, 1> = [PubKey(toHex(pbkey))]
    let pubKeys: FixedArray<bsv.PublicKey, 2> = [pbkey, pbkey2]
    //let pubKeys: FixedArray<bsv.PublicKey, 1> = [pbkey]

    //https://github.com/sCrypt-Inc/boilerplate/blob/master/tests/local/multiSig.test.ts

    const { tx: callTx } = await instance2.methods.unlock(
        // the first argument `sig` is replaced by a callback function which will return the needed signature
        (sigResps) => findSigs(sigResps, pubKeys),

        // the second argument is still the value of `pubkey`
        publicKeys,

        //Esta parte é necessaria, não sei porque, mas é :D
        {
            fromUTXO: utxoFromOutput(tx3, 0),
            pubKeyOrAddrToSign: pubKeys
        } as MethodCallOptions<P2PKHMULT>
    );

    console.log('P2PKH MultiSig contract `unlock` called: ', callTx.id)
})()

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////