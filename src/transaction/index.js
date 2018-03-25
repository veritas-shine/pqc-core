import Hash from '../hash'
import Input from './input'
import Output from './output'
import Keypair from '../keypair'
import Consensus from '../consensus'
import IO from '../io'

const {TX} = IO

export default class Transaction {
  constructor(obj) {
    this.type = Consensus.TX.type.Normal
    this.version = obj.version
    this.inputs = obj.inputs.map(obj => Input.fromJSON(obj))
    this.outputs = obj.outputs.map(obj => Output.fromJSON(obj))
    this.locktime = obj.locktime
    Object.defineProperty(this, 'txid', {
      get: () => this.hash()
        .toString('hex'),
      set: () => {
      }
    })
  }

  /**
   * create a coinbase transaction
   * @param keypair {Keypair}
   * @param coinbase {Buffer}
   * @param amount {Number}
   * @return {Transaction}
   */
  static createCoinbaseTransaction(keypair, coinbase, amount) {
    const obj = {
      signature: coinbase
    }
    const address = keypair.toAddress()
    const inputs = [new Input(obj)]
    const publicKeyHash = Keypair.addressToPublicKeyHash(address)
    const outputs = [new Output(amount, publicKeyHash)]
    const info = {
      version: 1,
      inputs,
      outputs,
      locktime: 0
    }
    return new Transaction(info)
  }

  /** pack transaction to protobuf
   * @return {Buffer}
   */
  toBuffer() {
    return TX.encode(this)
      .finish()
  }

  toJSON() {
    const obj = {
      version: this.version,
      inputs: this.inputs.map(l => l.toJSON()),
      outputs: this.outputs.map(l => l.toJSON()),
      locktime: this.locktime
    }
    return obj
  }

  /**
   * @return {String}
   */
  toString() {
    return this.toBuffer()
      .toString('hex')
  }

  /**
   * create transaction from protobuf formated data
   * @param buffer
   * @return {Transaction}
   */
  static fromBuffer(buffer) {
    const obj = TX.decode(buffer)
    return new Transaction(obj)
  }

  /**
   * create transaction from object
   * @param obj
   * @return {Transaction}
   */
  static fromJSON(obj) {
    if (obj instanceof Transaction) {
      return obj
    }
    return new Transaction(obj)
  }

  /** do sha256sha256 on transaction buffer
   * @return {Buffer}
   */
  hash() {
    if (!this._hash) {
      this._hash = Hash.defaultHash(this.toBuffer())
    }
    return this._hash
  }

  /**
   * debug usage
   * @return {string}
   */
  inspect() {
    return `<Transaction ${this.hash()
      .toString('hex')} >`
  }
}
