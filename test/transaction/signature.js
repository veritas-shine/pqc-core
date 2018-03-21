import assert from 'assert'
require('chai').should()
const {expect} = require('chai')


import pqccore from '../../lib'
const {Script, Transaction, errors, PrivateKey} = pqccore
const TransactionSignature = Transaction.Signature

describe('TransactionSignature', () => {
  const fromAddress = 'Gb45hMKzxfgKdSTi6kn133WrS7Hre3evBk';
  const privateKey = '2SRLnpdFnpiqzeAbJXSBoLeCvG65m7ham4N7ZuFuSgRSAmAVQwKDVrJnui3gY4Ywv7ZFVeW5QuFC4oakVAxetMxGVnvEyct';
  const simpleUtxoWith100000Satoshis = {
    address: fromAddress,
    txId: 'a477af6b2667c29670467e4e0728b685ee07b240235771862318e29ddbe58458',
    outputIndex: 0,
    script: Script.buildPublicKeyHashOut(fromAddress).toString(),
    glv: 100000
  };

  const testJSON = '{"publicKey":"04440000000124ca9482e0b72fa244c777ba834ac50a9913f947f6e44cf22dc107760752f6c376537d384f48189193c1643a26a26fb7a99f73259e960f407eb83ce80bef8dbf","prevTxId":"a477af6b2667c29670467e4e0728b685ee07b240235771862318e29ddbe58458","outputIndex":0,"inputIndex":0,"signature":"3045022100c728eac064154edba15d4f3e6cbd9be6da3498f80a783ab3391f992b4d9d71ca0220729eff4564dc06aa1d80ab73100540fe5ebb6f280b4a87bc32399f861a7b2563","sigtype":1}';
  const testObject = JSON.parse(testJSON);

  const getSignatureFromTransaction = function () {
    const transaction = new Transaction();
    transaction.from(simpleUtxoWith100000Satoshis);
    return transaction.getSignatures(privateKey)[0];
  };

  it('can be created without the `new` keyword', function() {
    this.timeout(20 * 1000)
    const privKey = new PrivateKey(privateKey)
    console.log(privKey.toAddress(), privKey.toPublicKey())
    const signature = getSignatureFromTransaction();
    const serialized = signature.toObject();
    const nonew = new TransactionSignature(serialized);
    expect(nonew.toObject()).to.deep.equal(serialized);
  });

  it('can be retrieved from Transaction#getSignatures', function() {
    this.timeout(20 * 1000)
    const signature = getSignatureFromTransaction();
    expect(signature instanceof TransactionSignature).to.equal(true);
  });

  // it('fails when trying to create from invalid arguments', function() {
  //   this.timeout(20 * 1000)
  //   expect(() => {
  //     return new TransactionSignature();
  //   }).to.throw(errors.InvalidArgument);
  //   expect(() => {
  //     return new TransactionSignature(1);
  //   }).to.throw(errors.InvalidArgument);
  //   expect(() => {
  //     return new TransactionSignature('hello world');
  //   }).to.throw(errors.InvalidArgument);
  // });
  it('returns the same object if called with a TransactionSignature', function() {
    this.timeout(20 * 1000)
    const signature = getSignatureFromTransaction();
    assert.deepEqual(new TransactionSignature(signature), signature);
  });

  it('gets returned by a P2SH multisig output', function() {
    this.timeout(20 * 1000)
    const private1 = new PrivateKey('2SWYiDzgzw1dmDh1SfZXi51kBUD6A1Qzncjf4Fgi1zm4LqxaM9qtRnLULeZjwMc97sfxwAka9j8Kz2d8VSwgFAKuj8AUgmg');
    const private2 = new PrivateKey('2SHixbZhuEYdkg6uCHFLTL7VpMQvXwQd67o2FaJBPEqeMRqiQP23onRNMfZzDQy3ZCZ3ypc9xMh8xBqGQELrz9o8s9SLgNF');
    const public1 = private1.publicKey;
    const public2 = private2.publicKey;
    const utxo = {
      txId: '0000000000000000000000000000000000000000000000000000000000000000', // Not relevant
      outputIndex: 0,
      script: Script.buildMultisigOut([public1, public2], 2).toScriptHashOut(),
      glv: 100000
    };
    const transaction = new Transaction().from(utxo, [public1, public2], 2);
    let signatures = transaction.getSignatures(private1);
    expect(signatures[0] instanceof TransactionSignature).to.equal(true);
    signatures = transaction.getSignatures(private2);
    expect(signatures[0] instanceof TransactionSignature).to.equal(true);
  });

  it('can be aplied to a Transaction with Transaction#addSignature', function() {
    this.timeout(20 * 1000)
    const transaction = new Transaction();
    transaction.from(simpleUtxoWith100000Satoshis);
    const signature = transaction.getSignatures(privateKey)[0];
    const addSignature = function () {
      return transaction.applySignature(signature);
    };
    expect(signature instanceof TransactionSignature).to.equal(true);
    expect(addSignature).to.not.throw();
  });

  describe('serialization', () => {
    it('serializes to an object and roundtrips correctly', function() {
      this.timeout(20 * 1000)
      const signature = getSignatureFromTransaction();
      const serialized = signature.toObject();
      expect(new TransactionSignature(serialized).toObject()).to.deep.equal(serialized);
    });

    it('can be deserialized with fromObject', function() {
      this.timeout(20 * 1000)
      const signature = getSignatureFromTransaction();
      const serialized = signature.toObject();
      expect(TransactionSignature.fromObject(serialized).toObject()).to.deep.equal(serialized);
    });

    it('can deserialize when signature is a buffer', function() {
      this.timeout(20 * 1000)
      const signature = getSignatureFromTransaction();
      const serialized = signature.toObject();
      serialized.signature = Buffer.from(serialized.signature, 'hex');
      expect(TransactionSignature.fromObject(serialized).toObject()).to.deep.equal(signature.toObject());
    });

    it('can roundtrip to/from json', () => {
      const signature = getSignatureFromTransaction();
      const serialized = signature.toObject();
      const json = JSON.stringify(signature);
      expect(new TransactionSignature(JSON.parse(json)).toObject()).to.deep.equal(serialized);
      expect(TransactionSignature.fromObject(JSON.parse(json)).toObject()).to.deep.equal(serialized);
    });

    it('can parse a previously known json string', () => {
      const str = JSON.stringify(new TransactionSignature(JSON.parse(testJSON)));
      expect(JSON.parse(str)).to.deep.equal(JSON.parse(testJSON));
    });

    it('can deserialize a previously known object', () => {
      expect(new TransactionSignature(testObject).toObject()).to.deep.equal(testObject);
    });
  });
});
