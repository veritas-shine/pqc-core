import bx from 'base-x'
import Hash from './hash'

const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const base58 = bx(BASE58)

const BufferUtil = {
  /**
   * make sure obj can be converted to Buffer, or will throw an error
   * @param obj {*}
   * @return {Buffer}
   * @throws {Error}
   */
  ensureBuffer: (obj) => {
    if (Buffer.isBuffer(obj) || obj instanceof Uint8Array) {
      return obj
    }
    if (typeof obj === 'string') {
      return Buffer.from(obj, 'hex')
    }
    throw new Error('Invalid argument type!')
  }
}

const base58check = {
  /**
   * encode buffer into base58 format, added 4-length checksum
   * @param buffer {Buffer}
   * @return {string}
   */
  encode: (buffer) => {
    buffer = BufferUtil.ensureBuffer(buffer)
    let hash = Hash.sha256sha256(buffer).slice(0, 4)
    hash = Buffer.concat([buffer, hash])
    return base58.encode(hash)
  },
  /**
   * decode base58 encoded string to Buffer, with checksum checked
   * @param string
   * @return {Buffer}
   * @throws {Error}
   */
  decode: (string) => {
    const buffer = base58.decode(string)
    const length = buffer.length
    const data = buffer.slice(0, length - 4)
    const checksum = buffer.slice(length - 4, length)
    if (checksum.equals(Hash.sha256sha256(data).slice(0, 4))) {
      return data
    } else {
      throw new Error('Invalid checksum!')
    }
  }
}

/**
 * convert number to Buffer, if gived `fixedLength`, returned Buffer will
 * be padded to `fixedLength`
 * @param number {Number}
 * @param fixedLength {Number}
 * @return {Buffer}
 */
function numberToBuffer(number, fixedLength) {
  let str = number.toString(16)
  if (str.length / 2 === 1) {
    str = `0${str}`
  }

  if (fixedLength) {
    const count = fixedLength - str.length
    if (count > 0) {
      str = '0'.repeat(count) + str
    }
  }
  return Buffer.from(str, 'hex')
}

/**
 * convert int32 number to Buffer
 * @param number {Number}
 * @return {Buffer}
 */
function int32ToBuffer(number) {
  const b = Buffer.alloc(4)
  b.writeInt32LE(number)
  return b
}

export default {
  base58,
  base58check,
  BufferUtil,
  numberToBuffer,
  int32ToBuffer
}
