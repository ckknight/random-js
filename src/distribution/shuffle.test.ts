import { Engine } from "../types";
import { integer } from "./integer";
import { shuffle } from "./shuffle";

jest.mock("./integer");

describe("shuffle", () => {
  it("generates evenly-distributed integers from [0, n) where n is the length and decreases each iteration, swapping items each time", () => {
    const engine = { next: () => 0 };
    const values = [2, 3, 0, 1];
    (integer as jest.Mock).mockImplementation((min, max) => {
      expect(min).toBe(0);
      expect(max).toBe(values.length);
      return (e: Engine) => {
        expect(e).toBe(engine);
        return values.shift();
      };
    });
    const array = ["a", "b", "c", "d", "e"];
    const expected = ["e", "b", "a", "d", "c"];

    const actual = shuffle(engine, array);

    expect(actual).toEqual(expected);
    expect(actual).toBe(array);
  });

  describe("with downTo", () => {
    it("generates evenly-distributed integers from [0, n) where n is the length and decreases each iteration, swapping items each time", () => {
      const engine = { next: () => 0 };
      const values = [2, 3];
      const downTo = 2;
      (integer as jest.Mock).mockImplementation((min, max) => {
        expect(min).toBe(0);
        expect(max).toBe(values.length + 2);
        return (e: Engine) => {
          expect(e).toBe(engine);
          return values.shift();
        };
      });
      const array = ["a", "b", "c", "d", "e"];
      const expected = ["a", "b", "e", "d", "c"];

      const actual = shuffle(engine, array, downTo);

      expect(actual).toEqual(expected);
      expect(actual).toBe(array);
    });
  });

  describe("with an empty array", () => {
    it("returns the same empty array", () => {
      const engine = { next: () => 0 };
      const array: any[] = [];

      const actual = shuffle(engine, array);

      expect(actual).toEqual([]);
      expect(actual).toBe(array);
    });

    it("does not call the engine", () => {
      const engine = {
        next: jest.fn()
      };

      shuffle(engine, []);

      expect(engine.next).not.toHaveBeenCalled();
    });
  });
});
