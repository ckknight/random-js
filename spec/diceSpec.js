(function (Random) {
  describe("dice", function () {
    function makeReturner(input) {
      var index = 0;
      return function () {
        return input[index++];
      };
    }
    it("creates a distribution using die and uses it repeatedly", function () {
      var data = [1, 2, 3, 4, 5, 6];
      var dieCount = 4;
      var expected = data.slice(0, dieCount);
      spyOn(Random, "die").andReturn(makeReturner(data));
      var sideCount = 1337;

      var dice = Random.dice(sideCount, dieCount);
      var actual = dice(function () {
        return 0;
      });

      expect(Random.die).toHaveBeenCalledWith(sideCount);
      expect(actual).toEqual(expected);
    });
  });
}(typeof module !== "undefined" ? require("../lib/random") : Random));