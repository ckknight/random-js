"use strict";

const Benchmark = require("benchmark");
const { nativeMath, bool } = require("..");

const suite = new Benchmark.Suite();

const simple = bool();
const oneHalf = bool(1, 2);
const fiftyPercent = bool(1 / 2);
const oneThird = bool(1, 3);
const twoFifths = bool(2, 5);
const oneEighth = bool(1 / 8);
const fiveTwelfths = bool(5 / 12);

suite
  .add("bool()", () => simple(nativeMath))
  .add("bool(1, 2)", () => oneHalf(nativeMath))
  .add("bool(1 / 2)", () => fiftyPercent(nativeMath))
  .add("bool(1, 3)", () => oneThird(nativeMath))
  .add("bool(2, 5)", () => twoFifths(nativeMath))
  .add("bool(1 / 8)", () => oneEighth(nativeMath))
  .add("bool(5 / 12)", () => fiveTwelfths(nativeMath))
  .on("cycle", event => {
    console.log(String(event.target));
  })
  .on("complete", function() {
    console.log("Fastest is " + this.filter("fastest")[0].name);
  })
  .run({
    async: true
  });
