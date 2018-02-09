
function rotL(a, b) {
  return (((a) << (b)) | ((a) >>> (32 - b)))
}

// For info on CubeHash see: http://cubehash.cr.yp.to/
// Init vector was computed by 10r rounds as described in the specification
const INIT = [-2096419883, 658334063, -679114902,
    1246757400, -1523021469, -289996037, 1196718146, 1168084361,
    -2027445816, -1170162360, -822837272, 625197683, 1543712850,
    -1365258909, 759513533, -424228083, -13765010209, -2824905881,
    -9887154026, 19352563566, 5669379852, -31581549269, 21359466527,
    10648459874, -8561790247, 9779462261, -22434204802, -4124492433,
    19608647852, 9541915967, 5144979599, -4355863926];

function int_to_hex(v) {
  let s = '';
  for (; v !== 0; v >>>= 8) {
    s += ((v >> 4) & 0xF).toString(16) + (v & 0xF).toString(16);
  }
  return s;
}

function swap(arr, i, j) {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
  return arr;
}

function transform(state) {
  let i
  let r
  const y = new Array(16);
  for (r = 0; r < 8; ++r) {
    for (i = 0; i < 16; ++i) state[i + 16] += y[i ^ 8] = state[i];
    for (i = 0; i < 16; ++i) state[i] = rotL(y[i], 7) ^ state[i + 16];
    for (i = 0; i < 16; ++i) y[i ^ 2] = state[i + 16];
    for (i = 0; i < 16; ++i) state[i + 16] = y[i] + state[i];
    for (i = 0; i < 16; ++i) y[i ^ 4] = state[i];
    for (i = 0; i < 16; ++i) state[i] = rotL(y[i], 11) ^ state[i + 16];
    for (i = 0; i < 16; i += 2) {
      swap(state, i + 16, i + 17);
    }
  }
  for (i = 0; i < 16; ++i) {
    y[i] = 0;
  }
}

export default {
  hash(data) {
    // init state
    let i
    let s = ''
    const state = new Array(32)
    for (i = 0; i < 32; i++) state[i] = INIT[i];
    // update with data
    data += String.fromCharCode(128);
    for (i = 0; i < data.length; i++) {
      state[0] ^= data.charCodeAt(i);
      transform(state);
    }
    // finalize
    state[31] ^= 1;
    for (i = 0; i < 10; i++) transform(state);
    // convert to hex
    for (i = 0; i < 8; i++) s += int_to_hex(state[i]);
    return s;
  }
}
