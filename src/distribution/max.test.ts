import { max } from './max';
import { integer } from './integer';

jest.mock("./integer");

describe("max", () => {
  it("returns the maximum value of the numbers given to integer", () => {
	  const minimum = 1;
    const maximum = 1337;
    const dummy = jest.fn();
    (integer as jest.Mock).mockReturnValue(dummy);

    const actual = max(minimum,maximum);

    expect(integer).toHaveBeenCalledWith(maximum, maximum);
    expect(actual).toBe(dummy);
  });
});
