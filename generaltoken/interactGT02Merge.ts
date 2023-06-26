////////////////////////////////////////////////////////////////////////////////
// JESUS is the LORD of ALL
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//Merge Token Interaction
////////////////////////////////////////////////////////////////////////////////
import { GeneralToken } from './src/contracts/generaltoken'
import { TestWallet, findSig, bsv, DefaultProvider, hash160, ByteString, toHex, sha256, MethodCallOptions} from 'scrypt-ts'
import { buildPublicKeyHashScript, ContractTransaction, SmartContract} from 'scrypt-ts'

////////////////////////////////////////////////////////////////////////////////
// JESUS is the LORD of ALL
////////////////////////////////////////////////////////////////////////////////

(async () => {

    await GeneralToken.compile()

    //const privateKey2 = bsv.PrivateKey.fromHex("ccbf6b06cb35e102f42ecfaa5de55ab6cd35431b95f6ee4fd5199ad90943c5cf", bsv.Networks.testnet)
    const privateKey2 = bsv.PrivateKey.fromHex('79342a4c317817a80a298fe116147a74e4e90912a4f321e588a4db67204e29b0', bsv.Networks.testnet)
  
    // Prepare signer.
    // See https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#prepare-a-signer-and-provider
    const Alice = new TestWallet(privateKey2, new DefaultProvider({network: bsv.Networks.testnet}))

    let provDf = new DefaultProvider({network: bsv.Networks.testnet})

    await provDf.connect()
    let tx3 = new bsv.Transaction
    let tx4 = new bsv.Transaction

    //Ambos os tokens precisam ter o mesmo dono e mesmo DADO
    tx3 = await provDf.getTransaction('0c0a6de8aa406160d0f7ee8995f48c017511d9d63c0efb716e9c94ce35734602')
    tx4 = await provDf.getTransaction('0c0a6de8aa406160d0f7ee8995f48c017511d9d63c0efb716e9c94ce35734602')

    console.log('TXID Current State: ', tx3.id)

    let posNew1 = 0 // Output Index of the Contract in the Current State TX
    let instance2 = GeneralToken.fromTx(tx3, posNew1)
    //Inform to the system the right output index of the contract and its sequence
    tx3.pvTxIdx(tx3.id, posNew1, sha256(tx3.outputs[posNew1].script.toHex()))
 
    let posNew2 = 1 // Output Index of the Contract in the Current State TX
    let instance3 = GeneralToken.fromTx(tx4, posNew2)
    //Inform to the system the right output index of the contract and its sequence
    tx3.pvTxIdx(tx4.id, posNew2, sha256(tx4.outputs[posNew2].script.toHex()))

    let pbkeyAlice = bsv.PublicKey.fromPrivateKey(privateKey2)

    let pvtkey = privateKey2;
    let pbkey = pbkeyAlice;

    //https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#method-with-signatures

    const balance = instance2.balance
    const nextInstance = instance2.next()
   
    await instance2.connect(Alice)

    await instance3.connect(Alice)
    const nextInstance3 = instance3.next()
 
    //Theory: https://docs.scrypt.io/advanced/how-to-call-multiple-contracts/

    instance2.bindTxBuilder(
        'mergeTokens',
        (
            current: GeneralToken,
            options: MethodCallOptions<GeneralToken>,
            ...args: any
        ): Promise<ContractTransaction> => {
            // create the next instance from the current

            const unsignedTx: bsv.Transaction = new bsv.Transaction()
            .addInputFromPrevTx(tx3, posNew1)

            nextInstance.thisSupply = nextInstance.thisSupply + nextInstance3.thisSupply 

            unsignedTx.addOutput(new bsv.Transaction.Output({
                script: nextInstance.lockingScript,
                satoshis: balance,
            }))
        
            return Promise.resolve({
                tx: unsignedTx,
                atInputIndex: 0,
                nexts: [
                ]
            })       
        }
    )

    instance3.bindTxBuilder(
        'mergeTokens',
        (
            current: GeneralToken,
            options: MethodCallOptions<GeneralToken>,
            ...args: any
        ): Promise<ContractTransaction> => {
            if (options.partialContractTx) {

                const changeAddress = bsv.Address.fromPrivateKey(pvtkey)
       
                const unsignedTx = options.partialContractTx.tx

                unsignedTx.addInputFromPrevTx(tx4, posNew2)

                unsignedTx.addOutput(new bsv.Transaction.Output({
                    script: buildPublicKeyHashScript(hash160(instance2.alice)),
                    satoshis: balance
                }))
                .change(changeAddress)
           
                return Promise.resolve({
                    tx: unsignedTx,
                    atInputIndex: 1,
                    nexts: [
                    ]
                })   
            }

            throw new Error('no partialContractTx found')
        }
    )

    console.log('Number of Units in Tokens 2', instance2.thisSupply)
    console.log('Number of Units in Tokens 1', instance3.thisSupply)

    const partialTx = await instance2.methods.mergeTokens(
        (sigResps) => findSig(sigResps, pbkey),
        instance2.thisSupply,
        instance3.thisSupply,
        { multiContractCall: true, } as MethodCallOptions<GeneralToken>
    )

    const finalTx = await instance3.methods.mergeTokens(
        (sigResps) => findSig(sigResps, pbkey),
        instance2.thisSupply,
        instance3.thisSupply,
        {
            multiContractCall: true,
            partialContractTx: partialTx,
        } as MethodCallOptions<GeneralToken>,
    )

    const { tx: callTx, nexts } = await SmartContract.multiContractCall(
        finalTx,
        Alice,
    )

    console.log('TXID New State: ', callTx.id)             
})()          


