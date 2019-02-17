import { nativeMath } from "./nativeMath";

describe("engines.nativeMath", () => {
  it("returns the result of Math.random() converted to a Int32", () => {
    const expected = 0xdeadbeef;
    jest.spyOn(Math, "random").mockReturnValue(expected / 0x100000000);

    const actual = nativeMath.next();

    expect(actual).toBe(expected | 0);
  });

  it("normalizes to an integer", () => {
    const expected = 0x12345678;
    jest
      .spyOn(Math, "random")
      .mockReturnValue((expected + 0.12345678) / 0x100000000);

    const actual = nativeMath.next();

    expect(actual).toBe(expected | 0);
  });
});
