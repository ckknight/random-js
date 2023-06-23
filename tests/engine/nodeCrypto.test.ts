import * as crypto from "crypto";
import { nodeCrypto } from "../../src/engine/nodeCrypto";

describe("nodeCrypto", () => {
  if (typeof crypto.randomBytes !== "function") {
    it("throws when calling nodeCrypto.next", () => {
      const action = () => nodeCrypto.next();

      expect(action).toThrow();
    });
  } else {
    const discard = (count: number) => {
      for (let i = 0; i < count; ++i) {
        nodeCrypto!.next();
      }
    };

    const I32_COUNT = 128;

    it("calls crypto.randomBytes on a 128-length Int32Array", () => {
      const spy = jest.spyOn(crypto, "randomBytes");

      nodeCrypto!.next();

      expect(crypto.randomBytes).toHaveBeenCalledWith(I32_COUNT * 4);
      expect(spy.mock.results[0].value).toBeInstanceOf(Buffer);
      expect(spy.mock.results[0].value).toHaveLength(I32_COUNT * 4);
      discard(I32_COUNT - 1);
    });

    it("returns the values returned by crypto.randomBytes until exhausted", () => {
      const spy = jest.spyOn(crypto, "randomBytes");

      spy.mockImplementation(count => {
        const buffer = Buffer.alloc(count);
        for (let i = 0; i < count; ++i) {
          buffer[i] = i % 256;
        }
        return buffer;
      });

      for (let i = 0; i < I32_COUNT * 4; i += 4) {
        expect(nodeCrypto!.next()).toBe(
          ((i % 256) +
            ((i + 1) % 256 << 8) +
            ((i + 2) % 256 << 16) +
            ((i + 3) % 256 << 24)) |
            0
        );
      }
    });
  }
});
