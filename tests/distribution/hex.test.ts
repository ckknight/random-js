import { nativeMath } from "../../src/engine/nativeMath";
import { hex } from "../../src/distribution/hex";

describe("hex", () => {
  const owns = Object.prototype.hasOwnProperty;

  function countUnique(text: string) {
    const set: { [c: string]: boolean } = {};
    let count = 0;
    let i = text.length;
    while (i--) {
      const c = text.charAt(i);
      if (!owns.call(set, c)) {
        set[c] = true;
        ++count;
      }
    }
    return count;
  }

  [
    {
      pool: "0123456789ABCDEF",
      upper: true
    },
    {
      pool: "0123456789abcdef",
      upper: false
    }
  ].forEach(({ pool, upper }) => {
    describe(`when upper = ${upper}`, () => {
      it("returns hex strings of the requested length", () => {
        const length = 1337;
        const regex = new RegExp(`^[${pool}]{${length}}$`);

        const hexer = hex(upper);
        const actual = hexer(nativeMath, length);

        expect(actual).toMatch(regex);
        expect(countUnique(actual)).toBe(pool.length);
      });
    });
  });
});
