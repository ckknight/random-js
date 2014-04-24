(function (Random) {
  describe("pick", function () {
    describe("with an empty array", function () {
      it("returns undefined", function () {
        var engine = function () {};
        spyOn(Random, "integer");
        var array = {
          length: 0
        };

        var actual = Random.pick(engine, array);

        expect(Random.integer).not.toHaveBeenCalled();
        expect(actual).toBeUndefined();
      });
    });

    describe("with a non-empty array", function () {
      it("creates an integer distribution and indexes upon a provided array", function () {
        var engine = function () {};
        var length = 1337;
        var index = 1234;
        var spy = jasmine.createSpy().andReturn(index);
        spyOn(Random, "integer").andReturn(spy);
        var array = {
          length: length
        };
        var dummy = "hello";
        array[index] = dummy;

        var actual = Random.pick(engine, array);

        expect(Random.integer).toHaveBeenCalledWith(0, length - 1);
        expect(spy).toHaveBeenCalledWith(engine);
        expect(actual).toBe(dummy);
      });

      it("creates an integer distribution and indexes upon a provided array within the bounds", function () {
        var engine = function () {};
        var length = 1337;
        var index = 1234;
        var begin = 13;
        var end = -17;
        var spy = jasmine.createSpy().andReturn(index);
        spyOn(Random, "integer").andReturn(spy);
        var array = {
          length: length
        };
        var dummy = "hello";
        array[index] = dummy;

        var actual = Random.pick(engine, array, begin, end);

        expect(Random.integer).toHaveBeenCalledWith(begin, length + end - 1);
        expect(spy).toHaveBeenCalledWith(engine);
        expect(actual).toBe(dummy);
      });
    });
  });
}(typeof module !== "undefined" ? require("../lib/random") : Random));