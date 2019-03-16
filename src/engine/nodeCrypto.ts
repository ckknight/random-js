import { Engine } from "../types";

let data: Int32Array | null = null;
const COUNT = 128;
let index = COUNT;

/**
 * An Engine that relies on the node-available
 * `require('crypto').randomBytes`, which has been available since 0.58.
 *
 * See https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback
 *
 * If unavailable or otherwise non-functioning, then `nodeCrypto` will
 * likely `throw` on the first call to `next()`.
 */
export const nodeCrypto: Engine = {
  next() {
    if (index >= COUNT) {
      data = new Int32Array(
        new Int8Array(require("crypto").randomBytes(4 * COUNT)).buffer
      );
      index = 0;
    }
    return data![index++] | 0;
  }
};
