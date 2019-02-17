// import { integer } from "./integer";
import { integer } from "./integer";
import { picker } from "./picker";

jest.mock("./integer");

describe("picker", () => {
  it("throws when passed an empty array", () => {
    const array = {
      length: 0
    };

    const action = () => picker(array);

    expect(action).toThrowError(
      new RangeError("Cannot pick from a source with no items")
    );
  });

  it("returns a function that allows for indexing upon the provided array", () => {
    const engine = { next: () => 0 };
    const length = 1337;
    const index = 1234;
    const spy = jest.fn().mockReturnValue(index);
    (integer as jest.Mock).mockReturnValue(spy);
    const dummy = "hello";
    const array = {
      length,
      [index]: dummy
    };

    const pick = picker(array);
    const actual = pick(engine);

    expect(integer).toHaveBeenCalledWith(0, length - 1);
    expect(spy).toHaveBeenCalledWith(engine);
    expect(actual).toBe(dummy);
  });

  it("clones the initial array rather than holding onto the reference", () => {
    const engine = { next: () => 0 };
    const length = 1337;
    const index = 1234;
    const spy = jest.fn().mockReturnValue(index);
    (integer as jest.Mock).mockReturnValue(spy);
    const dummy = "hello";
    const array = {
      length,
      [index]: dummy
    };

    const pick = picker(array);
    array[index] = "there";
    array.length = 0;
    const actual = pick(engine);

    expect(actual).toBe(dummy);
  });

  it("slices the array with the arguments provided", () => {
    const engine = { next: () => 0 };
    const length = 1337;
    const index = 1234;
    const begin = 7;
    const end = -11;
    const spy = jest.fn().mockReturnValue(index - begin);
    (integer as jest.Mock).mockReturnValue(spy);
    const dummy = "hello";
    const array = {
      length,
      [index]: dummy
    };

    const pick = picker(array, begin, end);
    array[index] = "there";
    array.length = 0;
    const actual = pick(engine);

    expect(integer).toHaveBeenCalledWith(0, length - begin + end - 1);
    expect(actual).toBe(dummy);
  });
});
