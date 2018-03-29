import Hash from '../hash'
import Encoding from '../encoding'
import IO from '../io'
import Consensus from '../consensus'
import Keypair from '../keypair'

const {BufferUtil} = Encoding
const {TXInput} = IO

export default class TransactionInput {
  /**
   *
   * @param obj {Object}
   */
  constructor(obj) {
    const {prevTxID, outIndex, signature, publicKey} = obj
    if (!prevTxID || TransactionInput.isCoinbase(prevTxID)) {
      this.prevTxID = BufferUtil.ensureBuffer(Consensus.TX.coinbase.HASH)
      this.outIndex = Consensus.TX.coinbase.Sequence
    } else {
      this.prevTxID = BufferUtil.ensureBuffer(prevTxID)
      this.outIndex = outIndex
      this.publicKey = publicKey
    }
    this.signature = BufferUtil.ensureBuffer(signature)
  }

  /** check if txID is a coinbase
   * @return {Boolean}
   */
  static isCoinbase(txID) {
    return txID.toString('hex') === Consensus.TX.coinbase.HASH
  }

  static createSignature(prevTxID, outIndex, keypair) {
    const ob = Encoding.numberToBuffer(outIndex, 8)
    const buffer = Buffer.concat([prevTxID, ob])
    return keypair.sign(buffer)
  }

  static fromJSON(obj) {
    if (obj instanceof TransactionInput) {
      return obj
    }
    return new TransactionInput(obj)
  }

  toJSON() {
    const obj = {
      prevTxID: this.prevTxID.toString('hex'),
      outIndex: this.outIndex,
      signature: this.signature.toString('hex'),
    }
    if (this.publicKey) {
      obj.publicKey = this.publicKey.toString('hex')
    }
    return obj
  }

  /**
   *
   * @return {Buffer}
   */
  toBuffer() {
    return TXInput.encode(this)
      .finish()
  }

  static fromBuffer(buffer) {
    const obj = TXInput.decode(buffer)
    return new TransactionInput(obj)
  }

  /**
   * create buffer from prevTxID & outIndex, to be used in signature
   * @param prevTxID {Buffer | String}
   * @param outIndex {Number}
   */
  static createMessageForSign(prevTxID, outIndex) {
    prevTxID = BufferUtil.ensureBuffer(prevTxID)
    const ob = Buffer.from(outIndex.toString(16), 'hex')
    return Buffer.concat([prevTxID, ob])
  }
  /**
   *
   * @param publicKeyHash {Buffer}
   * @return {Boolean}
   */
  verify(publicKeyHash) {
    publicKeyHash = BufferUtil.ensureBuffer(publicKeyHash)
    if (!TransactionInput.isCoinbase(this.prevTxID)) {
      const msg = TransactionInput.createMessageForSign(this.prevTxID, this.outIndex)
      return (Hash.defaultHash(this.publicKey).equals(publicKeyHash)
        && Keypair.verifyMessage(msg, this.signature, this.publicKey))
    }
    return true
  }

  /**
   * @return {Buffer}
   */
  hash() {
    return Hash.defaultHash(this.toBuffer())
  }

  inspect() {
    return `<Input ${this.hash()
      .toString('hex')} ${this.signature.toString('hex')}>`
  }
}
