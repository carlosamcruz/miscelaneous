////////////////////////////////////////////////////////////////////////////////
//Spend the Output
////////////////////////////////////////////////////////////////////////////////
import { Helloworld } from './src/contracts/helloworld'
import { toByteString, sha256, utxoFromOutput, bsv, SensibleProvider, 
    WhatsonchainProvider, Tx, DefaultProvider, TestWallet } from 'scrypt-ts'

(async () => {

    const privateKey = bsv.PrivateKey.fromHex("79342a4c317817a80a298fe116147a74e4e90912a4f321e588a4db67204e29b0", bsv.Networks.testnet)
    const Alice = new TestWallet(privateKey, new DefaultProvider({network: bsv.Networks.testnet}))

    const message = toByteString('hello world', true)

    await Helloworld.compile()

    let provDf = new DefaultProvider({network: bsv.Networks.testnet})

    await provDf.connect()

    let tx = new bsv.Transaction
    tx = await provDf.getTransaction('d47d14e332a0235bc15b4405c9495952c577f526ebbb4d165bdb343bb12aad1e')

    console.log('Test TX3: ', tx.id)

    const instance = Helloworld.fromTx(tx, 0)

    await instance.connect(Alice)

    const { tx: callTx } = await instance.methods.unlock(message)
    console.log('Helloworld contract `unlock` called: ', callTx.id)

})()


/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
