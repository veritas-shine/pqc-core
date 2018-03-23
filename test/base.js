import pqccore from '../src'

const { Encoding } = pqccore

describe('encoding', () => {
  it('should encode base58', function () {
    const ba = Buffer.from('c825a1ecf2a6830c4401620c3a16f1995057c2ab', 'hex')
    const a = Encoding.base58.encode(ba)
    const address = '1KFHE7w8BhaENAswwryaoccDb6qcT6DbYY'
    const buf = Encoding.base58.decode(address)
    const b = Encoding.base58.encode(buf)
    console.log(a, b, ba.length, buf.length)
  })

  it('should create buffer', function () {
    console.log(Buffer.from([0x30]))
  });
})
