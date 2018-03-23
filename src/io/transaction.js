import protobuf from 'protobufjs/light'

const {Field, Type} = protobuf

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
Field.d(1, 'int32')(TX.prototype, 'version')
Field.d(2, TXInput, 'repeated')(TX.prototype, 'inputs')
Field.d(3, TXOutput, 'repeated')(TX.prototype, 'outputs')
Field.d(4, 'int32')(TX.prototype, 'locktime')

export default {
  TXInput,
  TXOutput,
  TX
}
