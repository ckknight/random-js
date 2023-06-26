import { Engine } from "../../src/types";
import { uuid4 } from "../../src/distribution/uuid4";

describe("uuid4", () => {
  function makeEngine(input: ReadonlyArray<number>): Engine {
    let index = 0;
    return { next: () => input[index++] };
  }

  [
    {
      input: [0, 0, 0, 0],
      output: "00000000-0000-4000-8000-000000000000"
    },
    {
      input: [0xffffffff, 0xffffffff, 0xffffffff, 0xffffffff],
      output: "ffffffff-ffff-4fff-bfff-ffffffffffff"
    },
    {
      input: [0xdeadbeef, 0x12345678, 0xfedcba98, 0x13371337],
      output: "deadbeef-5678-4567-ba98-cba913371337"
    },
    {
      input: [0x12345678, 0x90abcdef, 0x94746842, 0x81354732],
      output: "12345678-cdef-4cde-a842-468481354732"
    }
  ].forEach(({ input, output }) => {
    describe("with an engine that produces " + input, () => {
      it("returns '" + output + "'", () => {
        const engine = makeEngine(input);

        const actual = uuid4(engine);

        expect(actual).toBe(output);
      });
    });
  });
});
