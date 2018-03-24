import fastRoot from 'merkle-lib/fastRoot'
import IO from './io'
import Encoding from './encoding'
import Hash from './hash'
import Transaction from './transaction'

const { BufferUtil } = Encoding

function sha256cube256(buffer) {
  return Hash.sha256(Hash.cube256(buffer))
}

/**
 * concat buffer of a block | blocktemplate
 * @return {Buffer}
 */
function concatBuffer(blockTemplate) {
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
function bitsToTargetBuffer(bits) {
  const exponent = bits >>> 24;
  const mantissa = bits & 0xFFFFFF;
  const target = (mantissa * (2 ** (8 * (exponent - 3)))).toString('16')

  // Make target a Buffer object
  return Buffer.from('0'.repeat(64 - target.length) + target, 'hex')
}

export default class Block {

  static hashFunction = sha256cube256
  static maxNonce = 0xFFFFFFFF
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
  }

  /**
   *
   * @param buffer {Buffer}
   */
  static fromBuffer(buffer) {
    const obj = IO.Block.decode(buffer)
    return new Block(obj)
  }

  /**
   * @return {Buffer}
   */
  toBuffer() {
    return IO.Block.encode(this).finish()
  }

  /**
   *
   * @return {Buffer}
   */
  hash() {
    return Block.hashFunction(concatBuffer(this)).reverse()
  }

  static mine(blockTemplate, nonce = 0) {
    const targetBuffer = bitsToTargetBuffer(blockTemplate.qbits)
    console.log('target:', targetBuffer.toString('hex'))
    while (nonce < Block.maxNonce) {
      blockTemplate.nonce = nonce
      const hash = Block.hashFunction(concatBuffer(blockTemplate)).reverse()
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


