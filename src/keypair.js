import xmss from 'xmss'
import Network from './network'
import encoding from './encoding'
import Hash from './hash'

const {base58check, BufferUtil} = encoding

export default class Keypair {
  static addressHashFunction = Hash.sha256ripemd160

  constructor(options) {
    let { secret, network = Network.default } = options
    secret = BufferUtil.ensureBuffer(secret)
    const seed = BufferUtil.bufferToVector(secret.slice(0, 48))
    this.network = Network[network]
    this.pair = new xmss.Xmss(seed, 4)
  }

  static fromBuffer() {

  }

  privateKey() {
    return BufferUtil.vectorToBuffer(this.pair.getSK())
  }
  /**
   * @return {Buffer}
   */
  publicKey() {
    return BufferUtil.vectorToBuffer(this.pair.getPK())
  }

  /**
   * @return {String}
   */
  toAddress() {
    let buffer = Keypair.addressHashFunction(this.publicKey())
    const prefix = Buffer.from([this.network.publicKeyHash])
    buffer = Buffer.concat([prefix, buffer])
    return base58check.encode(buffer)
  }

  /**
   *
   * @param address {String}
   */
  static addressToPublicKeyHash(address) {
    const buffer = base58check.decode(address)
    return buffer.slice(1)
  }

  /**
   *
   * @param message {Buffer}
   * @return {Buffer}
   */
  sign(message) {
    const vector = BufferUtil.bufferToVector(message)
    const ret = this.pair.sign(vector)
    return BufferUtil.vectorToBuffer(ret)
  }

  /**
   *
   * @param message {Buffer}
   * @param signature {Buffer}
   * @return {Boolean}
   */
  verify(message, signature) {
    const mv = BufferUtil.bufferToVector(message)
    const sv = BufferUtil.bufferToVector(signature)
    return xmss.Xmss.verify(mv, sv, this.pair.getPK())
  }

  /**
   *
   * @param message {Buffer}
   * @param signature {Buffer}
   * @param publicKey {Buffer}
   */
  static verifyMessage(message, signature, publicKey) {
    const mv = BufferUtil.bufferToVector(message)
    const sv = BufferUtil.bufferToVector(signature)
    const pk = BufferUtil.bufferToVector(publicKey)
    return xmss.Xmss.verify(mv, sv, pk)
  }
}
