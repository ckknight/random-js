(function (Random) {
  describe("real distribution", function () {
    describe("realZeroToOneInclusive", function () {
      it("calls uint53Full and divides by the maximum", function () {
        var dummy = 0x1234567890abcd;
        spyOn(Random, "uint53Full").andReturn(dummy);
        var expected = dummy / 0x20000000000000;

        var actual = Random.realZeroToOneInclusive(function () {
          return 0;
        });

        expect(actual).toBe(expected);
      });
    });

    describe("realZeroToOneExclusive", function () {
      it("calls uint53 and divides by the maximum", function () {
        var dummy = 0x1234567890abcd;
        spyOn(Random, "uint53").andReturn(dummy);
        var expected = dummy / 0x20000000000000;

        var actual = Random.realZeroToOneExclusive(function () {
          return 0;
        });

        expect(actual).toBe(expected);
      });
    });

    [-Infinity, NaN, Infinity].forEach(function (value) {
      it("throws a RangeError if left = " + value, function () {
        expect(function () {
          Random.real(value, 0);
        }).toThrow(new RangeError("Expected left to be a finite number"));
      });

      it("throws a RangeError if right = " + value, function () {
        expect(function () {
          Random.real(0, value);
        }).toThrow(new RangeError("Expected right to be a finite number"));
      });
    });

    [{
      arg: true,
      method: "realZeroToOneInclusive"
    }, {
      arg: false,
      method: "realZeroToOneExclusive"
    }].forEach(function (o) {
      var arg = o.arg;
      var method = o.method;

      it("returns " + method + " if passed 0, 1, " + arg, function () {
        var expected = Random[method];

        var actual = Random.real(0, 1, arg);

        expect(actual).toBe(expected);
      });

      it("multiplies the result of " + method + " based on the range", function () {
        var range = 1234.5678;
        var dummy = 0.123456789;
        spyOn(Random, method).andReturn(dummy);
        var distribution = Random.real(0, range, arg);
        var expected = range * dummy;

        var actual = distribution(function () {
          return 0;
        });

        expect(actual).toBe(expected);
      });

      it("multiplies the result of " + method + " based on the range and adds based on the left value", function () {
        var left = 98765.4321;
        var range = 1234.5678;
        var dummy = 0.123456789;
        spyOn(Random, method).andReturn(dummy);
        var distribution = Random.real(left, left + range, arg);
        var expected = (range * dummy) + left;

        var actual = distribution(function () {
          return 0;
        });

        expect(actual).toBe(expected);
      });

      it("works despite right being less than left", function () {
        var left = 98765.4321;
        var range = 1234.5678;
        var dummy = 0.123456789;
        spyOn(Random, method).andReturn(dummy);
        var distribution = Random.real(left, left - range, arg);
        var expected = (-range * dummy) + left;

        var actual = distribution(function () {
          return 0;
        });

        expect(actual).toBe(expected);
      });

      it("always returns the value when left and right are equal", function () {
        spyOn(Random, method);
        var dummy = 1234.5678;
        var distribution = Random.real(dummy, dummy);

        var actual = distribution(function () {
          return 0;
        });

        expect(actual).toBe(dummy);
        expect(Random[method]).not.toHaveBeenCalled();
      });
    });
  });
}(typeof module !== "undefined" ? require("../lib/random") : Random));