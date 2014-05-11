(function (Random) {
  describe("date distribution", function () {
    describe("when start is not a date", function () {
      it("throws a TypeError", function () {
        expect(function () {
          Random.date(1234);
        }).toThrow(new TypeError("Expected start to be a Date, got number"));
      });
    });

    describe("when end is not a date", function () {
      it("throws a TypeError", function () {
        expect(function () {
          Random.date(new Date(), 1234);
        }).toThrow(new TypeError("Expected end to be a Date, got number"));
      });
    });

    it("returns a wrapped integer distribution from start time to end time", function () {
      var now = new Date();
      var later = new Date(now.getTime() + 86400);
      var resultDummy = now.getTime() + 40000;
      var spy = jasmine.createSpy().andReturn(resultDummy);
      spyOn(Random, "integer").andReturn(spy);
      var engine = function () {};

      var distribution = Random.date(now, later);
      var actual = distribution(engine);

      expect(Random.integer).toHaveBeenCalledWith(now.getTime(), later.getTime());
      expect(spy).toHaveBeenCalledWith(engine);
      expect(actual).toEqual(new Date(resultDummy));
    });
  });
}(typeof module !== "undefined" ? require("../lib/random") : Random));