////////////////////////////////////////////////////////////
//Criar CHAVES
////////////////////////////////////////////////////////////
import {PubKeyHash, bsv, PubKey, toHex, TestWallet, DefaultProvider, WhatsonchainProvider} from 'scrypt-ts'

(async () => { 

    let privateKeyTN = bsv.PrivateKey.fromHex("79342a4c317817a80a298fe116147a74e4e90912a4f321e588a4db67204e29b0", bsv.Networks.testnet)
    let privateKeyMN = bsv.PrivateKey.fromHex("79342a4c317817a80a298fe116147a74e4e90912a4f321e588a4db67204e29b0", bsv.Networks.mainnet)
    
    const pbTN = bsv.PublicKey.fromPrivateKey(privateKeyTN)
    const pbMN = bsv.PublicKey.fromPrivateKey(privateKeyMN)


    // Prepare signer.
    // See https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#prepare-a-signer-and-provider
    const UnserTN = new TestWallet(privateKeyTN, new DefaultProvider({network: bsv.Networks.testnet}))
    const UnserMN = new TestWallet(privateKeyMN, new DefaultProvider({network: bsv.Networks.mainnet}))

    const addTN = await UnserTN.getDefaultAddress();
    const addMN = await UnserMN.getDefaultAddress();
     
     console.log('Address TN:', UnserTN.addresses[0])
     console.log('Address MN:', UnserMN.addresses[0])
     
     console.log('Balance TN:', await UnserTN.getBalance(addTN))
     console.log('Balance MN:', await UnserMN.getBalance(addMN))


     console.log('Address TN:', addTN.toString())
     console.log('Address MN:', addMN.toString(),     privateKeyMN.compressed  ) 

     console.log('PB Key TN:', pbTN.toString())
     console.log('PB Key MN:', pbMN.toString(),     privateKeyMN.compressed  ) 

  
} )()

/*import { Helloworld } from './src/contracts/helloworld'
import {
    bsv,
    TestWallet,
    DefaultProvider,
    sha256,
    toByteString,
} from 'scrypt-ts'

import * as dotenv from 'dotenv'

// Load the .env file
dotenv.config()

// Read the private key from the .env file.
// The default private key inside the .env file is meant to be used for the Bitcoin testnet.
// See https://scrypt.io/docs/bitcoin-basics/bsv/#private-keys
const privateKey = bsv.PrivateKey.fromWIF(process.env.PRIVATE_KEY || '')

// Prepare signer.
// See https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#prepare-a-signer-and-provider
const signer = new TestWallet(
    privateKey,
    new DefaultProvider({
        network: bsv.Networks.testnet,
    })
)

async function main() {
    await Helloworld.compile()

    // TODO: Adjust the amount of satoshis locked in the smart contract:
    const amount = 1

    const instance = new Helloworld(
        // TODO: Adjust constructor parameter values:
        sha256(toByteString('hello world', true))
    )

    // Connect to a signer.
    await instance.connect(signer)

    // Contract deployment.
    const deployTx = await instance.deploy(amount)
    console.log(`Helloworld contract deployed: ${deployTx.id}`)
}

main()
*/
