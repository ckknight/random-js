import { die } from "./die";
import { integer } from "./integer";

jest.mock("./integer");

describe("die", () => {
  it("returns an integer distribution from 1 to sideCount", () => {
    const sideCount = 1337;
    const dummy = jest.fn();
    (integer as jest.Mock).mockReturnValue(dummy);

    const actual = die(sideCount);

    expect(integer).toHaveBeenCalledWith(1, sideCount);
    expect(actual).toBe(dummy);
  });
});
