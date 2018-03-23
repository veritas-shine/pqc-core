import Encoding from '../encoding'
import Hash from '../hash'

const { BufferUtil } = Encoding

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
    return Buffer.from(JSON.stringify(this.toJSON()), 'utf8')
  }

  static fromBuffer(buffer) {
    const obj = JSON.parse(buffer.toString('utf8'))
    return new TransactionOutput(obj)
  }

  hash() {
    return Hash.defaultHash(this.toBuffer())
  }

  inspect() {
    return `<Output ${this.hash().toString('hex')} ${this.amount} ${this.publicKeyHash.toString('hex')}>`
  }
}
