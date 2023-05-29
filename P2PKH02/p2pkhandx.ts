import { assert, ByteString, method, prop, sha256, Sha256, SmartContract, PubKeyHash, Sig, PubKey, hash160, toByteString } from 'scrypt-ts'


export class P2PKHandX extends SmartContract {
    @prop()
    readonly pubKeyHash: PubKeyHash

    @prop()
    hash: Sha256
  
    constructor(pubKeyHash: PubKeyHash, hash: Sha256) {
      super(...arguments)
      this.pubKeyHash = pubKeyHash
      this.hash = hash;
    }
    
    /*
    //Metodo original com operação AND implicita
    @method()
    public unlock(sig: Sig, pubkey: PubKey, message: ByteString) {
      assert(hash160(pubkey) == this.pubKeyHash, "Wrong pub key")
      assert(this.checkSig(sig, pubkey), "Bad sig")
      assert(sha256(message) == this.hash, 'Hash does not match')
    }

    */
    
    /*
    //Versão com operação AND Explicita
    //https://scrypt.io/docs/how-to-write-a-contract/#operators
    @method()
    public unlock(sig: Sig, pubkey: PubKey, message: ByteString) {
      assert(hash160(pubkey) == this.pubKeyHash, "Wrong pub key")
      assert(this.checkSig(sig, pubkey) && sha256(message) == this.hash, "Bad sig or Hash do not match")
      //assert(sha256(message) == this.hash, 'Hash does not match')
    }

    */
  

    
    //Versão com operação OR
    //https://scrypt.io/docs/how-to-write-a-contract/#operators
    @method()
    public unlock(sig: Sig, pubkey: PubKey, message: ByteString) {
      assert(hash160(pubkey) == this.pubKeyHash, "Wrong pub key")
      assert(this.checkSig(sig, pubkey) || sha256(message) == this.hash, "Bad sig and Hash do not match")
      //assert(sha256(message) == this.hash, 'Hash does not match')
    }
    
  }