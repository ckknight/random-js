import { integer } from "../../src/distribution/integer";
import { pick } from "../../src/distribution/pick";

jest.mock("../../src/distribution/integer");

describe("pick", () => {
  describe("with an empty array", () => {
    it("throws", () => {
      const engine = { next: () => 0 };
      const array = {
        length: 0
      };

      const action = () => pick(engine, array);

      expect(action).toThrowError(
        new RangeError("Cannot pick from an empty array")
      );
    });
  });

  describe("with a non-empty array", () => {
    it("creates an integer distribution and indexes upon a provided array", () => {
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

      const actual = pick(engine, array);

      expect(integer).toHaveBeenCalledWith(0, length - 1);
      expect(spy).toHaveBeenCalledWith(engine);
      expect(actual).toBe(dummy);
    });

    it("creates an integer distribution and indexes upon a provided array within the bounds", () => {
      const engine = { next: () => 0 };
      const length = 1337;
      const index = 1234;
      const begin = 13;
      const end = -17;
      const spy = jest.fn().mockReturnValue(index);
      (integer as jest.Mock).mockReturnValue(spy);
      const dummy = "hello";
      const array = {
        length,
        [index]: dummy
      };

      const actual = pick(engine, array, begin, end);

      expect(integer).toHaveBeenCalledWith(begin, length + end - 1);
      expect(spy).toHaveBeenCalledWith(engine);
      expect(actual).toBe(dummy);
    });
  });
});
