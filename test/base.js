import pqccore from '../src'

const { Encoding } = pqccore
const {base58check} = Encoding

describe('encoding', () => {
  it('should encode base58', function () {
    const ba = Buffer.from('c825a1ecf2a6830c4401620c3a16f1995057c2ab', 'hex')
    const a = base58check.encode(ba)
    const address = '1KFHE7w8BhaENAswwryaoccDb6qcT6DbYY'
    const buf = base58check.decode(address)
    const b = base58check.encode(buf)
    console.log(a, b, ba.length, buf.length)
  })

  it('should create buffer', function () {
    const b = Buffer.from([0x30, 0x31])
    const b1 = Buffer.from(new Uint32Array(19999999999999))
    console.log(b, b.reverse(), b1)
  });
})
