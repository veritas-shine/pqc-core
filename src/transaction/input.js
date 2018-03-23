import Hash from '../hash'
import Encoding from '../encoding'

const {BufferUtil} = Encoding

export default class TransactionInput {
  /**
   *
   * @param prevTxID {Buffer | String}
   * @param outIndex {Number}
   * @param signature {Buffer}
   * @param publicKey {Buffer}
   */
  constructor(prevTxID, outIndex, signature, publicKey) {
    this.prevTxID = BufferUtil.ensureBuffer(prevTxID)
    this.outIndex = outIndex
    this.signature = BufferUtil.ensureBuffer(signature)
    this.publicKey = BufferUtil.ensureBuffer(publicKey)
    this.coinbase = null
  }

  /**
   *
   * @return {Buffer}
   */
  toBuffer() {
    const buffer = Buffer.from(new Uint32Array(this.outIndex))
    return Buffer.concat([this.prevTxID, buffer, this.signature, this.publicKey])
  }

  /**
   * @return {Buffer}
   */
  hash() {
    return Hash.defaultHash(this.toBuffer())
  }

}
