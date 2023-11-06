////////////////////////////////////////////////////////////////////////////////
//Jogar Bob e Alice - DEBUG
////////////////////////////////////////////////////////////////////////////////
import { TicTacToe } from './src/contracts/tictactoe'
import { TestWallet, findSig, bsv, DefaultProvider, SignatureResponse,
    toHex, MethodCallOptions, utxoFromOutput, toByteString, Utils, hash160, Sig, SmartContract, sha256, MethodCallTxBuilder, GorillapoolProvider} from 'scrypt-ts'
import { buildPublicKeyHashScript, SensibleProvider} from 'scrypt-ts'
import { BsvApi } from 'scrypt-ts/dist/client/apis/bsv-api'
    

(async () => {

    await TicTacToe.compile()

    // Read the private key from the .env file.
    // The default private key inside the .env file is meant to be used for the Bitcoin testnet.
    // See https://scrypt.io/docs/bitcoin-basics/bsv/#private-keys
    //const privateKey = bsv.PrivateKey.fromWIF(process.env.PRIVATE_KEY)
    //const privateKey = bsv.PrivateKey.fromWIF("cRrpFeyrAHW62H8sSRZ28XwMhqqFjRBe2kkVHZ7b4r3SYrJyQ47D")
    const privateKey2 = bsv.PrivateKey.fromHex("ccbf6b06cb35e102f42ecfaa5de55ab6cd35431b95f6ee4fd5199ad90943c5cf", bsv.Networks.testnet)
    const privateKey3 = bsv.PrivateKey.fromHex("79342a4c317817a80a298fe116147a74e4e90912a4f321e588a4db67204e29b0", bsv.Networks.testnet)
  

    // Prepare signer.
    // See https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#prepare-a-signer-and-provider
    const Alice = new TestWallet(privateKey2, new DefaultProvider({network: bsv.Networks.testnet}))
    //const Alice = new TestWallet(privateKey2, new SensibleProvider(bsv.Networks.testnet,))
    //const Alice = new TestWallet(privateKey2, new GorillapoolProvider())
    const Bob = new TestWallet(privateKey3, new DefaultProvider({network: bsv.Networks.testnet}))
    //const Me = new TestWallet(privateKey, new DefaultProvider({network: bsv.Networks.testnet}))

    //Segunda Forma de Carregar a Transação - GetTX

    let provDf = new DefaultProvider({network: bsv.Networks.testnet})

    //let provDf = new GorillapoolProvider()

    await provDf.connect()
    let tx3 = new bsv.Transaction

    tx3 = await provDf.getTransaction('2f5ae6519cc0d81e50414ae0bf48fa947ea2fb79f6eabb83331b9fa148d337bf');

    let placeN = 1n;

    console.log('Test TX3: ', tx3.id)

    //Para carregar o SC que será executado
    let instance2 = TicTacToe.fromTx(tx3, 0)

    instance2.is_alice_turn ? await instance2.connect(Alice) : await instance2.connect(Bob);
    instance2.is_alice_turn ? console.log('Alice Turn') : console.log('Bob Turn');

////////////////////////////////////////////////////////////////
// Jogo
////////////////////////////////////////////////////////////////

    let pbkeyAlice = bsv.PublicKey.fromPrivateKey(privateKey2)
    let pbkeyBob = bsv.PublicKey.fromPrivateKey(privateKey3)

    let pvtkey = instance2.is_alice_turn ? privateKey2 : privateKey3;
    let pbkey = instance2.is_alice_turn ? pbkeyAlice : pbkeyBob;

    //https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#method-with-signatures

    //const balance = 2000
    const balance = instance2.balance
    const nextInstance = instance2.next()
    
    //Para fazer o updata, devemos verificar todos os estados alterados na transação seguinte.
    // devemos realizar as alterações e então aplicamos a construção do buildStateOutput

    //console.log('Outputs Before 0: ', sha256(nextInstance.buildStateOutput(2000n).substring(22)))
    //this.board[Number(n)] = play;   // Number() converts a bigint to a number
    let play = instance2.is_alice_turn ? TicTacToe.ALICE : TicTacToe.BOB;

    nextInstance.board[Number(placeN)] = play;   // Number() converts a bigint to a number
    //console.log('Outputs Before 1: ', sha256(nextInstance.buildStateOutput(2000n).substring(22)))
    
    //this.is_alice_turn = !this.is_alice_turn;
    nextInstance.is_alice_turn = !nextInstance.is_alice_turn;

    let gameState = 0;

    //if (nextInstance.won(play) || nextInstance.full())
    //{
    instance2.bindTxBuilder('move', async function () {

            const changeAddress = bsv.Address.fromPrivateKey(pvtkey)
       
            const unsignedTx: bsv.Transaction = new bsv.Transaction()
            //.addInputFromPrevTx(current.from?.tx as bsv.Transaction, current.from?.outputIndex)
            .addInputFromPrevTx(tx3, 0)
            //.from(options.utxos);

            if (nextInstance.won(play)) 
            {    
                gameState = 1;
                unsignedTx.addOutput(new bsv.Transaction.Output({
                    script: instance2.is_alice_turn ? 
                        buildPublicKeyHashScript(hash160(instance2.alice)) : 
                        buildPublicKeyHashScript(hash160(instance2.bob)),
                    satoshis: balance
                }))
                .change(changeAddress)
            
                return Promise.resolve({
                    tx: unsignedTx,
                    atInputIndex: 0,
                    nexts: [
                    ]
                })
            }

            else if (nextInstance.full())
            {
                gameState = 2;
                const halfAmount = balance / 2
        
                unsignedTx.addOutput(new bsv.Transaction.Output({
                    script: buildPublicKeyHashScript(hash160(instance2.alice)),
                    satoshis: halfAmount
                }))
                .addOutput(new bsv.Transaction.Output({
                    script: buildPublicKeyHashScript(hash160(instance2.bob)),
                    satoshis: halfAmount
                }))
                .change(changeAddress)
        
                return Promise.resolve({
                    tx: unsignedTx,
                    atInputIndex: 0,
                    nexts: [
                    ]
                })
            }

            else
            {
                unsignedTx.addOutput(new bsv.Transaction.Output({
                    script: nextInstance.lockingScript,
                    satoshis: balance,
                }))
                .change(changeAddress)
            
                return Promise.resolve({
                    tx: unsignedTx,
                    atInputIndex: 0,
                    nexts: [
                    ]
                });              
            }
    });
    

    const { tx: callTx } = await instance2.methods.move(

        placeN,
        // the first argument `sig` is replaced by a callback function which will return the needed signature
        (sigResps) => findSig(sigResps, pbkey),
    )

    instance2.is_alice_turn ? 
        console.log('Alice got Place:', placeN) : 
        console.log('Bob got Place:', placeN);

    if(gameState == 1) 
        console.log('And won the game!!!')   
    else if(gameState == 2) 
        console.log('And game matched!!!')

    console.log('TXID New State: ', callTx.id)     
        
    //console.log('Table: ', nextInstance.board)
    console.log('Table: \n', 
        nextInstance.board[0], nextInstance.board[1], nextInstance.board[2], '\n',
        nextInstance.board[3], nextInstance.board[4], nextInstance.board[5], '\n',
        nextInstance.board[6], nextInstance.board[7], nextInstance.board[8] )
    
})()          