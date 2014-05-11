(function (Random) {
  describe("bool distribution", function () {
    describe("when passed no arguments", function () {
      it("returns true if the least bit is 1", function () {
        var distribution = Random.bool();

        var actual = distribution(function () {
          return 1;
        });

        expect(actual).toBe(true);
      });

      it("returns false if the least bit is 0", function () {
        var distribution = Random.bool();

        var actual = distribution(function () {
          return 2;
        });

        expect(actual).toBe(false);
      });
    });

    describe("when passed one argument", function () {
      [0, -1, -0.5].forEach(function (value) {
        describe("when passed " + value, function () {
          it("always returns false", function () {
            var distribution = Random.bool(value);

            for (var i = 0; i < 10; ++i) {
              expect(distribution()).toBe(false);
            }
          });
        });
      });

      [1, 2, 1.5].forEach(function (value) {
        describe("when passed " + value, function () {
          it("always returns true", function () {
            var distribution = Random.bool(value);

            for (var i = 0; i < 10; ++i) {
              expect(distribution()).toBe(true);
            }
          });
        });
      });

      describe("when passed a number that only requires 32 bits of randomness", function () {
        it("returns false if int32 passes in a value >= than the percentage * " + 0x100000000, function () {
          var nextValue = 0;
          var percentage = 0.125;
          spyOn(Random, "int32").andReturn(Math.ceil(percentage * 0x100000000) - 0x80000000);
          var distribution = Random.bool(percentage);

          var actual = distribution(function () {
            return 0;
          });

          expect(actual).toBe(false);
        });

        it("returns true if uint53 passes in a value < than the percentage * " + 0x100000000, function () {
          var nextValue = 0;
          var percentage = 0.125;
          spyOn(Random, "int32").andReturn(Math.floor(percentage * 0x100000000) - 0x80000001);
          var distribution = Random.bool(percentage);

          var actual = distribution(function () {
            return 0;
          });

          expect(actual).toBe(true);
        });
      });

      describe("when passed a number that requires more than 32 bits of randomness", function () {
        it("returns false if uint53 passes in a value >= than the percentage * " + 0x20000000000000, function () {
          var nextValue = 0;
          var percentage = 0.12345678901234567890;
          spyOn(Random, "uint53").andReturn(Math.ceil(percentage * 0x20000000000000));
          var distribution = Random.bool(percentage);

          var actual = distribution(function () {
            return 0;
          });

          expect(actual).toBe(false);
        });

        it("returns true if uint53 passes in a value < than the percentage * " + 0x20000000000000, function () {
          var nextValue = 0;
          var percentage = 0.12345678901234567890;
          spyOn(Random, "uint53").andReturn(Math.floor(percentage * 0x20000000000000) - 1);
          var distribution = Random.bool(percentage);

          var actual = distribution(function () {
            return 0;
          });

          expect(actual).toBe(true);
        });
      });
    });

    describe("when passed two arguments", function () {
      [0, -1].forEach(function (numerator) {
        describe("when passed " + numerator + " for the numerator", function () {
          it("always returns false", function () {
            var distribution = Random.bool(numerator, 10);

            for (var i = 0; i < 10; ++i) {
              expect(distribution()).toBe(false);
            }
          });
        });
      });

      [0, 1].forEach(function (addition) {
        describe("when passed a numerator that is the denominator + " + addition, function () {
          it("always returns true", function () {
            var distribution = Random.bool(10 + addition, 10);

            for (var i = 0; i < 10; ++i) {
              expect(distribution()).toBe(true);
            }
          });
        });
      });

      it("uses the integer distribution and returns true if the numerator is < than the result", function () {
        var numerator = 3;
        var denominator = 10;
        spyOn(Random, "integer").andCallFake(function (min, max) {
          expect(min).toBe(0);
          expect(max).toBe(denominator - 1);
          return function () {
            return 2;
          };
        });
        var distribution = Random.bool(3, 10);

        var actual = distribution();

        expect(actual).toBe(true);
      });

      it("uses the integer distribution and returns false if the numerator is >= than the result", function () {
        var numerator = 3;
        var denominator = 10;
        spyOn(Random, "integer").andCallFake(function (min, max) {
          expect(min).toBe(0);
          expect(max).toBe(denominator - 1);
          return function () {
            return 3;
          };
        });
        var distribution = Random.bool(3, 10);

        var actual = distribution();

        expect(actual).toBe(false);
      });
    });
  });
}(typeof module !== "undefined" ? require("../lib/random") : Random));