(function (Random) {
  describe("hex", function () {
    [{
      upper: true,
      pool: "0123456789ABCDEF"
    }, {
      upper: false,
      pool: "0123456789abcdef"
    }].forEach(function (o) {
      var upper = o.upper;
      var pool = o.pool;

      describe("when upper = " + upper, function () {
        it("returns the result of string with pool = '" + pool + "'", function () {
          var length = 1337;
          var dummy = function () {};
          spyOn(Random, "string").andReturn(dummy);

          var actual = Random.hex(upper);

          expect(actual).toBe(dummy);
          expect(Random.string).toHaveBeenCalledWith(pool);
        });
      });
    });
  });
}(typeof module !== "undefined" ? require("../lib/random") : Random));