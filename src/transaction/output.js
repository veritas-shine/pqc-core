import Encoding from '../encoding'
import Hash from '../hash'
import IO from '../io'

const { BufferUtil } = Encoding
const {TXOutput} = IO

export default class TransactionOutput {
  constructor(amount, publicKeyHash) {
    this.amount = amount
    this.publicKeyHash = BufferUtil.ensureBuffer(publicKeyHash)
  }

  static fromJSON(obj) {
    if (obj instanceof TransactionOutput) {
      return obj
    }
    const { amount, publicKeyHash } = obj
    return new TransactionOutput(amount, publicKeyHash)
  }

  /**
   *
   * @return {{amount: number, publicKeyHash: string}}
   */
  toJSON() {
    const obj = {
      amount: this.amount,
      publicKeyHash: this.publicKeyHash.toString('hex')
    }
    return obj
  }

  /**
   * encoded to protobuf Buffer
   * @return {Buffer}
   */
  toBuffer() {
    return TXOutput.encode(this).finish()
  }

  /**
   * create from protobuf encoded Buffer
   * @param {Buffer} buffer
   * @return {TransactionOutput}
   */
  static fromBuffer(buffer) {
    const obj = TXOutput.decode(buffer)
    return new TransactionOutput(obj)
  }

  /**
   *
   * @return {string}
   */
  hash() {
    return Hash.defaultHash(this.toBuffer())
  }

  /**
   *
   * @return {string}
   */
  inspect() {
    return `<Output ${this.hash().toString('hex')} ${this.amount} ${this.publicKeyHash.toString('hex')}>`
  }
}
