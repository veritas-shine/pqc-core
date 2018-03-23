import bx from 'base-x'
import xmss from 'xmss'

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

export default {
  base58,
  BufferUtil
}
