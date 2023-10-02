'use strict'

var BN = require('./bn')
var Point = require('./point')
var Signature = require('./signature')
var PublicKey = require('../publickey')
var Random = require('./random')
var Hash = require('./hash')
var _ = require('../util/_')
var $ = require('../util/preconditions')

///////////////////////////
//Jesus is the Lord
///////////////////////////
var vt = Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex')
var preimageExt = ''
var sigR = ''
var sigS = ''
///////////////////////////
///////////////////////////

var ECDSA = function ECDSA (obj) {
  if (!(this instanceof ECDSA)) {
    return new ECDSA(obj)
  }
  if (obj) {
    this.set(obj)
  }
}

ECDSA.prototype.set = function (obj) {
  this.hashbuf = obj.hashbuf || this.hashbuf
  this.endian = obj.endian || this.endian // the endianness of hashbuf
  this.privkey = obj.privkey || this.privkey
  this.pubkey = obj.pubkey || (this.privkey ? this.privkey.publicKey : this.pubkey)
  this.sig = obj.sig || this.sig
  this.k = obj.k || this.k
  this.verified = obj.verified || this.verified
  return this
}

ECDSA.prototype.privkey2pubkey = function () {
  this.pubkey = this.privkey.toPublicKey()
}

ECDSA.prototype.calci = function () {
  for (var i = 0; i < 4; i++) {
    this.sig.i = i
    var Qprime
    try {
      Qprime = this.toPublicKey()
    } catch (e) {
      console.error(e)
      continue
    }

    if (Qprime.point.eq(this.pubkey.point)) {
      this.sig.compressed = this.pubkey.compressed
      return this
    }
  }

  this.sig.i = undefined
  throw new Error('Unable to find valid recovery factor')
}

ECDSA.fromString = function (str) {
  var obj = JSON.parse(str)
  return new ECDSA(obj)
}

ECDSA.prototype.randomK = function () {
  var N = Point.getN()
  var k
  do {
    k = BN.fromBuffer(Random.getRandomBuffer(32))
  } while (!(k.lt(N) && k.gt(BN.Zero)))
  this.k = k
  return this
}

////////////////////////////////////
//Jesus is the Lord!!!!
////////////////////////////////////

// https://tools.ietf.org/html/rfc6979#section-3.2
ECDSA.prototype.deterministicK = function (badrs) {
  // if r or s were invalid when this function was used in signing,
  // we do not want to actually compute r, s here for efficiency, so,
  // we can increment badrs. explained at end of RFC 6979 section 3.2
  if (_.isUndefined(badrs)) {
    badrs = 0
  }
  var v = Buffer.alloc(32)
  v.fill(0x01)
  var k = Buffer.alloc(32)
  k.fill(0x00)
  var x = this.privkey.bn.toBuffer({
    size: 32
  })
  var hashbuf = this.endian === 'little' ? Buffer.from(this.hashbuf).reverse() : this.hashbuf
  k = Hash.sha256hmac(Buffer.concat([v, Buffer.from([0x00]), x, hashbuf]), k)
  v = Hash.sha256hmac(v, k)
  k = Hash.sha256hmac(Buffer.concat([v, Buffer.from([0x01]), x, hashbuf]), k)
  v = Hash.sha256hmac(v, k)
  v = Hash.sha256hmac(v, k)
  var T = BN.fromBuffer(v)
  var N = Point.getN()

  // also explained in 3.2, we must ensure T is in the proper range (0, N)
  for (var i = 0; i < badrs || !(T.lt(N) && T.gt(BN.Zero)); i++) {
    k = Hash.sha256hmac(Buffer.concat([v, Buffer.from([0x00])]), k)
    v = Hash.sha256hmac(v, k)
    v = Hash.sha256hmac(v, k)
    T = BN.fromBuffer(v)
  }

  if(vt.toString('hex') === '0000000000000000000000000000000000000000000000000000000000000000' )
  {
   // T = BN.fromBuffer(vt)
    //console.log('Kdet: ', T.toString('hex'))
    ///console.log("No inti")
    //console.log("T: ", T.toString())

    this.k = T
  }
  else
  {

    var N = Point.getN()
    
    T = BN.fromBuffer(vt)
    //console.log('vt: ', vt.toString('hex'))
    //console.log('KdetHEX: ', T.toString('hex'))
    //console.log('Kdet: ', T.toString())


    //console.log('KdetInve: ', T.invm(N).toString())


    //console.log("Inti")
    //v = vt
    //T = BN.fromBuffer(vt.buffer)

    //console.log("T: ", T)
    //console.log("T: ", T.toString())
    this.k = T
  }

  //this.k = T
  return this
}

