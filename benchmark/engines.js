/*jshint node:true*/
"use strict";

var Benchmark = require('benchmark');
var Random = require('../lib/random');

var suite = new Benchmark.Suite();

var nativeMath = Random.engines.nativeMath;
var mt19937 = Random.engines.mt19937().autoSeed();
var browserCrypto = Random.engines.browserCrypto;

suite
  .add('engines.nativeMath', function () {
    return nativeMath();
  })
  .add('engines.mt19937', function () {
    return mt19937();
  });
if (browserCrypto) {
  suite.add('engines.browserCrypto', function () {
    return browserCrypto();
  });
}
suite
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').pluck('name'));
  })
  .run({
    async: true
  });