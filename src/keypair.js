import GLYPH from 'glyph-js'
import Network from './network'
import encoding from './encoding'
import Hash from './hash'

const {base58check, BufferUtil} = encoding

export default class Keypair {
  /**
   * create keypair from secret (seed) & network
   * @param {{secret: string, network: string}} options
   */
  constructor(options) {
    let { secret, network = Network.default } = options
    secret = BufferUtil.ensureBuffer(secret)

    this.network = Network[network]
    this.pair = new GLYPH(secret)
  }

  static fromBuffer() {

  }

  /**
   * buffer of privateKey
   * @return {Buffer}
   */
  privateKey() {
    return this.pair.privateKey()
  }

  /**
   * buffer of publicKey
   * @return {Buffer}
   */
  publicKey() {
    return this.pair.publicKey()
  }

  /**
   * convert publicKey to address, network magic prefix added
   * @return {string}
   */
  toAddress() {
    let buffer = Keypair.addressHashFunction(this.publicKey())
    const prefix = Buffer.from([this.network.publicKeyHash])
    buffer = Buffer.concat([prefix, buffer])
    return base58check.encode(buffer)
  }

  /**
   * decode publicKey hash from address
   * @param {string} address
   */
  static addressToPublicKeyHash(address) {
    const buffer = base58check.decode(address)
    return buffer.slice(1)
  }

  /**
   * create a signature of a `message` with privateKey
   * @param message {Buffer}
   * @return {Buffer}
   */
  sign(message) {
    return this.pair.sign(message)
  }

  /**
   * create a signature of a `message` with privateKey
   * static method version
   * @param message {Buffer}
   * @param privateKey {Buffer}
   * @return {Buffer}
   */
  static sign(message, privateKey) {
    return GLYPH.sign(message, privateKey)
  }

  /**
   * verify if the signature & message match
   * @param message {Buffer}
   * @param signature {Buffer}
   * @return {boolean}
   */
  verify(message, signature) {
    return GLYPH.verify(signature, message, this.publicKey())
  }

  /**
   * verify if the signature & message match
   * static method version
   * @param message {Buffer}
   * @param signature {Buffer}
   * @param publicKey {Buffer}
   */
  static verifyMessage(message, signature, publicKey) {
    return GLYPH.verify(signature, message, publicKey)
  }
}

Keypair.addressHashFunction = Hash.sha256ripemd160
