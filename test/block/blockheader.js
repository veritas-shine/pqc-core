import path from 'path'
import pqccore from '../../lib'
import Block from '../../lib/block/block'

const { Transaction, Script } = pqccore
const { BN } = pqccore.crypto
const { BufferReader, BufferWriter } = pqccore.encoding
const { BlockHeader } = pqccore
const fs = require('fs');
const should = require('chai').should();

// https://test-insight.bitpay.com/block/000000000b99b16390660d79fcc138d2ad0c89a0d044c4201a02bdf1f61ffa11
const dataRawBlockBuffer = fs.readFileSync(path.join(__dirname, '../data/blk86756-testnet.dat'));
const dataRawBlockBinary = fs.readFileSync(path.join(__dirname, '../data/blk86756-testnet.dat'), 'binary');
const dataRawId = '68beb6264cb089315e6c8e571ab3bc4b897096da0bbbcb30502827abd1ed43cc';
const data = require('../data/blk86756-testnet');

describe('BlockHeader', () => {
  const version = data.version;
  const prevblockidbuf = Buffer.from(data.prevblockidhex, 'hex');
  const merklerootbuf = Buffer.from(data.merkleroothex, 'hex');
  const time = data.time;
  const qbits = data.qbits;
  const nonce = data.nonce;
  const bh = new BlockHeader({
    version,
    prevHash: prevblockidbuf,
    merkleRoot: merklerootbuf,
    time,
    qbits,
    nonce
  });
  const bhhex = data.blockheaderhex;
  const bhbuf = Buffer.from(bhhex, 'hex');

  it('should create block header', function () {
    const hash = '0000fcd2f56cfd911c8963510443ecb0bd82a254c1b22b8baee2a36eccd5e01e';
    const header = new BlockHeader({
      hash: '0000fcd2f56cfd911c8963510443ecb0bd82a254c1b22b8baee2a36eccd5e01e',
      version: 1,
      prevHash: Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex'),
      merkleRoot: Buffer.from('c28d0bb90de0d366f98bf1f8e4112eedbae754a4ca49d218dee48d7eef7d5bd9', 'hex'),
      time: 1521611579,
      qbits: 520158976,
      nonce: 33397
    })
    console.log(45, header.hash, header.toBuffer().toString('hex'))
  });
  it('should make a new blockheader', () => {
    new BlockHeader(bhbuf).toBuffer().toString('hex').should.equal(bhhex);
  });

  it('should not make an empty block', () => {
    (function () {
      new BlockHeader();
    }).should.throw('Unrecognized argument for BlockHeader');
  });

  describe('#constructor', () => {
    it('should set all the variables', () => {
      const bh = new BlockHeader({
        version,
        prevHash: prevblockidbuf,
        merkleRoot: merklerootbuf,
        time,
        qbits,
        nonce
      });
      should.exist(bh.version);
      should.exist(bh.prevHash);
      should.exist(bh.merkleRoot);
      should.exist(bh.time);
      should.exist(bh.qbits);
      should.exist(bh.nonce);
    });

    it('will throw an error if the argument object hash property doesn\'t match', () => {
      (function () {
        const bh = new BlockHeader({
          hash: '282d9317a7053d7c43d478eeec787207e03b8cd49b1684401df6cf8a2ded00a0',
          version,
          prevHash: prevblockidbuf,
          merkleRoot: merklerootbuf,
          time,
          qbits,
          nonce
        });
      }).should.throw('Argument object hash property does not match block hash.');
    });
  });

  describe('version', () => {
    it('is interpreted as an int32le', () => {
      const hex = 'ffffffff00000000000000000000000000000000000000000000000000000000000000004141414141414141414141414141414141414141414141414141414141414141010000000200000003000000';
      const header = BlockHeader.fromBuffer(Buffer.from(hex, 'hex'));
      header.version.should.equal(-1);
      header.timestamp.should.equal(1);
    });
  });


  describe('#fromObject', () => {
    it('should set all the variables', () => {
      const bh = BlockHeader.fromObject({
        version,
        prevHash: prevblockidbuf.toString('hex'),
        merkleRoot: merklerootbuf.toString('hex'),
        time,
        qbits,
        nonce
      });
      should.exist(bh.version);
      should.exist(bh.prevHash);
      should.exist(bh.merkleRoot);
      should.exist(bh.time);
      should.exist(bh.qbits);
      should.exist(bh.nonce);
    });
  });

  describe('#toJSON', () => {
    it('should set all the variables', () => {
      const json = bh.toJSON();
      should.exist(json.version);
      should.exist(json.prevHash);
      should.exist(json.merkleRoot);
      should.exist(json.time);
      should.exist(json.qbits);
      should.exist(json.nonce);
    });
  });

  describe('#fromJSON', () => {
    it('should parse this known json string', () => {
      const jsonString = JSON.stringify({
        version,
        prevHash: prevblockidbuf,
        merkleRoot: merklerootbuf,
        time,
        qbits,
        nonce
      });

      const json = new BlockHeader(JSON.parse(jsonString));
      should.exist(json.version);
      should.exist(json.prevHash);
      should.exist(json.merkleRoot);
      should.exist(json.time);
      should.exist(json.qbits);
      should.exist(json.nonce);
    });
  });

  describe('#fromString/#toString', () => {
    it('should output/input a block hex string', () => {
      const b = BlockHeader.fromString(bhhex);
      b.toString().should.equal(bhhex);
    });
  });

  describe('#fromBuffer', () => {
    it('should parse this known buffer', () => {
      BlockHeader.fromBuffer(bhbuf).toBuffer().toString('hex').should.equal(bhhex);
    });
  });

  describe('#fromBufferReader', () => {
    it('should parse this known buffer', () => {
      BlockHeader.fromBufferReader(BufferReader(bhbuf)).toBuffer().toString('hex').should.equal(bhhex);
    });
  });

  describe('#toBuffer', () => {
    it('should output this known buffer', () => {
      BlockHeader.fromBuffer(bhbuf).toBuffer().toString('hex').should.equal(bhhex);
    });
  });

  describe('#toBufferWriter', () => {
    it('should output this known buffer', () => {
      BlockHeader.fromBuffer(bhbuf).toBufferWriter().concat().toString('hex').should.equal(bhhex);
    });

    it('doesn\'t create a bufferWriter if one provided', () => {
      const writer = new BufferWriter();
      const blockHeader = BlockHeader.fromBuffer(bhbuf);
      blockHeader.toBufferWriter(writer).should.equal(writer);
    });
  });

  describe('#inspect', () => {
    it('should return the correct inspect of the genesis block', () => {
      const block = BlockHeader.fromRawBlock(dataRawBlockBinary);
      block.inspect().should.equal(`<BlockHeader ${dataRawId}>`);
    });
  });

  describe('#fromRawBlock', () => {
    it('should instantiate from a raw block binary', () => {
      const x = BlockHeader.fromRawBlock(dataRawBlockBinary);
      x.version.should.equal(2);
      new BN(x.qbits).toString('hex').should.equal('1c3fffc0');
    });

    it('should instantiate from raw block buffer', () => {
      const x = BlockHeader.fromRawBlock(dataRawBlockBuffer);
      x.version.should.equal(2);
      new BN(x.qbits).toString('hex').should.equal('1c3fffc0');
    });
  });

  describe('#validTimestamp', () => {
    const x = BlockHeader.fromRawBlock(dataRawBlockBuffer);

    it('should validate timpstamp as true', () => {
      const valid = x.validTimestamp(x);
      valid.should.equal(true);
    });


    it('should validate timestamp as false', () => {
      x.time = Math.round(new Date().getTime() / 1000) + BlockHeader.Constants.MAX_TIME_OFFSET + 100;
      const valid = x.validTimestamp(x);
      valid.should.equal(false);
    });
  });

  describe('#validProofOfWork', () => {
    it('should validate proof-of-work as true', () => {
      const x = BlockHeader.fromRawBlock(dataRawBlockBuffer);
      const valid = x.validProofOfWork(x);
      valid.should.equal(true);
    });

    it('should validate proof of work as false because incorrect proof of work', () => {
      const x = BlockHeader.fromRawBlock(dataRawBlockBuffer);
      const nonce = x.nonce;
      x.nonce = 0;
      const valid = x.validProofOfWork(x);
      valid.should.equal(false);
      x.nonce = nonce;
    });
  });

  describe('#getDifficulty', () => {
    it('should get the correct difficulty for block 86756', () => {
      const x = BlockHeader.fromRawBlock(dataRawBlockBuffer);
      x.qbits.should.equal(0x1c3fffc0);
      x.getDifficulty().should.equal(4);
    });

    it('should get the correct difficulty for testnet block 552065', () => {
      const x = new BlockHeader({
        qbits: 0x1b00c2a8
      });
      x.getDifficulty().should.equal(86187.62562209);
    });

    it('should get the correct difficulty for livenet block 373043', () => {
      const x = new BlockHeader({
        qbits: 0x18134dc1
      });
      x.getDifficulty().should.equal(56957648455.01001);
    });

    it('should get the correct difficulty for livenet block 340000', () => {
      const x = new BlockHeader({
        qbits: 0x1819012f
      });
      x.getDifficulty().should.equal(43971662056.08958);
    });

    it('should use exponent notation if difficulty is larger than Javascript number', () => {
      const x = new BlockHeader({
        qbits: 0x0900c2a8
      });
      x.getDifficulty().should.equal(1.9220482782645836 * 1e48);
    });
  });

  it('coverage: caches the "_id" property', () => {
    const blockHeader = BlockHeader.fromRawBlock(dataRawBlockBuffer);
    blockHeader.id.should.equal(blockHeader.id);
  });

  // it('should create genesis block', function () {
  //   const coinbase = '2018-02-26 PQC genesis block created.'
  //   const tx = new Transaction().from({
  //     txId: '0000000000000000000000000000000000000000000000000000000000000000',
  //     outputIndex: 0,
  //     script: Script.buildPublicKeyHashIn(),
  //     glv: 50 * 1e8
  //   }).to('GSJ6kv8dkAwknDKUajg6WQ85r49R4dSFB3', 50 * 1e8)
  //
  //   const header = new BlockHeader({
  //
  //   })
  //   const block = new Block()
  // });
});
