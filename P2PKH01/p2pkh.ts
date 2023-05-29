import { assert, ByteString, method, prop, sha256, Sha256, SmartContract, PubKeyHash, Sig, PubKey, hash160, toByteString } from 'scrypt-ts'


export class P2PKH extends SmartContract {
    @prop()
    readonly pubKeyHash: PubKeyHash
  
    constructor(pubKeyHash: PubKeyHash) {
      super(pubKeyHash)
      this.pubKeyHash = pubKeyHash
    }
  
    
    @method()
    public unlock(sig: Sig, pubkey: PubKey) {
      assert(hash160(pubkey) == this.pubKeyHash, "Wrong pub key")
      assert(this.checkSig(sig, pubkey), "Bad sig")
    }
  }