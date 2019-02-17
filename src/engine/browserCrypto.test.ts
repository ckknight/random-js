import { browserCrypto } from "./browserCrypto";

describe("browserCrypto", () => {
  if (
    typeof crypto === "undefined" ||
    typeof crypto.getRandomValues !== "function" ||
    typeof Int32Array !== "function"
  ) {
    it("is null due to lack of support", () => {
      expect(browserCrypto).toBe(null);
    });
  } else {
    const discard = (count: number) => {
      for (let i = 0; i < count; ++i) {
        browserCrypto!.next();
      }
    };

    it("calls crypto.getRandomValues on a 128-length Int32Array", () => {
      const spy = jest.spyOn(crypto, "getRandomValues");

      browserCrypto!.next();

      expect(crypto.getRandomValues).toHaveBeenCalled();
      const arg = spy.mock.calls[0][0];
      expect(arg instanceof Int32Array).toBe(true);
      expect((arg as Int32Array).length).toBe(128);
      discard(127);
    });

    it("returns the values returned by crypto.getRandomValues until exhausted", () => {
      const spy = jest.spyOn(crypto, "getRandomValues");

      spy.mockImplementation(array => {
        if (!(array instanceof Int32Array)) {
          throw new Error("Unexpected array type");
        }
        for (let i = 0; i < 128; ++i) {
          array[i] = i;
        }
        return array;
      });

      for (let i = 0; i < 128; ++i) {
        expect(browserCrypto!.next()).toBe(i);
      }
    });
  }
});
