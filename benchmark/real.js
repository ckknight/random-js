/*jshint node:true*/
"use strict";

var Benchmark = require('benchmark');
var Random = require('../lib/random');

var suite = new Benchmark.Suite();

var nativeMath = Random.engines.nativeMath;

var _0_1_exclusive = Random.real(0, 1, false);
var _0_1_inclusive = Random.real(0, 1, true);
var _0_10_exclusive = Random.real(0, 10, false);
var _0_10_inclusive = Random.real(0, 10, true);
var _5_10_exclusive = Random.real(5, 10, false);
var _5_10_inclusive = Random.real(5, 10, true);

suite
  .add('real(0, 1, false)', function () {
    return _0_1_exclusive(nativeMath);
  })
  .add('real(0, 1, true)', function () {
    return _0_1_inclusive(nativeMath);
  })
  .add('real(0, 10, false)', function () {
    return _0_10_exclusive(nativeMath);
  })
  .add('real(0, 10, true)', function () {
    return _0_10_inclusive(nativeMath);
  })
  .add('real(5, 10, false)', function () {
    return _5_10_exclusive(nativeMath);
  })
  .add('real(5, 10, true)', function () {
    return _5_10_inclusive(nativeMath);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').pluck('name'));
  })
  .run({
    async: true
  });