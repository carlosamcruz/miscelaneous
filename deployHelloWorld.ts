////////////////////////////////////////////////////////////////////////////////
//Criar o SC
////////////////////////////////////////////////////////////////////////////////
import { Helloworld } from './src/contracts/helloworld'
import { toByteString, sha256, bsv, TestWallet, DefaultProvider, WhatsonchainProvider } from 'scrypt-ts'

(async () => {

    const privateKey = bsv.PrivateKey.fromHex("79342a4c317817a80a298fe116147a74e4e90912a4f321e588a4db67204e29b0", bsv.Networks.testnet)   
  
    // Prepare signer.
    // See https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#prepare-a-signer-and-provider

    let Alice = new TestWallet(privateKey, new DefaultProvider({network: bsv.Networks.testnet}))
    const message = toByteString('hello world', true)

    await Helloworld.compile()
    const instance = new Helloworld(sha256(message))

    // connect to a signer
    await instance.connect(Alice)

    const deployTx = await instance.deploy(100)
    console.log('Helloworld contract deployed: ', deployTx.id)

})()

