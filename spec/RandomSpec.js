(function (root) {
  var Random = typeof module !== "undefined" ? require("../lib/random") : root.Random;
  describe("Random", function () {
    describe("constructor", function () {
      it("returns a Random if called without new", function () {
        var random = Random();

        expect(random instanceof Random).toBe(true);
      });

      describe("when passed a non-function", function () {
        it("throws a TypeError", function () {
          expect(function () {
            return new Random("hello");
          }).toThrow(new TypeError("Expected engine to be a function, got string"));
        });
      });

      describe("when passed a function", function () {
        it("sets engine to the passed-in function", function () {
          var dummy = function () {};

          var random = new Random(dummy);

          expect(random.engine).toBe(dummy);
        });
      });

      describe("when passed nothing", function () {
        it("sets engine to the nativeMath engine", function () {
          var random = new Random();

          expect(random.engine).toBe(Random.engines.nativeMath);
        });
      });
    });

    describe("generateEntropyArray", function () {
      it("returns a non-empty array of int32s", function () {
        var actual = Random.generateEntropyArray();

        expect(actual instanceof Array).toBe(true);
        expect(actual.length).not.toBe(false);
        for (var i = 0; i < actual.length; ++i) {
          expect(actual[i]).toBe(actual[i] | 0);
        }
      });

      it("gets entropy from the current date", function () {
        var GLOBAL = typeof module !== "undefined" ? global : root;
        var realDate = GLOBAL.Date;
        spyOn(GLOBAL, "Date").andReturn(new realDate());

        Random.generateEntropyArray();

        expect(GLOBAL.Date).toHaveBeenCalled();
        GLOBAL.Date = realDate;
      });

      it("gets entropy from the nativeMath engine", function () {
        spyOn(Random.engines, "nativeMath").andCallThrough();

        Random.generateEntropyArray();

        expect(Random.engines.nativeMath).toHaveBeenCalled();
      });
    });

    if (typeof root.Random !== "undefined") {
      describe("noConflict", function () {
        var Random;
        beforeEach(function () {
          Random = root.Random;
        });

        afterEach(function () {
          root.Random = Random;
        });

        it("returns the Random function", function () {
          var actual = Random.noConflict();

          expect(actual).toBe(Random);
        });

        it("sets the Random property on global to the previous value", function () {
          Random.noConflict();

          expect(root.Random).toBeUndefined();
        });
      });
    }

    describe("prototype methods", function () {
      var random;
      beforeEach(function () {
        random = new Random(function () {
          return 0;
        });
      });

      describe("integer", function () {
        it("calls Random.integer", function () {
          var min = 1234;
          var max = 2345;
          var dummy = 1337;
          var spy = jasmine.createSpy().andReturn(dummy);
          spyOn(Random, "integer").andReturn(spy);

          var actual = random.integer(min, max);

          expect(Random.integer).toHaveBeenCalledWith(min, max);
          expect(spy).toHaveBeenCalledWith(random.engine);
          expect(actual).toBe(dummy);
        });
      });

      describe("real", function () {
        it("calls Random.real", function () {
          var min = 1234.5;
          var max = 2345.6;
          var dummy = 1337.5;
          var spy = jasmine.createSpy().andReturn(dummy);
          spyOn(Random, "real").andReturn(spy);

          var actual = random.real(min, max, true);

          expect(Random.real).toHaveBeenCalledWith(min, max, true);
          expect(spy).toHaveBeenCalledWith(random.engine);
          expect(actual).toBe(dummy);
        });
      });

      describe("bool", function () {
        it("calls Random.bool", function () {
          var numerator = 1234;
          var denominator = 2345;
          var dummy = true;
          var spy = jasmine.createSpy().andReturn(dummy);
          spyOn(Random, "bool").andReturn(spy);

          var actual = random.bool(numerator, denominator);

          expect(Random.bool).toHaveBeenCalledWith(numerator, denominator);
          expect(spy).toHaveBeenCalledWith(random.engine);
          expect(actual).toBe(dummy);
        });
      });

      describe("pick", function () {
        it("calls Random.pick", function () {
          var array = ["a", "b", "c"];
          var dummy = "d";
          var begin = 1;
          var end = -1;
          spyOn(Random, "pick").andReturn(dummy);

          var actual = random.pick(array, begin, end);

          expect(Random.pick).toHaveBeenCalledWith(random.engine, array, begin, end);
          expect(actual).toBe(dummy);
        });
      });

      describe("shuffle", function () {
        it("calls Random.shuffle", function () {
          var array = ["a", "b", "c"];
          var dummy = ["d"];
          spyOn(Random, "shuffle").andReturn(dummy);

          var actual = random.shuffle(array);

          expect(Random.shuffle).toHaveBeenCalledWith(random.engine, array);
          expect(actual).toBe(dummy);
        });
      });

      describe("sample", function () {
        it("calls Random.sample", function () {
          var array = ["a", "b", "c"];
          var sampleSize = 2;
          var dummy = ["d"];
          spyOn(Random, "sample").andReturn(dummy);

          var actual = random.sample(array, sampleSize);

          expect(Random.sample).toHaveBeenCalledWith(random.engine, array, sampleSize);
          expect(actual).toBe(dummy);
        });
      });

      describe("die", function () {
        it("calls Random.die", function () {
          var sideCount = 1337;
          var dummy = 123;
          var spy = jasmine.createSpy().andReturn(dummy);
          spyOn(Random, "die").andReturn(spy);

          var actual = random.die(sideCount);

          expect(Random.die).toHaveBeenCalledWith(sideCount);
          expect(spy).toHaveBeenCalledWith(random.engine);
          expect(actual).toBe(dummy);
        });
      });

      describe("dice", function () {
        it("calls Random.dice", function () {
          var sideCount = 1337;
          var dieCount = 6;
          var dummy = 123;
          var spy = jasmine.createSpy().andReturn(dummy);
          spyOn(Random, "dice").andReturn(spy);

          var actual = random.dice(sideCount, dieCount);

          expect(Random.dice).toHaveBeenCalledWith(sideCount, dieCount);
          expect(spy).toHaveBeenCalledWith(random.engine);
          expect(actual).toBe(dummy);
        });
      });

      describe("uuid4", function () {
        it("calls Random.pick", function () {
          var dummy = "unique";
          spyOn(Random, "uuid4").andReturn(dummy);

          var actual = random.uuid4();

          expect(Random.uuid4).toHaveBeenCalledWith(random.engine);
          expect(actual).toBe(dummy);
        });
      });

      describe("string", function () {
        it("calls Random.string", function () {
          var length = 1337;
          var pool = "alpha";
          var dummy = "bravo";
          var spy = jasmine.createSpy().andReturn(dummy);
          spyOn(Random, "string").andReturn(spy);

          var actual = random.string(length, pool);

          expect(Random.string).toHaveBeenCalledWith(pool);
          expect(spy).toHaveBeenCalledWith(random.engine, length);
          expect(actual).toBe(dummy);
        });
      });

      describe("hex", function () {
        it("calls Random.hex", function () {
          var length = 1337;
          var upper = true;
          var dummy = "bravo";
          var spy = jasmine.createSpy().andReturn(dummy);
          spyOn(Random, "hex").andReturn(spy);

          var actual = random.hex(length, upper);

          expect(Random.hex).toHaveBeenCalledWith(upper);
          expect(spy).toHaveBeenCalledWith(random.engine, length);
          expect(actual).toBe(dummy);
        });
      });

      describe("date", function () {
        it("calls Random.date", function () {
          var now = new Date();
          var later = new Date(now.getTime() + 86400);
          var dummy = new Date(now.getTime() + 12345);
          var spy = jasmine.createSpy().andReturn(dummy);
          spyOn(Random, "date").andReturn(spy);

          var actual = random.date(now, later);

          expect(Random.date).toHaveBeenCalledWith(now, later);
          expect(spy).toHaveBeenCalledWith(random.engine);
          expect(actual).toBe(dummy);
        });
      });

      ["int32", "uint32", "uint53", "uint53Full", "int53", "int53Full", "realZeroToOneExclusive", "realZeroToOneInclusive"].forEach(function (method) {
        describe(method, function () {
          it("calls Random." + method, function () {
            var dummy = 1234;
            spyOn(Random, method).andReturn(dummy);

            var actual = random[method]();

            expect(Random[method]).toHaveBeenCalledWith(random.engine);
            expect(actual).toBe(dummy);
          });
        });
      });
    });
  });
}(this));