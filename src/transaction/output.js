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

  toJSON() {
    const obj = {
      amount: this.amount,
      publicKeyHash: this.publicKeyHash.toString('hex')
    }
    return obj
  }

  toBuffer() {
    return TXOutput.encode(this).finish()
  }

  static fromBuffer(buffer) {
    const obj = TXOutput.decode(buffer)
    return new TransactionOutput(obj)
  }

  hash() {
    return Hash.defaultHash(this.toBuffer())
  }

  inspect() {
    return `<Output ${this.hash().toString('hex')} ${this.amount} ${this.publicKeyHash.toString('hex')}>`
  }
}
