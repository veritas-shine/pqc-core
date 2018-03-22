import Block from './block/block'
import BlockHeader from './block/blockheader'
import crypto from './crypto'
import errors from './errors'
import Opcode from './opcode'
import Networks from './networks'
import URI from './uri'
import Unit from './unit'
import Address from './address'
import Script from './script/script'
import Transaction from './transaction'
import PrivateKey from './privatekey'
import PublicKey from './publickey'

import Base58 from './encoding/base58'
import Base58Check from './encoding/base58check'
import BufferWriter from './encoding/bufferwriter'
import BufferReader from './encoding/bufferreader'
import Varint from './encoding/varint'

import BufferUtil from './util/buffer'
import JSUtil from './util/js'
import $ from './util/preconditions'

export const encoding = {
  Base58,
  Base58Check,
  BufferWriter,
  BufferReader,
  Varint
}

export const util = {
  BufferUtil,
  JSUtil,
  $
}

export default {
  Block,
  BlockHeader,
  crypto,
  errors,
  encoding,
  Opcode,
  Networks,
  URI,
  Address,
  Script,
  Transaction,
  PrivateKey,
  PublicKey,
  util,
  Unit
}
