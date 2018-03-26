import pqccore from '../src'
import fastRoot from 'merkle-lib/fastRoot'

const { Keypair, Block, Encoding, Transaction, Hash } = pqccore

describe('Block', () => {
  const secret = Hash.sha512('glv')
  const keypair = new Keypair({ secret })
  const coinbase = Buffer.from('this is genesis block!', 'utf8')

  it('should create genesis block', function () {
    this.timeout(2000 * 1000)
    const tx = Transaction.createCoinbaseTransaction(keypair, coinbase, 50 * 1e8)
    const merkleRoot = fastRoot([tx.hash()], Hash.defaultHash)
    const time = Math.floor(Date.now() / 1000)
    const template = {
      version: 1,
      prevHash: Encoding.BufferUtil.ensureBuffer(Hash.NULL),
      qbits: 0x1f00ffff,
      time,
      merkleRoot,
      height: 0
    }
    const nonce = Block.mine(template)
    template.nonce = nonce
    template.transactions = [tx]
    const block = new Block(template)
    const buffer = block.toBuffer()
    console.log(29, buffer.length, buffer.toString('hex'), block.id)
    const b2 = Block.fromBuffer(buffer)
    console.log(31, b2.toJSON())
  });
})
