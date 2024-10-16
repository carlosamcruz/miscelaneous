import {
    method,
    prop,
    SmartContract,
    hash256,
    assert,
    ByteString,
    SigHash,
} from 'scrypt-ts'

export class Counter extends SmartContract {
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

    @method(SigHash.ANYONECANPAY_SINGLE)
    public decrementOnChain() {
        this.decrement()
  
        // make sure balance in the contract does not change
        const amount: bigint = this.ctx.utxo.value
        // output containing the latest state
        const output: ByteString = this.buildStateOutput(amount)
        //console.log('current this.ctx.hashOutputs: ', this.ctx.hashOutputs)
        //console.log('output: ', hash256(output))
        //console.log('state: ', this.count)
    
        // verify current tx has this single output
        assert(this.ctx.hashOutputs == hash256(output), 'hashOutputs mismatch')
    }

    @method()
    public finish() {  
    
        //const output: ByteString = this.buildChangeOutput()  
        //console.log('current this.ctx.hashOutputs: ', this.ctx.hashOutputs)
        //console.log('output: ', output)
      
        assert(this.count >= 3, 'Contrat Not Old Enough')
    }
  
    @method()
    increment(): void {
        this.count++
    }
 
    @method()
    decrement(): void {
        this.count--
    }
}
