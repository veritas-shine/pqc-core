import bx from 'base-x'
import xmss from 'xmss'
import Hash from './hash'

const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const base58 = bx(BASE58)

const BufferUtil = {
  bufferToVector: (buffer) => {
    const ret = new xmss.VectorUChar()
    for (let i = 0; i < buffer.length; i++) {
      // Put some data
      ret.push_back(buffer[i])
    }
    return ret
  },
  vectorToBuffer: (vector) => {
    const size = vector.size()
    const buffer = Buffer.alloc(size)
    for (let i = 0; i < size; i++) {
      // Put some data
      buffer[i] = vector.get(i)
    }
    return buffer
  },
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
  encode: (buffer) => {
    buffer = BufferUtil.ensureBuffer(buffer)
    let hash = Hash.sha256sha256(buffer).slice(0, 4)
    hash = Buffer.concat([buffer, hash])
    return base58.encode(hash)
  },
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

export default {
  base58,
  base58check,
  BufferUtil
}
