import fastRoot from 'merkle-lib/fastRoot'
import Encoding from './encoding'
import Hash from './hash'

const { BufferUtil } = Encoding

function sha256cube256(buffer) {
  return Hash.sha256(Hash.cube256(buffer))
}

export default class Block {

  static hashFunction = sha256cube256

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

  /**
   *
   * @return {Buffer}
   */
  concatBuffer() {
    // Create little-endian long int (4 bytes) with the version (2) on the first byte
    const versionBuffer = Buffer.alloc(4);
    versionBuffer.writeInt32LE(this.version, 0);

    // Reverse the previous Block Hash and the merkle_root
    const reversedPrevHash = BufferUtil.ensureBuffer(this.prevHash).reverse()
    const reversedMerkleRoot = BufferUtil.ensureBuffer(this.merkleRoot).reverse()

    // Buffer with time (4 Bytes), bits (4 Bytes) and nonce (4 Bytes) (later added and updated on each hash)
    const timeBitsNonceBuffer = Buffer.alloc(12)
    timeBitsNonceBuffer.writeInt32LE(this.time, 0)
    timeBitsNonceBuffer.writeInt32LE(this.qbits, 4)
    timeBitsNonceBuffer.writeInt32LE(this.nonce, 8)

    return Buffer.concat([versionBuffer, reversedPrevHash, reversedMerkleRoot, timeBitsNonceBuffer])
  }

  /**
   *
   * @return {Buffer}
   */
  hash() {
    return Block.hashFunction(this.concatBuffer()).reverse()
  }

  mine() {

  }
}


