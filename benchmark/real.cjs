/*jshint node:true*/
"use strict";

const Benchmark = require("benchmark");
const { nativeMath, real } = require("..");

const suite = new Benchmark.Suite();

const _0_1_exclusive = real(0, 1, false);
const _0_1_inclusive = real(0, 1, true);
const _0_10_exclusive = real(0, 10, false);
const _0_10_inclusive = real(0, 10, true);
const _5_10_exclusive = real(5, 10, false);
const _5_10_inclusive = real(5, 10, true);

suite
  .add("real(0, 1, false)", () => _0_1_exclusive(nativeMath))
  .add("real(0, 1, true)", () => _0_1_inclusive(nativeMath))
  .add("real(0, 10, false)", () => _0_10_exclusive(nativeMath))
  .add("real(0, 10, true)", () => _0_10_inclusive(nativeMath))
  .add("real(5, 10, false)", () => _5_10_exclusive(nativeMath))
  .add("real(5, 10, true)", () => _5_10_inclusive(nativeMath))
  .on("cycle", event => {
    console.log(String(event.target));
  })
  .on("complete", function() {
    console.log("Fastest is " + this.filter("fastest")[0].name);
  })
  .run({
    async: true
  });
