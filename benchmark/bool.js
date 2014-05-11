/*jshint node:true*/
"use strict";

var Benchmark = require('benchmark');
var Random = require('../lib/random');

var suite = new Benchmark.Suite();

var nativeMath = Random.engines.nativeMath;

var simple = Random.bool();
var oneHalf = Random.bool(1, 2);
var fiftyPercent = Random.bool(1 / 2);
var oneThird = Random.bool(1, 3);
var twoFifths = Random.bool(2, 5);
var oneEighth = Random.bool(1 / 8);
var fiveTwelfths = Random.bool(5 / 12);

suite
  .add('bool()', function () {
    return simple(nativeMath);
  })
  .add('bool(1, 2)', function () {
    return oneHalf(nativeMath);
  })
  .add('bool(1 / 2)', function () {
    return fiftyPercent(nativeMath);
  })
  .add('bool(1, 3)', function () {
    return oneThird(nativeMath);
  })
  .add('bool(2, 5)', function () {
    return twoFifths(nativeMath);
  })
  .add('bool(1 / 8)', function () {
    return oneEighth(nativeMath);
  })
  .add('bool(5 / 12)', function () {
    return fiveTwelfths(nativeMath);
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