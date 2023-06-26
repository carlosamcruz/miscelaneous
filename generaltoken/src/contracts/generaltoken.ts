////////////////////////////////////////////////////////////////////////////////
// JESUS is the LORD of ALL
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////
//General Purpose Token
////////////////////////////////////////////////////////////

import {
    method,
    prop,
    SmartContract,
    hash256,
    assert,
    ByteString,
    SigHash, PubKey, FixedArray, fill, Sig, hash160, toByteString, Utils, sha256
} from 'scrypt-ts'

export class GeneralToken extends SmartContract {
    // Stateful property to store counters value.
    @prop()
    readonly totalSupply: bigint; // data.

    @prop(true)
    alice: PubKey; // alice's public Key
    
    @prop(true)
    data: ByteString; // data.

    @prop(true)
    sell: boolean; // data.

    @prop(true)
    price: bigint; // data.

    @prop(true)
    thisSupply: bigint; // data.

    @prop(true)
    toBuyer: PubKey; // alice's public Key

    constructor(alice: PubKey, totalSupply: bigint) {    
        super(...arguments);
        this.totalSupply = totalSupply
        this.thisSupply = this.totalSupply

        this.alice = alice;
        this.data = toByteString('');
        this.sell = false
        this.price = 0n
        this.toBuyer = this.alice
    }
     
    @method()    
    public setupToken(sig: Sig, finish: boolean, newData: ByteString) {    

        assert(this.checkSig(sig, this.alice), `checkSig failed, pubkey: ${this.alice}`);
        // build the transation outputs
        let outputs = toByteString('');

        if(finish)
        {
            outputs = Utils.buildPublicKeyHashOutput(hash160(this.alice), this.ctx.utxo.value);
        }
        else
        {
            this.data = newData;
            //this.dataInfo = newDataInfo
            outputs = this.buildStateOutput(this.ctx.utxo.value);    
        }
        if(this.changeAmount > 0n) {
            outputs += this.buildChangeOutput();
        }

        assert(this.ctx.hashOutputs == hash256(outputs), 'hashOutputs mismatch')
    }

    //toBuyer == this.alice, for anyone can pay
    @method()
    public sellOrder(sig: Sig, sell: boolean, price: bigint, toBuyer: PubKey) {    
        // check signature `sig`
        assert(this.checkSig(sig, this.alice), `checkSig failed, pubkey: ${this.alice}`);       
        //(a || b) && !(a && b) = XOR
        //(this.sell || sell) && !(this.sell && sell)
        assert((this.sell || sell) && !(this.sell && sell) , `checkSig failed, For Sele state alredy set as: ${sell}`);
        
        this.sell = sell
        if(sell)
        {
            this.price = price
            //Ordem preferencial
            this.toBuyer = toBuyer //sempre mudar - pois pode chegar de outro endereço
        }
        else
        {
            this.price = 0n
        }

        // build the transation outputs
        let outputs = toByteString('');

        outputs = this.buildStateOutput(this.ctx.utxo.value);
        if(this.changeAmount > 0n) {
            outputs += this.buildChangeOutput();
        }

        assert(this.ctx.hashOutputs == hash256(outputs), 'hashOutputs mismatch')
    }

    @method()
    public buying(newOwner: PubKey, price: bigint) {    

        assert(this.sell, `Order failed, Not Selling`);
        assert(price >= this.price, `checkSig failed, Ask not Met`);

        if(this.toBuyer !== this.alice)
        {
            assert(this.toBuyer === newOwner, `Order failed, not the preferential buyer`);
        }

        // build the transation outputs
        let outputs = toByteString('');
    
        if(this.sell)
        {
            let lastAlice = this.alice
            this.alice = newOwner
            this.sell = false
            this.price = 0n

            outputs = this.buildStateOutput(this.ctx.utxo.value);            
            outputs += Utils.buildPublicKeyHashOutput(hash160(lastAlice), price);
        }

        if(this.changeAmount > 0n) {
            outputs += this.buildChangeOutput();
        }

        assert(this.ctx.hashOutputs == hash256(outputs), 'hashOutputs mismatch')
    }

    @method()
    public split(sig: Sig, numberOfSendTokens: bigint, toNewOwner: PubKey) {    

        assert(numberOfSendTokens <= this.thisSupply, `insuficient supply fund!!`);
        assert(this.checkSig(sig, this.alice), `checkSig failed, pubkey: ${this.alice}`);

        // build the transation outputs
        let outputs = toByteString('');

        if(this.thisSupply == numberOfSendTokens)
        {
            this.alice = toNewOwner
            outputs = this.buildStateOutput(this.ctx.utxo.value);
        }
        else
        {
            this.thisSupply = this.thisSupply - numberOfSendTokens
            outputs = this.buildStateOutput(this.ctx.utxo.value);
            
            this.alice = toNewOwner
            this.thisSupply = numberOfSendTokens
            outputs += this.buildStateOutput(this.ctx.utxo.value);
        }

        if(this.changeAmount > 0n) {
            outputs += this.buildChangeOutput();
        }

        assert(this.ctx.hashOutputs == hash256(outputs), 'hashOutputs mismatch')
    }

    @method()
    public mergeTokens(sig: Sig, Supply1: bigint, Supply2: bigint) {    

        assert( Supply1 == this.thisSupply || Supply2 == this.thisSupply, `supply dont match`);
        assert((Supply1 + Supply2) <= this.totalSupply, `to many tokens`);
        assert(this.checkSig(sig, this.alice), `checkSig failed, pubkey: ${this.alice}`);

        // build the transation outputs
        let outputs = toByteString('');
        this.thisSupply = Supply1 + Supply2
        outputs = this.buildStateOutput(this.ctx.utxo.value);
        outputs += Utils.buildPublicKeyHashOutput(hash160(this.alice), this.ctx.utxo.value);

        if(this.changeAmount > 0n) {
            outputs += this.buildChangeOutput();
        }

        assert(this.ctx.hashOutputs == hash256(outputs), 'hashOutputs mismatch')
    }
}
