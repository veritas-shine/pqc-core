/* global describe, it, beforeEach */
/* eslint-disable no-new */

var assert = require('assert')
var proxyquire = require('proxyquire')
var hoodwink = require('hoodwink')

var BigInteger = require('bigi')
var ECPair = require('../src/ecpair')

var fixtures = require('./fixtures/ecpair.json')

var NETWORKS = require('../src/networks')
var NETWORKS_LIST = [] // Object.values(NETWORKS)
for (var networkName in NETWORKS) {
  NETWORKS_LIST.push(NETWORKS[networkName])
}

describe('ECPair', function () {
  describe('constructor', function () {
    it('defaults to compressed', function () {
      var keyPair = new ECPair(BigInteger.ONE)

      assert.strictEqual(keyPair.compressed, true)
    })

    it('supports the uncompressed option', function () {
      var keyPair = new ECPair(BigInteger.ONE, null, {
        compressed: false
      })

      assert.strictEqual(keyPair.compressed, false)
    })

    it('supports the network option', function () {
      var keyPair = new ECPair(BigInteger.ONE, null, {
        compressed: false,
        network: NETWORKS.testnet
      })

      assert.strictEqual(keyPair.network, NETWORKS.testnet)
    })

    fixtures.valid.forEach(function (f) {
      it('calculates the public point for ' + f.WIF, function () {
        var d = new BigInteger(f.d)
        var keyPair = new ECPair(d, null, {
          compressed: f.compressed
        })

        assert.strictEqual(keyPair.getPublicKeyBuffer().toString('hex'), f.Q)
      })
    })
  })

  describe('getPublicKeyBuffer', function () {
    var keyPair

    beforeEach(function () {
      keyPair = new ECPair(BigInteger.ONE)
    })

    it('wraps Q.getEncoded', hoodwink(function () {
      this.mock(keyPair.Q, 'getEncoded', function (compressed) {
        assert.strictEqual(compressed, keyPair.compressed)
      }, 1)

      keyPair.getPublicKeyBuffer()
    }))
  })

  describe('fromWIF', function () {
    fixtures.valid.forEach(function (f) {
      it('imports ' + f.WIF + ' (' + f.network + ')', function () {
        var network = NETWORKS[f.network]
        var keyPair = ECPair.fromWIF(f.WIF, network)

        assert.strictEqual(keyPair.d.toString(), f.d)
        assert.strictEqual(keyPair.compressed, f.compressed)
        assert.strictEqual(keyPair.network, network)
      })
    })

    fixtures.valid.forEach(function (f) {
      it('imports ' + f.WIF + ' (via list of networks)', function () {
        var keyPair = ECPair.fromWIF(f.WIF, NETWORKS_LIST)

        assert.strictEqual(keyPair.d.toString(), f.d)
        assert.strictEqual(keyPair.compressed, f.compressed)
        assert.strictEqual(keyPair.network, NETWORKS[f.network])
      })
    })

    fixtures.invalid.fromWIF.forEach(function (f) {
      it('throws on ' + f.WIF, function () {
        assert.throws(function () {
          var networks = f.network ? NETWORKS[f.network] : NETWORKS_LIST

          ECPair.fromWIF(f.WIF, networks)
        }, new RegExp(f.exception))
      })
    })
  })

  describe('toWIF', function () {
    fixtures.valid.forEach(function (f) {
      it('exports ' + f.WIF, function () {
        var keyPair = ECPair.fromWIF(f.WIF, NETWORKS_LIST)
        var result = keyPair.toWIF()

        assert.strictEqual(result, f.WIF)
      })
    })
  })

  describe('makeRandom', function () {
    var d = Buffer.from('0404040404040404040404040404040404040404040404040404040404040404', 'hex')
    var exWIF = 'KwMWvwRJeFqxYyhZgNwYuYjbQENDAPAudQx5VEmKJrUZcq6aL2pv'

    describe('uses randombytes RNG', function () {
      it('generates a ECPair', function () {
        var stub = { randombytes: function () { return d } }
        var ProxiedECPair = proxyquire('../src/ecpair', stub)

        var keyPair = ProxiedECPair.makeRandom()
        assert.strictEqual(keyPair.toWIF(), exWIF)
      })
    })

    it('allows a custom RNG to be used', function () {
      var keyPair = ECPair.makeRandom({
        rng: function (size) { return d.slice(0, size) }
      })

      assert.strictEqual(keyPair.toWIF(), exWIF)
    })

    it('retains the same defaults as ECPair constructor', function () {
      var keyPair = ECPair.makeRandom()

      assert.strictEqual(keyPair.compressed, true)
      assert.strictEqual(keyPair.network, NETWORKS.bitcoin)
    })

    it('supports the options parameter', function () {
      var keyPair = ECPair.makeRandom({
        compressed: false,
        network: NETWORKS.testnet
      })

      assert.strictEqual(keyPair.compressed, false)
      assert.strictEqual(keyPair.network, NETWORKS.testnet)
    })

    it('throws if d is bad length', function () {
      function rng () {
        return BigInteger.ZERO.toBuffer(28)
      }

      assert.throws(function () {
        ECPair.makeRandom({ rng: rng })
      }, /Expected Buffer\(Length: 32\), got Buffer\(Length: 28\)/)
    })

    it('loops until d is within interval [1, n - 1] : 1', hoodwink(function () {
      var rng = this.stub(function f () {
        if (f.calls === 0) return BigInteger.ZERO.toBuffer(32) // 0
        return BigInteger.ONE.toBuffer(32) // >0
      }, 2)

      ECPair.makeRandom({ rng: rng })
    }))
  })

  describe('getAddress', function () {
    fixtures.valid.forEach(function (f) {
      it('returns ' + f.address + ' for ' + f.WIF, function () {
        var keyPair = ECPair.fromWIF(f.WIF, NETWORKS_LIST)

        assert.strictEqual(keyPair.getAddress(), f.address)
      })
    })
  })

  describe('getNetwork', function () {
    fixtures.valid.forEach(function (f) {
      it('returns ' + f.network + ' for ' + f.WIF, function () {
        var network = NETWORKS[f.network]
        var keyPair = ECPair.fromWIF(f.WIF, NETWORKS_LIST)

        assert.strictEqual(keyPair.getNetwork(), network)
      })
    })
  })

  describe('ecdsa wrappers', function () {
    var keyPair, hash

    beforeEach(function () {
      keyPair = ECPair.makeRandom()
      hash = Buffer.alloc(32)
    })

    describe('signing', function () {
      // TODO
    })

    describe('verify', function () {
      // TODO
    })
  })
})
