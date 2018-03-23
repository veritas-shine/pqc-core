import protobuf from 'protobufjs/light'

const {Field} = protobuf

function TXInput(properties) {
  protobuf.Message.call(this, properties)
}

(TXInput.prototype = Object.create(protobuf.Message)).constructor = TXInput

Field.d(1, 'bytes')(TXInput.prototype, 'prevTxID')
Field.d(2, 'int32')(TXInput.prototype, 'outIndex')
Field.d(3, 'bytes')(TXInput.prototype, 'signature')
Field.d(4, 'bytes', 'optional')(TXInput.prototype, 'publicKey')

function TXOutput(properties) {
  protobuf.Message.call(this, properties)
}

(TXOutput.prototype = Object.create(protobuf.Message)).constructor = TXOutput
Field.d(1, 'double')(TXOutput.prototype, 'amount')
Field.d(2, 'bytes')(TXOutput.prototype, 'publicKeyHash')

function TX(properties) {
  protobuf.Message.call(this, properties)
}

(TX.prototype = Object.create(protobuf.Message)).constructor = TX
Field.d(1, 'int32')(TX.prototype, 'type')
Field.d(2, 'int32')(TX.prototype, 'version')
Field.d(3, TXInput, 'repeated')(TX.prototype, 'inputs')
Field.d(4, TXOutput, 'repeated')(TX.prototype, 'outputs')
Field.d(5, 'int32')(TX.prototype, 'locktime')

function Block(properties) {
  protobuf.Message.call(this, properties)
}

(Block.prototype = Object.create(protobuf.Message)).constructor = Block
Field.d(1, 'int32')(Block.prototype, 'version')
Field.d(2, 'bytes')(Block.prototype, 'prevHash')
Field.d(3, 'int32')(Block.prototype, 'qbits')
Field.d(4, 'int32')(Block.prototype, 'time')
Field.d(5, 'bytes')(Block.prototype, 'merkleRoot')
Field.d(6, TX, 'repeated')(Block.prototype, 'transactions')
Field.d(7, 'int32')(Block.prototype, 'nonce')
Field.d(8, 'double')(Block.prototype, 'height')

export default {
  TXInput,
  TXOutput,
  TX,
  Block
}
