import { assert, ByteString, method, prop, sha256, Sha256, SmartContract, PubKeyHash, Sig, PubKey, hash160, toByteString, FixedArray } from 'scrypt-ts'

//////////////////////////////////////////////////////////
// JESUS is the LORD
//////////////////////////////////////////////////////////

//Codigo para checagem de assinatura individual OR
export class P2PKHMULT extends SmartContract {

      // public key hashes of the 3 recipients
      @prop()
      readonly pubKeyHashes: FixedArray<PubKeyHash, 2>
    
      constructor(pubKeyHashes: FixedArray<PubKeyHash, 2>) {
        super(...arguments)
        this.pubKeyHashes = pubKeyHashes
      }
    
      @method()
      public unlock(
          signatures: FixedArray<Sig, 2>, 
          publicKeys: FixedArray<PubKey, 2>
        ) {


        //V1 se passar um os dois executam
        
        //assert((hash160(publicKeys[0]) == this.pubKeyHashes[0]) || (hash160(publicKeys[1]) == this.pubKeyHashes[1]), 'public key hash mismatch¸')    
        //assert(this.checkSig(signatures[0], publicKeys[0]), "Bad sig")
        //assert(this.checkSig(signatures[1], publicKeys[1]), "Bad sig")
        

        //V2 se passar um os dois executam
        assert((hash160(publicKeys[0]) == this.pubKeyHashes[0]) && (this.checkSig(signatures[0], publicKeys[0])), "Bad sig or Hash 1")
        assert((hash160(publicKeys[1]) == this.pubKeyHashes[1]) && (this.checkSig(signatures[1], publicKeys[1])), "Bad sig or Hash 2")
      }    
}

/*
import { assert, ByteString, method, prop, sha256, Sha256, SmartContract, PubKeyHash, Sig, PubKey, hash160, toByteString, FixedArray } from 'scrypt-ts'

//////////////////////////////////////////////////////////
// JESUS is the LORD
//////////////////////////////////////////////////////////

//Codigo para checagem de assinatura individual
export class P2PKHMULT extends SmartContract {

      // public key hashes of the 3 recipients
      @prop()
      readonly pubKeyHashes: FixedArray<PubKeyHash, 2>
    
      constructor(pubKeyHashes: FixedArray<PubKeyHash, 2>) {
        super(...arguments)
        this.pubKeyHashes = pubKeyHashes
      }
    
      @method()
      public unlock(
          signatures: FixedArray<Sig, 2>, 
          publicKeys: FixedArray<PubKey, 2>
        ) {
        // check if the passed public keys belong to the specified public key hashes
        for (let i = 0; i < 2; i++) {
          assert(hash160(publicKeys[i]) == this.pubKeyHashes[i], 'public key hash mismatch¸')
        }
        // validação individual de assinaturas
        // V1
        //assert(this.checkSig(signatures[0], publicKeys[0]) && this.checkSig(signatures[1], publicKeys[1]), "Bad sig")

        // V2 - 4 bytes menor que V1
        assert(this.checkSig(signatures[0], publicKeys[0]), "Bad sig")
        assert(this.checkSig(signatures[1], publicKeys[1]), "Bad sig")
 
      }    
}
*/

/*
//////////////////////////////////////////////////////////
// JESUS is the LORD
//////////////////////////////////////////////////////////

//Codigo para checagem de assinaturas em bloco

import { assert, ByteString, method, prop, sha256, Sha256, SmartContract, PubKeyHash, Sig, PubKey, hash160, toByteString, FixedArray } from 'scrypt-ts'

export class P2PKHMULT extends SmartContract {
  
      // public key hashes of the 3 recipients
      @prop()
      readonly pubKeyHashes: FixedArray<PubKeyHash, 2>
    
      constructor(pubKeyHashes: FixedArray<PubKeyHash, 2>) {
        super(...arguments)
        this.pubKeyHashes = pubKeyHashes
      }
      
      @method()
      public unlock(
          signatures: FixedArray<Sig, 2>, 
          publicKeys: FixedArray<PubKey, 2>
        ) {
        // check if the passed public keys belong to the specified public key hashes
        for (let i = 0; i < 2; i++) {
          assert(hash160(publicKeys[i]) == this.pubKeyHashes[i], 'public key hash mismatch¸')
        }
        // validate signatures em bloco
        assert(this.checkMultiSig(signatures, publicKeys), 'checkMultiSig failed')
      }  
}

*/

