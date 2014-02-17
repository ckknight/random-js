(function (Random) {
  describe("pick", function () {
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
  });
}(typeof module !== "undefined" ? require("../lib/random") : Random));