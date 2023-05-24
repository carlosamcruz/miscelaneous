import {
    method,
    prop,
    SmartContract,
    hash256,
    assert,
    ByteString,
    SigHash,
} from 'scrypt-ts'

export class Statefulsc extends SmartContract {
    // Stateful property to store counters value.
    @prop(true)
    count: bigint

    constructor(count: bigint) {
        super(...arguments)
        this.count = count
    }


    @method(SigHash.ANYONECANPAY_SINGLE)
    public incrementOnChain() {
        this.increment()
  
        // make sure balance in the contract does not change
        const amount: bigint = this.ctx.utxo.value
        // output containing the latest state
        const output: ByteString = this.buildStateOutput(amount)
        //console.log('current this.ctx.hashOutputs: ', this.ctx.hashOutputs)
        //console.log('current this.ctx: ', this.ctx)
    
        // verify current tx has this single output
        assert(this.ctx.hashOutputs == hash256(output), 'hashOutputs mismatch')
    }

    //@method(SigHash.ANYONECANPAY_SINGLE)
    @method()
    public finish() {  
    
       //const output: ByteString = this.buildChangeOutput()

       //console.log('current this.ctx.hashOutputs: ', this.ctx.hashOutputs)
       //console.log('output: ', output)
       //console.log('Change Amount: ', this.changeAmount)
       //console.log('count: ', this.count)
       //console.log('changeAdd: ', this.changeAddress)
      
        assert(this.count >= 3, 'Contrat Not Old Enough')
    }
  
    @method()
    increment(): void {
        this.count++
    }
}

/*
import {
    method,
    prop,
    SmartContract,
    hash256,
    assert,
    ByteString,
    SigHash,
} from 'scrypt-ts'

export class Stateful extends SmartContract {
    // Stateful property to store counters value.
    @prop(true)
    count: bigint

    constructor(count: bigint) {
        super(...arguments)
        this.count = count
    }

    @method(SigHash.SINGLE)
    public increment() {
        // Increment counter value.
        this.count++

        // Make sure balance in the contract does not change.
        const amount: bigint = this.ctx.utxo.value
        // Output containing the latest state.
        const output: ByteString = this.buildStateOutput(amount)
        // Verify current tx has this single output.
        assert(this.ctx.hashOutputs == hash256(output), 'hashOutputs mismatch')
    }
}

*/
