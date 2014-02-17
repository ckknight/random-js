(function (Random) {
  describe("picker", function () {
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
  });
}(typeof module !== "undefined" ? require("../lib/random") : Random));