import { realZeroToOneExclusive } from "./realZeroToOneExclusive";
import { uint53 } from "./uint53";

jest.mock("./uint53");

describe("realZeroToOneExclusive", () => {
  it("calls uint53 and divides by the maximum", () => {
    const dummy = 0x1234567890abcd;
    (uint53 as jest.Mock).mockReturnValue(dummy);
    const expected = dummy / 0x20000000000000;

    const actual = realZeroToOneExclusive({ next: () => 0 });

    expect(actual).toBe(expected);
  });
});
