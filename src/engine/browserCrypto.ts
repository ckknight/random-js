import { Engine } from "../types";
import { Int32Array } from "../utils/Int32Array";

export const browserCrypto: Engine | null = (() => {
  try {
    const test = new Int32Array(1);
    crypto.getRandomValues(test);
    if (typeof test[0] === "number") {
      let data: Int32Array | null = null;
      const COUNT = 128;
      let index = COUNT;
      return {
        next() {
          if (index >= COUNT) {
            if (data === null) {
              data = new Int32Array(COUNT);
            }
            crypto.getRandomValues(data);
            index = 0;
          }
          return data![index++] | 0;
        }
      };
    }
  } catch {
    // nothing to do
  }
  return null;
})();
