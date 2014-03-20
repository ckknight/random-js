(function (Random) {
  describe("shuffle", function () {
    it("generates evenly-distributed integers from [0, n) where n is the length and decreases each iteration, swapping items each time", function () {
      var engine = function () {};
      var values = [2, 3, 0, 1];
      var nextValue = 0;
      spyOn(Random, "integer").andCallFake(function (min, max) {
        expect(min).toBe(0);
        expect(max).toBe(values.length);
        return function (e) {
          expect(e).toBe(engine);
          return values.shift();
        };
      });
      var array = ["a", "b", "c", "d", "e"];
      var expected = ["e", "b", "a", "d", "c"];

      var actual = Random.shuffle(engine, array);

      expect(actual).toEqual(expected);
      expect(actual).toBe(array);
    });

    describe("with downTo", function () {
      it("generates evenly-distributed integers from [0, n) where n is the length and decreases each iteration, swapping items each time", function () {
        var engine = function () {};
        var values = [2, 3];
        var nextValue = 0;
        var downTo = 2;
        spyOn(Random, "integer").andCallFake(function (min, max) {
          expect(min).toBe(0);
          expect(max).toBe(values.length + 2);
          return function (e) {
            expect(e).toBe(engine);
            return values.shift();
          };
        });
        var array = ["a", "b", "c", "d", "e"];
        var expected = ["a", "b", "e", "d", "c"];

        var actual = Random.shuffle(engine, array, downTo);

        expect(actual).toEqual(expected);
        expect(actual).toBe(array);
      });
    });

    describe("with an empty array", function () {
      it("returns the same empty array", function () {
        var engine = function () {};
        var array = [];

        var actual = Random.shuffle(engine, array);

        expect(actual).toEqual([]);
        expect(actual).toBe(array);
      });

      it("does not call the engine", function () {
        var engine = jasmine.createSpy();

        Random.shuffle(engine, []);

        expect(engine).not.toHaveBeenCalled();
      });
    });
  });
}(typeof module !== "undefined" ? require("../lib/random") : Random));