import Hash from '../hash'
import Input from './input'
import Output from './output'
import Keypair from '../keypair'

export default class Transaction {
  constructor(obj) {
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
    const obj = {
      version: this.version,
      inputs: this.inputs.map(l => l.toJSON()),
      outputs: this.outputs.map(l => l.toJSON()),
      locktime: this.locktime
    }
    return Buffer.from(JSON.stringify(obj), 'utf8')
  }

  static fromBuffer(buffer) {
    const obj = JSON.parse(buffer.toString('utf8'))
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
