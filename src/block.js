import fastRoot from 'merkle-lib/fastRoot'
import Hash from './hash'

export default class Block {

  static hashFunction = Hash.sha256sha256

  constructor(obj) {
    this.height = obj.height

    this.version = obj.version
    this.prevHash = obj.prevHash
    this.qbits = obj.qbits
    this.time = obj.time
    this.merkleRoot = obj.merkleRoot
    this.transactions = obj.transactions

    this.nonce = 0
  }

  concatBuffer() {

  }

  hash() {
    return Block.hashFunction(this)
  }

  mine() {

  }
}


