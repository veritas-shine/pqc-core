import Hash from '../hash'

export default class Transaction {
  constructor(obj) {
    this.version = obj.version
    this.inputs = []
    this.outputs = []
    this.locktime = 0
  }

  /**
   * @return {Buffer}
   */
  toBuffer() {
    const b1 = Buffer.from(new Uint32Array(this.version))
    let bi = Buffer.from(new Uint32Array(this.inputs.length))
    const b = this.inputs.map(looper => looper.toBuffer())
    b.unshift(bi)
    bi = Buffer.concat(b)

    let bo = Buffer.from(new Uint32Array(this.outputs.length))
    const b2 = this.outputs.map(looper => looper.toBuffer())
    b2.unshift(bo)
    bo = Buffer.concat(b2)

    const bt = Buffer.from(new Uint32Array(this.locktime))
    return Buffer.concat([b1, bi, bo, bt])
  }

  /**
   * @return {Buffer}
   */
  hash() {
    return Hash.defaultHash(this.toBuffer())
  }
}
