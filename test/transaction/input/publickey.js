import pqccore from '../../../lib'

const {
  Script, Address, Transaction, PrivateKey
} = pqccore

const should = require('chai').should();

describe('PublicKeyInput', () => {
  const utxo = {
    txid: '7f3b688cb224ed83e12d9454145c26ac913687086a0a62f2ae0bc10934a4030f',
    vout: 0,
    address: 'Gb45hMKzxfgKdSTi6kn133WrS7Hre3evBk',
    scriptPubKey: '76a914bcc6e04e161e5a9b837328f7f8bee4157bb95f5888ac',
    amount: 50,
    confirmations: 104,
    spendable: true
  };
  const privateKey = PrivateKey.fromWIF('2SRLnpdFnpiqzeAbJXSBoLeCvG65m7ham4N7ZuFuSgRSAmAVQwKDVrJnui3gY4Ywv7ZFVeW5QuFC4oakVAxetMxGVnvEyct');
  const address = privateKey.toAddress();
  utxo.address.should.equal(address.toString());

  const destKey = new PrivateKey();
  const fromAddress = new Address('Gb45hMKzxfgKdSTi6kn133WrS7Hre3evBk')
  const scriptPubkey = Script.buildPublicKeyHashOut(fromAddress)
  console.log(26, scriptPubkey.toHex())

  it('will correctly sign a publickey out transaction', function() {
    this.timeout(20 * 1000)
    const tx = new Transaction();
    tx.from(utxo);
    tx.to(destKey.toAddress(), 10000);
    tx.sign(privateKey);
    tx.inputs[0].script.toBuffer().length.should.be.above(0);
  });

  it('count can count missing signatures', function() {
    this.timeout(20 * 1000)
    const tx = new Transaction();
    tx.from(utxo);
    tx.to(destKey.toAddress(), 10000);
    const input = tx.inputs[0];
    input.isFullySigned().should.equal(false);
    tx.sign(privateKey);
    input.isFullySigned().should.equal(true);
  });

  it('it\'s size can be estimated', function() {
    this.timeout(20 * 1000)
    const tx = new Transaction();
    tx.from(utxo);
    tx.to(destKey.toAddress(), 10000);
    const input = tx.inputs[0];
    input._estimateSize().should.equal(107);
  });

  it('it\'s signature can be removed', function() {
    this.timeout(20 * 1000)
    const tx = new Transaction();
    tx.from(utxo);
    tx.to(destKey.toAddress(), 10000);
    const input = tx.inputs[0];
    tx.sign(privateKey);
    input.isFullySigned().should.equal(true);
    input.clearSignatures();
    input.isFullySigned().should.equal(false);
  });

  it('returns an empty array if private key mismatches', function() {
    this.timeout(20 * 1000)
    const tx = new Transaction();
    tx.from(utxo);
    tx.to(destKey.toAddress(), 10000);
    const input = tx.inputs[0];
    const signatures = input.getSignatures(tx, new PrivateKey(), 0);
    signatures.length.should.equal(0);
  });
});
