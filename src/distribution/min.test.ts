import { min } from './min';
import { integer } from './integer';

jest.mock("./integer");

describe("min", () => {
  it("returns the minimum value of the numbers given to integer", () => {
	  const minimum = 1;
    const maximum = 1337;
    const dummy = jest.fn();
    (integer as jest.Mock).mockReturnValue(dummy);

    const actual = min(minimum,maximum);

    expect(integer).toHaveBeenCalledWith(minimum, minimum);
    expect(actual).toBe(dummy);
  });
});
