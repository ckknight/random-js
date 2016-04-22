(function (Random) {
  describe("engines.browserCrypto", function () {
    if (typeof require === "function" && typeof require('crypto').randomBytes === "function") {
      var crypto = require('crypto');
      it("calls crypto.randomBytes for randomness", function () {
        spyOn(crypto, "randomBytes").andCallThrough();
        
        var result = Random.engines.browserCrypto();

        expect(crypto.randomBytes).toHaveBeenCalled();
        var arg = crypto.randomBytes.mostRecentCall.args[0];
        expect(arg).toBe(4);
        expect(typeof result).toBe('number');
      });
    } else if (typeof crypto === "undefined" || typeof crypto.getRandomValues !== "function" || typeof Int32Array !== "function") {
      it("is null due to lack of support", function () {
        expect(Random.engines.browserCrypto).toBe(null);
      });
    } else {
      var discard = function (count) {
        for (var i = 0; i < count; ++i) {
          Random.engines.browserCrypto();
        }
      };

      it("calls crypto.getRandomValues on a 128-length Int32Array", function () {
        spyOn(crypto, "getRandomValues").andCallThrough();

        Random.engines.browserCrypto();

        expect(crypto.getRandomValues).toHaveBeenCalled();
        var arg = crypto.getRandomValues.mostRecentCall.args[0];
        expect(arg instanceof Int32Array).toBe(true);
        expect(arg.length).toBe(128);
        discard(127);
      });

      it("returns the values returned by crypto.getRandomValues until exhausted", function () {
        spyOn(crypto, "getRandomValues").andCallFake(function (array) {
          for (var i = 0; i < 128; ++i) {
            array[i] = i;
          }
        });

        for (var i = 0; i < 128; ++i) {
          expect(Random.engines.browserCrypto()).toBe(i);
        }
      });
    }
  });
}(typeof module !== "undefined" ? require("../lib/random") : Random));