//Jesus is the Lord!!!!
ECDSA.kDet = function (kDet) {
  
  vt = Buffer.from(kDet, 'hex')

  return vt;
}

//Jesus is the Lord!!!!
ECDSA.preimageExtIn = function (preimageTXIn) {
  
  //preimageExt = preimageTXIn

  if(preimageExt.indexOf((preimageTXIn).toString('hex')) === -1)
  {
    preimageExt = preimageExt + "\n" + (preimageTXIn).toString('hex') + ";"
    //console.log('preimage Ext2 ABCD: ', preimageExt) 
    //ECDSA.preimageExtIn(preimageExt)  
  }

  //console.log('preimage Ext ECDSA: ', preimageExt)

}
//Jesus is the Lord!!!!
ECDSA.preimageExtOut = function () {
  return preimageExt
}

//Jesus is the Lord!!!!
ECDSA.invN = function (kN) {
  var N = Point.getN()
  //vt = Buffer.from(kN, 'hex')

  //T = BN.fromBuffer(vt)
  //T = BN.fromBuffer(Buffer.from(kN, 'hex'))

  //T.invm(N).toString()

  return (BN.fromBuffer(Buffer.from(kN, 'hex'))).invm(N).toString('hex');
}

//Jesus is the Lord!!!!
ECDSA.sigRout = function () {
  return sigR;
}

//Jesus is the Lord!!!!
ECDSA.sigSout = function () {
  return sigS;
}

//Jesus is the Lord!!!!
ECDSA.ditacticRST = function () {
  
  preimageExt = ''
  sigR = ''
  sigS = ''
  //console.log('preimage Ext ECDSA: ', preimageExt)
}

//////////////////////////////////////
//Jesus is the Lord!!!!
//////////////////////////////////////
ECDSA.ecdsaForge = function (aIn, bIn, xQA, isOddY) {
  var N = Point.getN()
  var G = Point.getG()
  // try different values of k until r, s are valid
  
  var r, s, aG, bQA, QA, R, bInv, sinv, z
 
  //var a = new BN('0x' + aIn)
  var a = new BN(BigInt("0x" + aIn))

  //var b = new BN('0x' + bIn)
  var b = new BN(BigInt("0x" + bIn)) 

  aG = G.mul(a)

  QA = Point.fromX(isOddY, xQA)

  bQA = QA.mul(b)

  R = aG.add(bQA)

  bInv = b.invm(N)

  var r = new BN(1).mul(R.x.umod(N))

  s = bInv.mul(r).umod(N)
  sinv = N.sub(s)

  z = (bInv.mul(a).umod(N)).mul(r).umod(N)
  
  var z32 = Buffer.from(z.toBuffer()).reverse().toString('hex')

  while(z32.length < 64)
  {
    z32 = z32 + '0'
  }
  console.log("z32: ", z32)


  let bytes = [];
  for (let i = 0; i < z32.length; i += 2) {
    bytes.push(parseInt(z32.substring(i, i+2), 16));
  }

  var sigVer1 = ECDSA.verify(Buffer.from(new Uint8Array(bytes)), new Signature(r, s), new PublicKey(QA), 'little')
  var sigVer2 = ECDSA.verify(Buffer.from(new Uint8Array(bytes)), new Signature(r, sinv), new PublicKey(QA), 'little')

  var result;

  if(sigVer1 && sigVer2)
    result = [z.toString('hex'), r.toString('hex'),s.toString('hex'), sinv.toString('hex')]             
  else
    result = ['Failed', 'Failed','Failed', 'Failed']                

 return result
}

