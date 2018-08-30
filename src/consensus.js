import Hash from './hash'

/**
 * consensus
 */
export default {
  Block: {
    maxNonce: 0xFFFFFFFF
  },
  TX: {
    /**
     * transaction type enums
     */
    type: {
      Normal: 0x001,
      Payload: 0x002
    },
    /**
     * coinbase parameters
     */
    coinbase: {
      HASH: Hash.NULL,
      Sequence: 0xFFFFFFFF,
      SequenceBuffer: Buffer.from([0xFF, 0xFF, 0xFF, 0xFF])
    }
  }
}
