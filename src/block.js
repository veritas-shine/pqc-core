import fastRoot from 'merkle-lib/fastRoot'
import IO from './io'
import Encoding from './encoding'
import Hash from './hash'
import Transaction from './transaction'
import Consensus from './consensus'

const {BufferUtil} = Encoding

function sha256cube256(buffer) {
  return Hash.sha256(Hash.cube256(buffer))
}

export default class Block {

  static hashFunction = sha256cube256
  static invalidNonce = -1

  constructor(obj) {
    this.height = obj.height

    this.version = obj.version
    this.prevHash = BufferUtil.ensureBuffer(obj.prevHash)
    this.qbits = obj.qbits
    this.time = obj.time
    this.merkleRoot = BufferUtil.ensureBuffer(obj.merkleRoot)
    this.transactions = obj.transactions.map(t => Transaction.fromJSON(t))

    this.nonce = obj.nonce

    if (obj.id && obj.id !== this.hash()
      .toString('hex')) {
      // provided id not match!!!
      throw new Error('invalid block id!')
    }

    // const txs = this.transactions.map(l => l.hash())
    // const root = fastRoot(txs, Hash.defaultHash)
    // if (!root.equals(this.merkleRoot)) {
    //   throw new Error('invalid merkle root!')
    // }

    Object.defineProperty(this, 'id', {
      get: () => this.hash()
        .toString('hex'),
      set: () => {
      }
    })
  }

  /**
   * create block from protobuf encoded Buffer
   * @param buffer {Buffer}
   */
  static fromBuffer(buffer) {
    const obj = IO.Block.decode(buffer)
    return new Block(obj)
  }

  /**
   * encode Block to Buffer by protobuf
   * @return {Buffer}
   */
  toBuffer() {
    return IO.Block.encode(this)
      .finish()
  }

  /**
   * convert to JSON formated Object
   * @return {Object}
   */
  toJSON() {
    const obj = {
      hash: this.id,
      height: this.height,
      version: this.version,
      prevHash: this.prevHash.toString('hex'),
      qbits: this.qbits,
      time: this.time,
      merkleRoot: this.merkleRoot.toString('hex'),
      transactions: this.transactions.map(tx => tx.toJSON()),
      nonce: this.nonce,
    }
    return obj
  }

  /**
   * hex string of protobuf encoded buffer
   * @return {String}
   */
  toString() {
    return this.toBuffer()
      .toString('hex')
  }

  /**
   * hash of this Block
   * @return {Buffer}
   */
  hash() {
    if (!this._hash) {
      this._hash = Block.hashFunction(Block.concatBuffer(this))
        .reverse()
    }
    return this._hash
  }


  /**
   * concat buffer of a block | blocktemplate
   * @return {Buffer}
   */
  static concatBuffer(blockTemplate) {
    const {version, prevHash, merkleRoot, time, qbits, nonce} = blockTemplate
    // Create little-endian long int (4 bytes) with the version (2) on the first byte
    const versionBuffer = Buffer.alloc(4);
    versionBuffer.writeInt32LE(version, 0);

    // Reverse the previous Block Hash and the merkle_root
    let buffer = Buffer.from(BufferUtil.ensureBuffer(prevHash))
    const reversedPrevHash = buffer.reverse()
    buffer = Buffer.from(BufferUtil.ensureBuffer(merkleRoot))
    const reversedMerkleRoot = buffer.reverse()

    // Buffer with time (4 Bytes), bits (4 Bytes) and nonce (4 Bytes) (later added and updated on each hash)
    const timeBitsNonceBuffer = Buffer.alloc(12)
    timeBitsNonceBuffer.writeInt32LE(time, 0)
    timeBitsNonceBuffer.writeInt32LE(qbits, 4)
    timeBitsNonceBuffer.writeInt32LE(nonce, 8)

    return Buffer.concat([versionBuffer, reversedPrevHash, reversedMerkleRoot, timeBitsNonceBuffer])
  }

  /**
   * get target buffer from qbits
   * @param bits {Number}
   * @return {Buffer}
   */
  static bitsToTargetBuffer(bits) {
    const exponent = bits >>> 24;
    const mantissa = bits & 0xFFFFFF;
    const target = (mantissa * (2 ** (8 * (exponent - 3)))).toString('16')

    // Make target a Buffer object
    return Buffer.from('0'.repeat(64 - target.length) + target, 'hex')
  }

  static mine(blockTemplate, nonce = 0) {
    const targetBuffer = Block.bitsToTargetBuffer(blockTemplate.qbits)
    console.log('target:', targetBuffer.toString('hex'))
    const {maxNonce} = Consensus.Block
    while (nonce < maxNonce) {
      blockTemplate.nonce = nonce
      const hash = Block.hashFunction(Block.concatBuffer(blockTemplate))
        .reverse()
      if (Buffer.compare(targetBuffer, hash) > 0) {
        // found one
        console.log('found:', nonce, hash.toString('hex'))
        return nonce
      }
      ++nonce
    }
    return Block.invalidNonce
  }
}
