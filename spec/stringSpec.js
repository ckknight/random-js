(function (Random) {
  describe("string", function () {
    describe("with pool = 'abcde'", function () {
      it("calls Random.integer", function () {
        spyOn(Random, "integer");

        Random.string("abcde");

        expect(Random.integer).toHaveBeenCalledWith(0, 4);
      });

      it("calls the integer distribution N times based on the length", function () {
        var index = 0;
        var expected = "";
        spyOn(Random, "integer").andReturn(function () {
          index = (index + 3) % 5;
          expected += "abcde".charAt(index);
          return index;
        });
        var engine = function () {};
        var generate = Random.string("abcde");

        var actual = generate(engine, 64);

        expect(actual).toBe(expected);
        expect(actual.length).toBe(64);
      });
    });

    describe("with default pool", function () {
      it("calls Random.integer", function () {
        spyOn(Random, "integer");

        Random.string();

        expect(Random.integer).toHaveBeenCalledWith(0, 63);
      });

      it("uses a pool of letters, numbers, '_', and '-'", function () {
        var index = 0;
        spyOn(Random, "integer").andReturn(function () {
          return index++;
        });
        var engine = function () {};
        var expected = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-";
        var generate = Random.string();

        var actual = generate(engine, 64);

        expect(actual).toBe(expected);
      });
    });

    describe("with pool = ''", function () {
      it("throws an error", function () {
        expect(function () {
          Random.string("");
        }).toThrow(new Error("Expected pool not to be an empty string"));
      });
    });
  });
}(typeof module !== "undefined" ? require("../lib/random") : Random));