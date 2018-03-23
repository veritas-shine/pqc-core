import Hash from '../hash'
import Input from './input'
import Output from './output'
import Keypair from '../keypair'
import IO from '../io'
const {TX} = IO

export default class Transaction {
  static NormalType = 0x1
  constructor(obj) {
    this.type = Transaction.NormalType
    this.version = obj.version
    this.inputs = obj.inputs.map(obj => Input.fromJSON(obj))
    this.outputs = obj.outputs.map(obj => Output.fromJSON(obj))
    this.locktime = obj.locktime
  }

  /**
   *
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

  /**
   * @return {Buffer}
   */
  toBuffer() {
    return TX.encode(this).finish()
  }

  static fromBuffer(buffer) {
    const obj = TX.decode(buffer)
    return new Transaction(obj)
  }

  /**
   * @return {Buffer}
   */
  hash() {
    return Hash.defaultHash(this.toBuffer())
  }

  inspect() {
    return `<Transaction ${this.hash().toString('hex')} >`
  }
}
