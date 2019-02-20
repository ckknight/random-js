import { Engine } from "../types";

export const nodeCrypto = ((): Engine => {
  let data: Int32Array | null = null;
  const COUNT = 128;
  let index = COUNT;
  return {
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
})();
