import assert from 'assert'
import chai from 'chai'
import pqccore from '../lib'
const {PrivateKey, Networks} = pqccore
const should = chai.should();

describe('PrivateKey', () => {
  const wifHex = '9076537d384f48189193c1643a26a26fb7a99f73259e960f407eb83ce80bef8dbff48a7cadb51d29a13b6b72ac37a8cf71e72a6fd8c868c6a98cc95ea0b794a87a';
  const wifLiveNet = '2SRLnpdFnpiqzeAbJXSBoLeCvG65m7ham4N7ZuFuSgRSAmAVQwKDVrJnui3gY4Ywv7ZFVeW5QuFC4oakVAxetMxGVnvEyct';
  const buf = Buffer.from(wifHex, 'hex');
  const publicKeyHex = '04401d387c718f5fe144dd094400ef6a58e8c83023f6bd3e7ab48296e88f91b4ebaf7a4621ed9cdd9be0e3e0a8383580c4ecb25f0f0238637bb8101e97d4ec5054fc'

  it('should create private key from buffer', function() {
    this.timeout(20 * 1000)
    const privatekey = PrivateKey.fromBuffer(buf)
    privatekey.toString().should.equal(wifHex)
  });

  it('should create private key from hex string', function() {
    this.timeout(20 * 1000)
    const privatekey = PrivateKey.fromString(wifHex)
    privatekey.toString().should.equal(wifHex)
  });

  it('should create private key from wif string', function() {
    this.timeout(20 * 1000)
    const privatekey = PrivateKey.fromString(wifLiveNet)
    privatekey.toString().should.equal(wifHex)
  });

  it('should create private key from JSON Object', function() {
    this.timeout(20 * 1000)
    const privatekey = PrivateKey.fromObject({
      bn: buf.slice(1),
      network: buf[0]
    })
    privatekey.toString().should.equal(wifHex)
  });

  it('should create private key from randm bytes', function() {
    this.timeout(20 * 1000)
    for (let i = 0; i < 4; ++i) {
      const privatekey = PrivateKey.fromRandom()
      console.log(privatekey.toWIF(), privatekey.toPublicKey().toString())
      should.exist(privatekey)
    }
  });

  it('should encode private key to hex string', function() {
    this.timeout(20 * 1000)
    const privatekey = PrivateKey.fromString(wifHex)
    privatekey.toString().should.equal(wifHex);
  });

  it('should encode private key to buffer', function() {
    this.timeout(20 * 1000)
    const privatekey = PrivateKey.fromBuffer(buf)
    assert.deepEqual(privatekey.toBuffer(), buf)
  })

  it('should generate public key from a private key', function() {
    this.timeout(20 * 1000)
    for (let i = 0; i < 4; ++i) {
      const privatekey = PrivateKey.fromBuffer(buf)
      const publicKey = privatekey.toPublicKey()
      publicKey.toString().should.equal(publicKeyHex)
    }
  });

  it('should generate address from a private key', function() {
    this.timeout(20 * 1000)
    for (let i = 0; i < 4; ++i) {
      const privatekey = PrivateKey.fromRandom();
      const address = privatekey.toAddress(Networks.get('testnet'));
      console.log(address, privatekey.toPublicKey());
    }
  });

  it('should convert to JSON Object', function() {
    this.timeout(20 * 1000)
    const privatekey = PrivateKey.fromBuffer(buf);
    const obj = privatekey.toObject();
    const json = privatekey.toJSON();
    assert.deepEqual(obj, json);
  });

  it('should show inspect string', function() {
    this.timeout(20 * 1000)
    const privatekey = PrivateKey.fromBuffer(buf)
    console.log(77, privatekey.toWIF(), privatekey.toString())
    privatekey.inspect().should.equal(`<PrivateKey: ${wifHex}, network: livenet, uncompressed>`);
  });
});
