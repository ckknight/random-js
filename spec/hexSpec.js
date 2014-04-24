(function (Random) {
  describe("hex", function () {
    var owns = Object.prototype.hasOwnProperty;

    function countUnique(string) {
      var set = {};
      var count = 0;
      var i = string.length;
      while (i--) {
        var c = string.charAt(i);
        if (!owns.call(set, c)) {
          set[c] = true;
          ++count;
        }
      }
      return count;
    }
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
        it("returns hex strings of the requested length", function () {
          var length = 1337;
          var dummy = function () {};
          var regex = new RegExp("^[" + pool + "]{" + length + "}$");
          spyOn(Random, "string").andReturn(dummy);

          var hexer = Random.hex(upper);
          var actual = hexer(Random.engines.nativeMath, length);

          expect(actual).toMatch(regex);
          expect(countUnique(actual)).toBe(pool.length);
        });
      });
    });
  });
}(typeof module !== "undefined" ? require("../lib/random") : Random));