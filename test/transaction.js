import pqccore from '../src'
import IO from '../src/io'

const {TXInput, TXOutput} = IO
const {Transaction, Keypair, Hash} = pqccore

describe('Transaction', () => {
  const secret = Hash.sha512('glv')
  const keypair = new Keypair({secret})
  const coinbase = Buffer.from('this is genesis block!', 'utf8')
  it('should create transaction', function () {
    const tx = Transaction.createCoinbaseTransaction(keypair, coinbase, 50 * 1e8)
    console.log(tx.toBuffer().toString('hex'))
  });

  it('should create transaction from hex', function () {
    const hex = '080110011a3c0a20000000000000000000000000000000000000000000000000000000000000000010001a16746869732069732067656e6573697320626c6f636b21222b09000000205fa0f24112209baecd772abcacd74deed0312607fab6f0f7cff17f0432789674ce4512c264c62800'
    const buffer = Buffer.from(hex, 'hex')
    const tx = Transaction.fromBuffer(buffer)
    console.log(tx)
    tx.inputs.forEach(looper => {
      const m = new TXInput(looper)
      const buffer = TXInput.encode(m).finish()
      console.log(buffer.toString('hex'))
      console.log(looper.toBuffer().toString('hex'))
      console.log(TXInput.decode(buffer))
    })

    tx.outputs.forEach(looper => {
      console.log(30, looper.amount)
      const m = new TXOutput(looper)
      const buffer = TXOutput.encode(m).finish()
      console.log(buffer.toString('hex'))
      console.log(TXOutput.decode(buffer))
    })
  });
})
