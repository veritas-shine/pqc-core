import assert from 'assert'
import merkle from 'merkle-lib'
import fastRoot from 'merkle-lib/fastRoot'
import pqccore from '../../lib'
import data from '../data/blk86756-testnet.json'

const {Hash} = pqccore.crypto

describe('Merkle', () => {
  it('should ', function () {
    const txs = data.transactions.map(t => Buffer.from(t.hash, 'hex'))
    const root = fastRoot(txs, Hash.sha256sha256)
    // assert.equal(root.toString('hex'), '58e6d52d1eb00470ae1ab4d5a3375c0f51382c6f249fff84e9888286974cfc97')
    const tree = merkle(txs, Hash.sha256sha256)
    console.log(15, root, tree[tree.length - 1].toString('hex'))
  })

  it('should test2', function () {
    const hashes = [
      '8de81b651caaeba5021ae8459b450dffe71c8a630039efc3d5a699fa055eda78',
      '66c1be44c4e5899af46a3b4142f31f95abab7111e707991bbc98f447a5310b4d',
      'be5b1f1cbb890cbe53ef5689715ee0386cb81aaf47c13f9aba96600b93965e8e',
      '7adf1a6b0f66c97b4ce48b026b7a496fd7d495330ef0a026469d12cb49511b4f',
      '3e24580de3f6d75cb77e32472d5b76e14206294e6e82a3e7bb0a1189e363f81a'
    ]
    const txs = hashes.map(t => Buffer.from(t, 'hex'))
    const root = fastRoot(txs, Hash.sha256)
    assert.equal(root.toString('hex'), '28893c39d71921af602921bf5916f815b946144d8044e3f01e7049d74340eaf5')
  });
})