//////////////////////////////////////
//Jesus is the Lord!!!!
//////////////////////////////////////
ECDSA.pbkeyFromECDSA = function (zIn, sIn, rIn) {
  
  var N = Point.getN()
  var G = Point.getG()

  var r, s1, s2, R1, R2, z
 
  s1 = new BN(BigInt("0x" + sIn))
  s2 = N.sub(s1)

  R1 = Point.fromX(true, rIn)
  R2 = Point.fromX(false, rIn)

  z = new BN(BigInt("0x" + zIn))

  r = new BN(BigInt("0x" + rIn))

  var rinv = r.invm(N)

  var srinv1 = rinv.mul(s1).umod(N)
  var srinv2 = rinv.mul(s2).umod(N)

  var zrinv = rinv.mul(z).umod(N)

  var QR1, QR2, QR3, QR4, zrinvG

  QR1 = R1.mul(srinv1)
  QR2 = R2.mul(srinv2)

  QR3 = R1.mul(srinv2) 
  QR4 = R2.mul(srinv1)

  zrinvG = G.mul(zrinv)

  var QA1, QA2, QA3, QA4


  var oneBi = new BN(BigInt("0x01"))

  var Nmone = N.sub(oneBi)

  QA1 = QR1.add(zrinvG.mul(Nmone))
  QA2 = QR2.add(zrinvG.mul(Nmone))
  QA3 = QR3.add(zrinvG.mul(Nmone))
  QA4 = QR4.add(zrinvG.mul(Nmone))

  var z32 = Buffer.from(z.toBuffer()).reverse().toString('hex')

  while(z32.length < 64)
  {
    z32 = z32 + '0'
  }
  console.log("z32: ", z32)

  let bytes = [];
  for (let i = 0; i < z32.length; i += 2) {
    bytes.push(parseInt(z32.substring(i, i+2), 16));
  }

  var sigVer1 = ECDSA.verify(Buffer.from(new Uint8Array(bytes)), new Signature(r, s1), new PublicKey(QA1), 'little')
  var sigVer2 = ECDSA.verify(Buffer.from(new Uint8Array(bytes)), new Signature(r, s2), new PublicKey(QA2), 'little')
  var sigVer3 = ECDSA.verify(Buffer.from(new Uint8Array(bytes)), new Signature(r, s1), new PublicKey(QA3), 'little')
  var sigVer4 = ECDSA.verify(Buffer.from(new Uint8Array(bytes)), new Signature(r, s2), new PublicKey(QA4), 'little')

  var result;

  if(sigVer1 && sigVer2 && sigVer3 && sigVer4)
  {
    let qa1x = QA1.x.toString('hex')
    let qa1y = QA1.y.toString('hex')

    let qa3x = QA3.x.toString('hex')
    let qa3y = QA3.y.toString('hex')

    //console.log('pk1: ', '04' + QA1.x.toString('hex') + QA1.y.toString('hex'))
    //console.log('pk2: ', '04' + QA2.x.toString('hex') + QA2.y.toString('hex'))
    //console.log('pk3: ', '04' + QA3.x.toString('hex') + QA3.y.toString('hex'))
    //console.log('pk4: ', '04' + QA4.x.toString('hex') + QA4.y.toString('hex'))

    while(qa1x.length < 64)
    {
      qa1x = '0' + qa1x;
    }
    while(qa1y.length < 64)
    {
      qa1y = '0' + qa1y;
    }

    while(qa3x.length < 64)
    {
      qa3x = '0' + qa3x;
    }
    while(qa3y.length < 64)
    {
      qa3y = '0' + qa3y;
    }
   
    //result = ['04' + QA1.x.toString('hex') + QA1.y.toString('hex'),'04' + QA3.x.toString('hex') + QA3.y.toString('hex')]
    result = ['04' + qa1x + qa1y,'04' + qa3x + qa3y] 
  }
  else
    result = ['Failed','Failed']

 return result
}



// Information about public key recovery:
// https://bitcointalk.org/index.php?topic=6430.0
// http://stackoverflow.com/questions/19665491/how-do-i-get-an-ecdsa-public-key-from-just-a-bitcoin-signature-sec1-4-1-6-k
ECDSA.prototype.toPublicKey = function () {
  var i = this.sig.i
  $.checkArgument(i === 0 || i === 1 || i === 2 || i === 3, new Error('i must be equal to 0, 1, 2, or 3'))

  var e = BN.fromBuffer(this.hashbuf)
  var r = this.sig.r
  var s = this.sig.s

  // A set LSB signifies that the y-coordinate is odd
  var isYOdd = i & 1

  // The more significant bit specifies whether we should use the
  // first or second candidate key.
  var isSecondKey = i >> 1

  var n = Point.getN()
  var G = Point.getG()

  // 1.1 Let x = r + jn
  var x = isSecondKey ? r.add(n) : r
  var R = Point.fromX(isYOdd, x)

  // 1.4 Check that nR is at infinity
  var nR = R.mul(n)

  if (!nR.isInfinity()) {
    throw new Error('nR is not a valid curve point')
  }

  // Compute -e from e
  var eNeg = e.neg().umod(n)

  // 1.6.1 Compute Q = r^-1 (sR - eG)
  // Q = r^-1 (sR + -eG)
  var rInv = r.invm(n)

  // var Q = R.multiplyTwo(s, G, eNeg).mul(rInv);
  var Q = R.mul(s).add(G.mul(eNeg)).mul(rInv)

  var pubkey = PublicKey.fromPoint(Q, this.sig.compressed)

  return pubkey
}

