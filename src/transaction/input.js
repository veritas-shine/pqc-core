import Hash from '../hash'
import Encoding from '../encoding'

const {BufferUtil} = Encoding

export default class TransactionInput {
  static coinbaseHash = Hash.NULL
  static coinbaseSequence = 0xFFFFFFFF
  static maxSequence = Buffer.from([0xFF, 0xFF, 0xFF, 0xFF])
  static txIDLength = 32
  /**
   *
   * @param obj {Object}
   */
  constructor(obj) {
    const {prevTxID, outIndex, signature, publicKey} = obj
    if (!prevTxID || TransactionInput.isCoinbase(prevTxID)) {
      this.prevTxID = BufferUtil.ensureBuffer(TransactionInput.coinbaseHash)
      this.outIndex = TransactionInput.maxSequence
    } else {
      this.prevTxID = BufferUtil.ensureBuffer(prevTxID)
      this.outIndex = outIndex
      this.publicKey = publicKey
    }
    this.signature = BufferUtil.ensureBuffer(signature)
  }

  /**
   * @return {Boolean}
   */
  static isCoinbase(txID) {
    return txID.toString('hex') === TransactionInput.coinbaseHash
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
    return Buffer.from(JSON.stringify(this.toJSON()), 'utf8')
  }

  static fromBuffer(buffer) {
    const obj = JSON.parse(buffer.toString('utf8'))
    return new TransactionInput(obj)
  }

  /**
   * @return {Buffer}
   */
  hash() {
    return Hash.defaultHash(this.toBuffer())
  }

  inspect() {
    return `<Input ${this.hash().toString('hex')} ${this.signature.toString('hex')}>`
  }
}
