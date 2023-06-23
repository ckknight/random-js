import { real } from "../../src/distribution/real";
import { realZeroToOneExclusive } from "../../src/distribution/realZeroToOneExclusive";
import { realZeroToOneInclusive } from "../../src/distribution/realZeroToOneInclusive";

jest.mock("../../src/distribution/realZeroToOneExclusive");
jest.mock("../../src/distribution/realZeroToOneInclusive");

describe("real distribution", () => {
  [-Infinity, NaN, Infinity].forEach(value => {
    it(`throws a RangeError if min = ${value}`, () => {
      expect(() => {
        real(value, 0);
      }).toThrow(new RangeError("Expected min to be a finite number"));
    });

    it(`throws a RangeError if max = ${value}`, () => {
      expect(() => {
        real(0, value);
      }).toThrow(new RangeError("Expected max to be a finite number"));
    });
  });

  [
    {
      distribution: realZeroToOneInclusive,
      inclusive: true,
      method: "realZeroToOneInclusive"
    },
    {
      distribution: realZeroToOneExclusive,
      inclusive: false,
      method: "realZeroToOneExclusive"
    }
  ].forEach(({ distribution: realDistribution, inclusive, method }) => {
    it("returns " + method + " if passed 0, 1, " + inclusive, () => {
      const expected = realDistribution;

      const actual = real(0, 1, inclusive);

      expect(actual).toBe(expected);
    });

    it("multiplies the result of " + method + " based on the range", () => {
      const range = 1234.5678;
      const dummy = 0.123456789;
      (realDistribution as jest.Mock).mockReturnValue(dummy);
      const distribution = real(0, range, inclusive);
      const expected = range * dummy;

      const actual = distribution({ next: () => 0 });

      expect(actual).toBe(expected);
    });

    it(
      "multiplies the result of " +
        method +
        " based on the range and adds based on the left value",
      () => {
        const left = 98765.4321;
        const range = 1234.5678;
        const dummy = 0.123456789;
        (realDistribution as jest.Mock).mockReturnValue(dummy);
        const distribution = real(left, left + range, inclusive);
        const expected = range * dummy + left;

        const actual = distribution({ next: () => 0 });

        expect(actual).toBe(expected);
      }
    );

    it("works despite right being less than left", () => {
      const left = 98765.4321;
      const range = 1234.5678;
      const dummy = 0.123456789;
      (realDistribution as jest.Mock).mockReturnValue(dummy);
      const distribution = real(left, left - range, inclusive);
      const expected = -range * dummy + left;

      const actual = distribution({ next: () => 0 });

      expect(actual).toBe(expected);
    });

    it("always returns the value when left and right are equal", () => {
      const dummy = 1234.5678;
      const distribution = real(dummy, dummy);

      const actual = distribution({ next: () => 0 });

      expect(actual).toBe(dummy);
      expect(realDistribution).not.toHaveBeenCalled();
    });
  });
});
