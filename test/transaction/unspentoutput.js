const _ = require('lodash');
const chai = require('chai');

const should = chai.should();
const expect = chai.expect;

import pqccore from '../../lib'
const {UnspentOutput} = pqccore.Transaction

describe('UnspentOutput', () => {
  const sampleData1 = {
    'address': 'MU34A8zNBEgJhweh92pj1ByedFTTN8AuAa',
    'txId': 'a477af6b2667c29670467e4e0728b685ee07b240235771862318e29ddbe58458',
    'outputIndex': 0,
    'script': 'OP_DUP OP_HASH160 20 0xdfb046745e95abf6d4cb7a1710f6d65bd2b9cbe1 OP_EQUALVERIFY OP_CHECKSIG',
    'glv': 1020000
  };
  const sampleData2 = {
    'txid': 'e42447187db5a29d6db161661e4bc66d61c3e499690fe5ea47f87b79ca573986',
    'vout': 1,
    'address': 'MDjnU7SZTgcH3fuXB3gMqWLR6fpPGACud4',
    'scriptPubKey': '76a914073b7eae2823efa349e3b9155b8a735526463a0f88ac',
    'amount': 0.01080000
  };

  it('roundtrip from raw data', () => {
    expect(UnspentOutput(sampleData2).toObject()).to.deep.equal(sampleData2);
  });

  it('can be created without "new" operand', () => {
    expect(UnspentOutput(sampleData1) instanceof UnspentOutput).to.equal(true);
  });

  it('fails if no tx id is provided', () => {
    expect(() => {
      return new UnspentOutput({});
    }).to.throw();
  });

  it('fails if vout is not a number', () => {
    const sample = _.cloneDeep(sampleData2);
    sample.vout = '1';
    expect(() => {
      return new UnspentOutput(sample);
    }).to.throw();
  });

  it('displays nicely on the console', () => {
    const expected = '<UnspentOutput: a477af6b2667c29670467e4e0728b685ee07b240235771862318e29ddbe58458:0' +
                   ', glv: 1020000, address: MU34A8zNBEgJhweh92pj1ByedFTTN8AuAa>';
    expect(new UnspentOutput(sampleData1).inspect()).to.equal(expected);
  });

  describe('checking the constructor parameters', () => {
    const notDefined = {
      'txId': 'a477af6b2667c29670467e4e0728b685ee07b240235771862318e29ddbe58458',
      'outputIndex': 0,
      'script': 'OP_DUP OP_HASH160 20 0xdfb046745e95abf6d4cb7a1710f6d65bd2b9cbe1 OP_EQUALVERIFY OP_CHECKSIG',
    };
    const zero = {
      'txId': 'a477af6b2667c29670467e4e0728b685ee07b240235771862318e29ddbe58458',
      'outputIndex': 0,
      'script': 'OP_DUP OP_HASH160 20 0xdfb046745e95abf6d4cb7a1710f6d65bd2b9cbe1 OP_EQUALVERIFY OP_CHECKSIG',
      'amount': 0
    };
    it('fails when no amount is defined', () => {
      expect(() => {
        return new UnspentOutput(notDefined);
      }).to.throw('Must provide an amount for the output');
    });
    it('does not fail when amount is zero', () => {
      expect(() => {
        return new UnspentOutput(zero);
      }).to.not.throw();
    });
  });

  it('toString returns txid:vout', () => {
    const expected = 'a477af6b2667c29670467e4e0728b685ee07b240235771862318e29ddbe58458:0';
    expect(new UnspentOutput(sampleData1).toString()).to.equal(expected);
  });

  it('to/from JSON roundtrip', () => {
    const utxo = new UnspentOutput(sampleData2);
    const obj = UnspentOutput.fromObject(utxo.toJSON()).toObject();
    expect(obj).to.deep.equal(sampleData2);
    const str = JSON.stringify(UnspentOutput.fromObject(obj));
    expect(JSON.parse(str)).to.deep.equal(sampleData2);
    const str2 = JSON.stringify(new UnspentOutput(JSON.parse(str)));
    expect(JSON.parse(str2)).to.deep.equal(sampleData2);
  });
});
