(function (Random) {
  describe("uuid4", function () {
    function makeEngine(input) {
      var index = 0;
      return function () {
        return input[index++] | 0;
      };
    }

    [{
      input: [0, 0, 0, 0],
      output: "00000000-0000-4000-8000-000000000000"
    }, {
      input: [0xffffffff, 0xffffffff, 0xffffffff, 0xffffffff],
      output: "ffffffff-ffff-4fff-bfff-ffffffffffff"
    }, {
      input: [0xdeadbeef, 0x12345678, 0xfedcba98, 0x13371337],
      output: "deadbeef-5678-4567-ba98-cba913371337"
    }, {
      input: [0x12345678, 0x90abcdef, 0x94746842, 0x81354732],
      output: "12345678-cdef-4cde-a842-468481354732"
    }].forEach(function (o) {
      var input = o.input;
      var output = o.output;
      describe("with an engine that produces " + input, function () {
        it("returns '" + output + "'", function () {
          var engine = makeEngine(input);

          var actual = Random.uuid4(engine);

          expect(actual).toBe(output);
        });
      });
    });
  });
}(typeof module !== "undefined" ? require("../lib/random") : Random));