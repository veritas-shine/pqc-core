import assert from 'assert'
import pqccore from '../../lib'
const {CubeHash} = pqccore.crypto

describe('cubehash test', () => {
  it('should ok', () => {
    // http://cubehash.cr.yp.to
    // http://en.wikipedia.org/wiki/CubeHash
    const tests = ['', 'Hello', 'The quick brown fox jumps over the lazy dog'];
    const hashs = [
      '38d1e8a22d7baac6fd5262d83de89cacf784a02caa866335299987722aeabc59',
      '692638db57760867326f851bd2376533f37b640bd47a0ddc607a9456b692f70f',
      '94e0c958d85cdfaf554919980f0f50b945b88ad08413e0762d6ff0219aff3e55'];
    for (let i = 0; i < tests.length; i++) {
      assert.equal(CubeHash.hash(tests[i]), hashs[i])
    }
  })
})
