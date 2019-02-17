import { bool } from "./bool";
import { int32 } from "./int32";
import { integer } from "./integer";
import { uint53 } from "./uint53";

jest.mock("./int32");
jest.mock("./uint53");
jest.mock("./integer");

describe("bool distribution", () => {
  describe("when passed no arguments", () => {
    it("returns true if the least bit is 1", () => {
      const distribution = bool();

      const actual = distribution({
        next: () => 1
      });

      expect(actual).toBe(true);
    });

    it("returns false if the least bit is 0", () => {
      const distribution = bool();

      const actual = distribution({
        next: () => 2
      });

      expect(actual).toBe(false);
    });
  });

  describe("when passed one argument", () => {
    [0, -1, -0.5].forEach(value => {
      describe(`when passed ${value}`, () => {
        it("always returns false", () => {
          const distribution = bool(value);

          for (let i = 0; i < 10; ++i) {
            expect(distribution(undefined!)).toBe(false);
          }
        });
      });
    });

    [1, 2, 1.5].forEach(value => {
      describe(`when passed ${value}`, () => {
        it("always returns true", () => {
          const distribution = bool(value);

          for (let i = 0; i < 10; ++i) {
            expect(distribution(undefined!)).toBe(true);
          }
        });
      });
    });

    describe("when passed a number that only requires 32 bits of randomness", () => {
      it(`returns false if int32 passes in a value >= than the percentage * ${0x100000000}`, () => {
        jest.resetAllMocks();
        const percentage = 0.125;
        (int32 as jest.Mock).mockReturnValue(
          Math.ceil(percentage * 0x100000000) - 0x80000000
        );
        const distribution = bool(percentage);

        const actual = distribution({
          next: () => 0
        });

        expect(actual).toBe(false);
      });

      it(`returns true if int32 passes in a value < than the percentage * ${0x100000000}`, () => {
        const percentage = 0.125;
        (int32 as jest.Mock).mockReturnValue(
          Math.ceil(percentage * 0x100000000) - 0x80000001
        );
        const distribution = bool(percentage);

        const actual = distribution({
          next: () => 0
        });

        expect(actual).toBe(true);
      });
    });

    describe("when passed a number that requires more than 32 bits of randomness", () => {
      it(`returns false if uint53 passes in a value >= than the percentage * ${0x20000000000000}`, () => {
        const percentage = 0.1234567890123456789;
        (uint53 as jest.Mock).mockReturnValue(
          Math.ceil(percentage * 0x20000000000000)
        );
        const distribution = bool(percentage);

        const actual = distribution({
          next: () => 0
        });

        expect(actual).toBe(false);
      });

      it(`returns true if uint53 passes in a value < than the percentage * ${0x20000000000000}`, () => {
        const percentage = 0.1234567890123456789;
        (uint53 as jest.Mock).mockReturnValue(
          Math.floor(percentage * 0x20000000000000) - 1
        );
        const distribution = bool(percentage);

        const actual = distribution({
          next: () => 0
        });

        expect(actual).toBe(true);
      });
    });
  });

  describe("when passed two arguments", () => {
    [0, -1].forEach(numerator => {
      describe(`when passed ${numerator} for the numerator`, () => {
        it("always returns false", () => {
          const distribution = bool(numerator, 10);

          for (let i = 0; i < 10; ++i) {
            expect(distribution(undefined!)).toBe(false);
          }
        });
      });
    });

    [0, 1].forEach(addition => {
      describe(`when passed a numerator that is the denominator + ${addition}`, () => {
        it("always returns true", () => {
          const distribution = bool(10 + addition, 10);

          for (let i = 0; i < 10; ++i) {
            expect(distribution(undefined!)).toBe(true);
          }
        });
      });
    });

    it("uses the integer distribution and returns true if the numerator is < than the result", () => {
      const numerator = 3;
      const denominator = 10;
      (integer as jest.Mock).mockImplementation((min, max) => {
        expect(min).toBe(0);
        expect(max).toBe(denominator - 1);
        return () => {
          return 2;
        };
      });
      const distribution = bool(numerator, denominator);

      const actual = distribution(undefined!);

      expect(actual).toBe(true);
    });

    it("uses the integer distribution and returns false if the numerator is >= than the result", () => {
      const numerator = 3;
      const denominator = 10;
      (integer as jest.Mock).mockImplementation((min, max) => {
        expect(min).toBe(0);
        expect(max).toBe(denominator - 1);
        return () => {
          return 3;
        };
      });
      const distribution = bool(numerator, denominator);

      const actual = distribution(undefined!);

      expect(actual).toBe(false);
    });
  });
});
