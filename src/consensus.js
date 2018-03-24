import Hash from './hash'

export default {
  TX: {
    type: {
      Normal: 0x001,
      Payload: 0x002
    },
    coinbase: {
      HASH: Hash.NULL,
      Sequence: 0xFFFFFFFF,
      SequenceBuffer: Buffer.from([0xFF, 0xFF, 0xFF, 0xFF])
    }
  }
}
