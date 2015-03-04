(function (Random) {
  describe("sample", function () {
    [-Infinity, Infinity, NaN, -1, 5].forEach(function (sampleSize) {
      it("throws a RangeError if sampleSize is " + sampleSize, function () {
        expect(function () {
          Random.sample(function () {}, [], sampleSize);
        }).toThrow(new RangeError("Expected sampleSize to be within 0 and the length of the population"));
      });
    });

    describe("when sampleSize is the same as length", function () {
      it("calls shuffle on a clone of the array", function () {
        var dummy = [];
        spyOn(Random, "shuffle").andReturn(dummy);
        var engine = function () {};
        var array = ["a", "b", "c"];

        var actual = Random.sample(engine, array, array.length);

        expect(actual).toBe(dummy);
        expect(Random.shuffle).toHaveBeenCalledWith(engine, array, 0);
        expect(Random.shuffle.mostRecentCall.args[1]).not.toBe(array);
      });
    });

    describe("when sampleSize is less than the length", function () {
      it("calls shuffle on a clone of the array", function () {
        var dummy = ["e", "d", "c", "b", "a"];
        spyOn(Random, "shuffle").andReturn(dummy);
        var engine = function () {};
        var array = ["a", "b", "c", "d", "e"];
        var sampleSize = 3;
        var expected = dummy.slice(array.length - sampleSize);

        var actual = Random.sample(engine, array, sampleSize);

        expect(actual).toEqual(expected);
        expect(Random.shuffle).toHaveBeenCalledWith(engine, array, array.length - sampleSize - 1);
        expect(Random.shuffle.mostRecentCall.args[1]).not.toBe(array);
      });
    });

    describe("when sampleSize is 0", function () {
      it("returns an empty array", function () {
        var array = ["a", "b", "c"];
        var expected = [];
        var engine = function () {};
        var sampleSize = 0;

        var actual = Random.sample(engine, array, sampleSize);

        expect(actual).toEqual(expected);
      });

      it("does not call shuffle", function () {
        var array = ["a", "b", "c"];
        spyOn(Random, "shuffle");
        var engine = function () {};
        var sampleSize = 0;

        Random.sample(engine, array, sampleSize);

        expect(Random.shuffle).not.toHaveBeenCalled();
      });

      it("does not call the engine", function () {
        var array = ["a", "b", "c"];
        spyOn(Random, "shuffle");
        var engine = jasmine.createSpy();
        var sampleSize = 0;

        Random.sample(engine, array, sampleSize);

        expect(engine).not.toHaveBeenCalled();
      });
    });
  });
}(typeof module !== "undefined" ? require("../lib/random") : Random));