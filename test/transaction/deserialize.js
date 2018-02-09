import pqccore from '../../lib'

const {Script, Transaction, Opcode} = pqccore

import chai from 'chai'

const should = chai.should()
const expect = chai.expect

const vectors_valid = require('../data/pqcoind/tx_valid.json');
const vectors_invalid = require('../data/pqcoind/tx_invalid.json');

describe('Transaction deserialization', () => {
  describe('valid transaction test case', () => {
    let index = 0;
    vectors_valid.forEach((vector) => {
      it(`vector #${index}`, () => {
        if (vector.length > 1) {
          const hexa = vector[1];
          Transaction(hexa).serialize(true).should.equal(hexa);
          index++;
        }
      });
    });
  });
  describe('invalid transaction test case', () => {
    let index = 0;
    vectors_invalid.forEach((vector) => {
      it(`invalid vector #${index}`, () => {
        if (vector.length > 1) {
          const hexa = vector[1];
          Transaction(hexa).serialize(true).should.equal(hexa);
          index++;
        }
      });
    });
  });
});
