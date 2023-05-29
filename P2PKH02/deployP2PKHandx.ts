////////////////////////////////////////////////////////////////////////////////
//Criar o SC
////////////////////////////////////////////////////////////////////////////////
import { P2PKHandX } from './src/contracts/p2pkhandx'
import { getDefaultSigner } from './tests/utils/txHelper'
import { toByteString, sha256, PubKeyHash, Ripemd160, PubKey, bsv, hash160,
            TestWallet, DefaultProvider} from 'scrypt-ts'

(async () => {

    const privateKey = bsv.PrivateKey.fromHex("79342a4c317817a80a298fe116147a74e4e90912a4f321e588a4db67204e29b0", bsv.Networks.testnet)   
    let Alice = new TestWallet(privateKey, new DefaultProvider({network: bsv.Networks.testnet}))

    //let pbKHash = PubKeyHash('57a4882008bac913efb3bd470343a73c6bd1acc7')
    let pbKHash = PubKeyHash(hash160(bsv.PublicKey.fromPrivateKey(privateKey).toHex()))

    const message = toByteString('hello world', true)
    await P2PKHandX.compile()

    //PubKeyHash
    const instance = new P2PKHandX(pbKHash, sha256(message))

    // connect to a signer
    //await instance.connect(getDefaultSigner())
    await instance.connect(Alice)

    // deploy the contract and lock up 42 satoshis in it
    const deployTx = await instance.deploy(100)
    console.log('P2PKH contract deployed: ', deployTx.id)

})()
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////