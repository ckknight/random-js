import { realZeroToOneInclusive } from "./realZeroToOneInclusive";
import { uint53Full } from "./uint53Full";

jest.mock("./uint53Full");

describe("realZeroToOneInclusive", () => {
  it("calls uint53Full and divides by the maximum", () => {
    const dummy = 0x1234567890abcd;
    (uint53Full as jest.Mock).mockReturnValue(dummy);
    const expected = dummy / 0x20000000000000;

    const actual = realZeroToOneInclusive({ next: () => 0 });

    expect(actual).toBe(expected);
  });
});
