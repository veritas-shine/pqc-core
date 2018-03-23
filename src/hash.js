import crypto from 'crypto'
import Encoding from './encoding'

const { BufferUtil } = Encoding

export default class Hash {
  /**
   *
   * @param buffer {Buffer}
   * @return {Buffer}
   */
  static sha512(buffer) {
    buffer = BufferUtil.ensureBuffer(buffer)
    return crypto.createHash('sha512').update(buffer).digest()
  }

  /**
   *
   * @param buffer {Buffer}
   * @return {Buffer}
   */
  static sha256(buffer) {
    buffer = BufferUtil.ensureBuffer(buffer)
    return crypto.createHash('sha256').update(buffer).digest()
  }

  static sha256sha256(buffer) {
    buffer = BufferUtil.ensureBuffer(buffer)
    return Hash.sha256(Hash.sha256(buffer))
  }

  /**
   *
   * @param buffer {Buffer}
   * @return {Buffer}
   */
  static ripemd160(buffer) {
    buffer = BufferUtil.ensureBuffer(buffer)
    return crypto.createHash('ripemd160').update(buffer).digest();
  }

  /**
   *
   * @param buffer {Buffer}
   * @return {Buffer}
   */
  static sha256ripemd160(buffer) {
    buffer = BufferUtil.ensureBuffer(buffer)
    return Hash.sha256(Hash.ripemd160(buffer))
  }

  /**
   *
   */
  static defaultHash = Hash.sha256sha256
}
