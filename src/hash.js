import crypto from 'crypto'
import cubehash from 'cubehash'
import Encoding from './encoding'

const { BufferUtil } = Encoding

/**
 * @class Hash
 */
export default class Hash {
  /**
   * standard sha512 hash function
   * @param {Buffer} buffer
   * @return {Buffer}
   */
  static sha512(buffer) {
    buffer = BufferUtil.ensureBuffer(buffer)
    return crypto.createHash('sha512').update(buffer).digest()
  }

  /**
   * standard sha256 hash function
   * @param {Buffer} buffer
   * @return {Buffer}
   */
  static sha256(buffer) {
    buffer = BufferUtil.ensureBuffer(buffer)
    return crypto.createHash('sha256').update(buffer).digest()
  }

  /**
   * twice sha256 hash
   * @param {Buffer} buffer
   * @return {Buffer}
   */
  static sha256sha256(buffer) {
    buffer = BufferUtil.ensureBuffer(buffer)
    return Hash.sha256(Hash.sha256(buffer))
  }

  /**
   *
   * @param {Buffer} buffer
   * @return {Buffer}
   */
  static ripemd160(buffer) {
    buffer = BufferUtil.ensureBuffer(buffer)
    return crypto.createHash('ripemd160').update(buffer).digest();
  }

  /**
   * combined ripemd160 & sha256 hash function
   * @param {Buffer} buffer
   * @return {Buffer}
   */
  static sha256ripemd160(buffer) {
    buffer = BufferUtil.ensureBuffer(buffer)
    return Hash.ripemd160(Hash.sha256(buffer))
  }

  /**
   *
   * @param {Buffer} buffer
   * @return {Buffer}
   */
  static cube256(buffer) {
    buffer = BufferUtil.ensureBuffer(buffer)
    return cubehash(256, buffer)
  }
}

/**
 * placeholder hash for sha256, used in Block & Transaction
 * @type {string} NULL
 */
Hash.NULL = '0000000000000000000000000000000000000000000000000000000000000000'


/**
 * default hash function to create transaction id ... etc
 * @type {function}
 */
Hash.defaultHash = Hash.sha256sha256