ECDSA.prototype.sigError = function () {
  if (!Buffer.isBuffer(this.hashbuf) || this.hashbuf.length !== 32) {
    return 'hashbuf must be a 32 byte buffer'
  }

  var r = this.sig.r
  var s = this.sig.s
  if (!(r.gt(BN.Zero) && r.lt(Point.getN())) || !(s.gt(BN.Zero) && s.lt(Point.getN()))) {
    return 'r and s not in range'
  }

  var e = BN.fromBuffer(this.hashbuf, this.endian ? {
    endian: this.endian
  } : undefined)
  var n = Point.getN()
  var sinv = s.invm(n)
  var u1 = sinv.mul(e).umod(n)
  var u2 = sinv.mul(r).umod(n)

  var p = Point.getG().mulAdd(u1, this.pubkey.point, u2)
  if (p.isInfinity()) {
    return 'p is infinity'
  }

  if (p.getX().umod(n).cmp(r) !== 0) {
    return 'Invalid signature'
  } else {
    return false
  }
}

ECDSA.toLowS = function (s) {
  // enforce low s
  // see BIP 62, "low S values in signatures"
  if (s.gt(BN.fromBuffer(Buffer.from('7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0', 'hex')))) {
    s = Point.getN().sub(s)
  }
  return s
}

ECDSA.prototype._findSignature = function (d, e) {
  var N = Point.getN()
  var G = Point.getG()
  // try different values of k until r, s are valid
  var badrs = 0
  var k, Q, r, s
  do {
    if (!this.k || badrs > 0) {
      this.deterministicK(badrs)
    }
    badrs++
    k = this.k
    Q = G.mul(k)
    r = new BN(1).mul(Q.x.umod(N))
    s = k.invm(N).mul(e.add(d.mul(r))).umod(N)
  } while (r.cmp(BN.Zero) <= 0 || s.cmp(BN.Zero) <= 0)

  s = ECDSA.toLowS(s)

  //////////////////////////////
  //Jesus is the Lord
  //////////////////////////////
  //console.log('sigR: ', r.toString('hex'))
  //console.log('sigS: ', s.toString('hex'))
  if(sigR.indexOf(r.toString('hex')) === -1)
  {
    sigR = sigR + '\n' + r.toString('hex') + ';'
  }
  if(sigS.indexOf(s.toString('hex')) === -1)
  {
    sigS = sigS + '\n' + s.toString('hex') + ';'
  }
  //sigS = s.toString('hex')
  //////////////////////////////
  //////////////////////////////



  return {
    s: s,
    r: r
  }
}

ECDSA.prototype.sign = function () {
  var hashbuf = this.hashbuf
  var privkey = this.privkey
  var d = privkey.bn

  $.checkState(hashbuf && privkey && d, new Error('invalid parameters'))
  $.checkState(Buffer.isBuffer(hashbuf) && hashbuf.length === 32, new Error('hashbuf must be a 32 byte buffer'))

  var e = BN.fromBuffer(hashbuf, this.endian ? {
    endian: this.endian
  } : undefined)

  var obj = this._findSignature(d, e)
  obj.compressed = this.pubkey.compressed

  this.sig = new Signature(obj)
  return this
}

ECDSA.prototype.signRandomK = function () {
  this.randomK()
  return this.sign()
}

ECDSA.prototype.toString = function () {
  var obj = {}
  if (this.hashbuf) {
    obj.hashbuf = this.hashbuf.toString('hex')
  }
  if (this.privkey) {
    obj.privkey = this.privkey.toString()
  }
  if (this.pubkey) {
    obj.pubkey = this.pubkey.toString()
  }
  if (this.sig) {
    obj.sig = this.sig.toString()
  }
  if (this.k) {
    obj.k = this.k.toString()
  }
  return JSON.stringify(obj)
}

ECDSA.prototype.verify = function () {
  if (!this.sigError()) {
    this.verified = true
  } else {
    this.verified = false
  }
  return this
}

ECDSA.sign = function (hashbuf, privkey, endian) {
  return ECDSA().set({
    hashbuf: hashbuf,
    endian: endian,
    privkey: privkey
  }).sign().sig
}

ECDSA.signWithCalcI = function (hashbuf, privkey, endian) {
  return ECDSA().set({
    hashbuf: hashbuf,
    endian: endian,
    privkey: privkey
  }).sign().calci().sig
}

ECDSA.signRandomK = function (hashbuf, privkey, endian) {
  return ECDSA().set({
    hashbuf: hashbuf,
    endian: endian,
    privkey: privkey
  }).signRandomK().sig
}

ECDSA.verify = function (hashbuf, sig, pubkey, endian) {
  return ECDSA().set({
    hashbuf: hashbuf,
    endian: endian,
    sig: sig,
    pubkey: pubkey
  }).verify().verified
}

module.exports = ECDSA
