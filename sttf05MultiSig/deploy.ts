////////////////////////////////////////////////////////////////////////////////
//Criar o SC
////////////////////////////////////////////////////////////////////////////////
import { P2PKHMULT } from './src/contracts/p2pkhMult'
import { getDefaultSigner } from './tests/utils/txHelper'
import { toByteString, sha256, PubKeyHash, Ripemd160, PubKey, bsv, hash160,
            TestWallet, DefaultProvider, FixedArray} from 'scrypt-ts'

(async () => {

    const privateKey = bsv.PrivateKey.fromHex("79342a4c317817a80a298fe116147a74e4e90912a4f321e588a4db67204e29b0", bsv.Networks.testnet) 
    const privateKey2 = bsv.PrivateKey.fromHex('a9342a4c317817a80a296fe116f47a74e4e90912a4f321e588a4db67204e29b0', bsv.Networks.testnet)
    
    let Alice = new TestWallet(privateKey, new DefaultProvider({network: bsv.Networks.testnet}))

    let Bob = new TestWallet(privateKey2, new DefaultProvider({network: bsv.Networks.testnet}))


    //let pbKHash = PubKeyHash('57a4882008bac913efb3bd470343a73c6bd1acc7')
    let pbKHash = PubKeyHash(hash160(bsv.PublicKey.fromPrivateKey(privateKey).toHex()))
    let pbKHash2 = PubKeyHash(hash160(bsv.PublicKey.fromPrivateKey(privateKey2).toHex()))

    let pubKeyHashes: FixedArray<PubKeyHash, 2> = [pbKHash, pbKHash2]

    //const message = toByteString('hello world', true)
    await P2PKHMULT.compile()

    //PubKeyHash
    const instance = new P2PKHMULT(pubKeyHashes)

    // connect to a signer
    //await instance.connect(getDefaultSigner())
    await instance.connect(Alice)

    // deploy the contract and lock up 42 satoshis in it
    const deployTx = await instance.deploy(100)
    console.log('P2PKH contract deployed: ', deployTx.id)

})()
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////