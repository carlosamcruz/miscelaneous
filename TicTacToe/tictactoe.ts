
import {
    method,
    prop,
    SmartContract,
    hash256,
    assert,
    ByteString,
    SigHash, PubKey, FixedArray, fill, Sig, hash160, toByteString, Utils, sha256
} from 'scrypt-ts'

export class TicTacToe extends SmartContract {
    // Stateful property to store counters value.
    @prop()
    alice: PubKey; // alice's public Key
    @prop()
    bob: PubKey; // bob's public Key
    
    @prop(true)
    is_alice_turn: boolean; // stateful property, it represents whether it is `alice`'s turn to play.
    
    @prop(true)
    board: FixedArray<bigint, 9>; // stateful property, a fixed-size array, it represents the state of every square in the board.
    
    @prop()
    static readonly EMPTY: bigint = 0n; // static property, it means that the a square in the board is empty
    @prop()
    static readonly ALICE: bigint = 1n; // static property, it means that alice places symbol `X` in a square.
    @prop()
    static readonly BOB: bigint = 2n; // static property, it means that bob places symbol `O` in a square.

    constructor(alice: PubKey, bob: PubKey) {
        super(...arguments);
        this.alice = alice;
        this.bob = bob;
        this.is_alice_turn = true;
        this.board = fill(TicTacToe.EMPTY, 9);
    }

    //  play the game by calling move()
    //  @param n which square to place the symbol
    //  @param sig a player's signature
     
    @method()
    //public move(n: bigint, sig: Sig): void {
    public move(n: bigint, sig: Sig) {    

        assert(n >= 0n && n < 9n);

        // check signature `sig`
        let player: PubKey = this.is_alice_turn ? this.alice : this.bob;
        //console.log('Player Pub Key: ', player.toString())
        //console.log('Alice PBKEY: ', this.alice.toString()) 
        //console.log('Bob   PBKEY: ', this.bob.toString()) 


        assert(this.checkSig(sig, player), `checkSig failed, pubkey: ${player}`);

        assert(this.board[Number(n)] === TicTacToe.EMPTY, `board at position ${n} is not empty: ${this.board[Number(n)]}`);

        //console.log('Hash LC Int Ini:', hash256(this.lockingScript.toHex()))
        //console.log('Locking Int Ini:', this.lockingScript.toHex().substring(0, 506))
        //console.log('Hash LC Less Hack Ini:', hash256(this.lockingScript.toHex().substring(506, this.lockingScript.toHex().length)))
        //console.log('Hash Outputs Int Ini:', hash256(this.buildStateOutput(this.ctx.utxo.value) + this.buildChangeOutput()))

        let play = this.is_alice_turn ? TicTacToe.ALICE : TicTacToe.BOB
        // update stateful properties to make the move
        this.board[Number(n)] = play;   // Number() converts a bigint to a number
        
        this.is_alice_turn = !this.is_alice_turn;

        // build the transation outputs
        let outputs = toByteString('');
        if (this.won(play)) {
            outputs = Utils.buildPublicKeyHashOutput(hash160(player), this.ctx.utxo.value);
        }
        else if (this.full()) {
            const halfAmount = this.ctx.utxo.value / 2n;
            const aliceOutput = Utils.buildPublicKeyHashOutput(hash160(this.alice), halfAmount);
            const bobOutput = Utils.buildPublicKeyHashOutput(hash160(this.bob), halfAmount);
            outputs = aliceOutput + bobOutput;
        }
        else {
            // build a output that contains latest contract state.
            //outputs = this.buildStateOutput(amount);

            // build a output that contains latest contract state.
            outputs = this.buildStateOutput(this.ctx.utxo.value);
        }

        if(this.changeAmount > 0n) {
            outputs += this.buildChangeOutput();
        }

        // verify current tx has this single output

        //console.log('Hash LC Int End:', hash256(this.lockingScript.toHex()))
        //console.log('Locking Int End:', this.lockingScript.toHex().substring(0, 506))
        //console.log('Hash LC Less Hack End:', hash256(this.lockingScript.toHex().substring(506, this.lockingScript.toHex().length)))
        //console.log('Hash Outputs Int End:', hash256(outputs))
        //console.log('Hash Outputs Out    :', this.ctx.hashOutputs)

        assert(this.ctx.hashOutputs == hash256(outputs), 'hashOutputs mismatch')
    }

    @method()
    won(play: bigint) : boolean {
        let lines: FixedArray<FixedArray<bigint, 3>, 8> = [
            [0n, 1n, 2n],
            [3n, 4n, 5n],
            [6n, 7n, 8n],
            [0n, 3n, 6n],
            [1n, 4n, 7n],
            [2n, 5n, 8n],
            [0n, 4n, 8n],
            [2n, 4n, 6n]
        ];

        let anyLine = false;

        for (let i = 0; i < 8; i++) {
            let line = true;
            for (let j = 0; j < 3; j++) {
                line = line && this.board[Number(lines[i][j])] === play;
            }

            anyLine = anyLine || line;
        }

        return anyLine;
    }

    @method()
    full() : boolean {
        let full = true;
        for (let i = 0; i < 9; i++) {
            full = full && this.board[i] !== TicTacToe.EMPTY;
        }
        return full;
    }
}
