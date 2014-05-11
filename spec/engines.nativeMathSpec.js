(function (Random) {
  describe("engines.nativeMath", function () {
    var nativeMath, oldRandom;
    beforeEach(function () {
      nativeMath = Random.engines.nativeMath;
      oldRandom = Math.random;
      Math.random = jasmine.createSpy();
    });

    afterEach(function () {
      Math.random = oldRandom;
    });

    it("returns the result of Math.random() converted to a Int32", function () {
      var expected = 0xdeadbeef;
      Math.random.andReturn(expected / 0x100000000);

      var actual = nativeMath();

      expect(actual).toBe(expected | 0);
    });

    it("normalizes to an integer", function () {
      var expected = 0x12345678;
      Math.random.andReturn((expected + 0.12345678) / 0x100000000);

      var actual = nativeMath();

      expect(actual).toBe(expected | 0);
    });
  });
}(typeof module !== "undefined" ? require("../lib/random") : Random));