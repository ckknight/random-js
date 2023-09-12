"use strict";

let Benchmark = require("benchmark");
let { nativeMath, browserCrypto, MersenneTwister19937 } = require("..");

let suite = new Benchmark.Suite();

let mt19937 = MersenneTwister19937.autoSeed();

suite
  .add("engines.nativeMath", () => nativeMath.next())
  .add("engines.mt19937", () => mt19937.next());
if (browserCrypto) {
  suite.add("engines.browserCrypto", () => browserCrypto.next());
}
suite
  .on("cycle", event => {
    console.log(String(event.target));
  })
  .on("complete", function() {
    console.log("Fastest is " + this.filter("fastest")[0].name);
  })
  .run({
    async: true
  });
