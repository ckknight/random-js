(function (Random) {
  describe("picker", function () {
    it("returns a function that returns undefined when passed an empty array", function () {
      var array = {
        length: 0
      };
      spyOn(Random, "integer");

      var picker = Random.picker(array);
      var actual = picker(); // no engine needed

      expect(actual).toBeUndefined();
      expect(Random.integer).not.toHaveBeenCalled();
    });

    it("returns a function that allows for indexing upon the provided array", function () {
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

      var picker = Random.picker(array);
      var actual = picker(engine);

      expect(Random.integer).toHaveBeenCalledWith(0, length - 1);
      expect(spy).toHaveBeenCalledWith(engine);
      expect(actual).toBe(dummy);
    });

    it("clones the initial array rather than holding onto the reference", function () {
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

      var picker = Random.picker(array);
      array[index] = "there";
      array.length = 0;
      var actual = picker(engine);

      expect(actual).toBe(dummy);
    });

    it("slices the array with the arguments provided", function () {
      var engine = function () {};
      var length = 1337;
      var index = 1234;
      var begin = 7;
      var end = -11;
      var spy = jasmine.createSpy().andReturn(index - begin);
      spyOn(Random, "integer").andReturn(spy);
      var array = {
        length: length
      };
      var dummy = "hello";
      array[index] = dummy;

      var picker = Random.picker(array, begin, end);
      array[index] = "there";
      array.length = 0;
      var actual = picker(engine);

      expect(Random.integer).toHaveBeenCalledWith(0, length - begin + end - 1);
      expect(actual).toBe(dummy);
    });
  });
}(typeof module !== "undefined" ? require("../lib/random") : Random));