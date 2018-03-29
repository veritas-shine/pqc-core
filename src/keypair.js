import GLYPH from 'glyph-js'
import Network from './network'
import encoding from './encoding'
import Hash from './hash'

const {base58check, BufferUtil} = encoding

export default class Keypair {
  static addressHashFunction = Hash.sha256ripemd160

  constructor(options) {
    let { secret, network = Network.default } = options
    secret = BufferUtil.ensureBuffer(secret)

    this.network = Network[network]
    this.pair = GLYPH.createKey(secret)
  }

  static fromBuffer() {

  }

  privateKey() {
    return this.pair.private
  }
  /**
   * @return {Buffer}
   */
  publicKey() {
    return this.pair.public
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
    return GLYPH.sign(message, this.privateKey())
  }

  /**
   *
   * @param message {Buffer}
   * @param signature {Buffer}
   * @return {Boolean}
   */
  verify(message, signature) {
    return GLYPH.verify(signature, message, this.publicKey())
  }

  /**
   *
   * @param message {Buffer}
   * @param signature {Buffer}
   * @param publicKey {Buffer}
   */
  static verifyMessage(message, signature, publicKey) {
    return GLYPH.verify(signature, message, publicKey)
  }
}
