/*jshint node:true*/
"use strict";

var Benchmark = require('benchmark');
var Random = require('../lib/random');

var suite = new Benchmark.Suite();

var nativeMath = Random.engines.nativeMath;

// same min and max
var _1_1 = Random.integer(1, 1);

// easily maskable, since range is 2^x
var _0_15 = Random.integer(0, 15);
var _0_255 = Random.integer(0, 255);
var uint31 = Random.integer(0, 0x7fffffff);
var int31 = Random.integer(-0x4000000, 0x3fffffff);

// fits perfectly into int32
var int32 = Random.integer(-0x80000000, 0x7fffffff);
var uint32 = Random.integer(0, 0xffffffff);
var uint32Plus1 = Random.integer(1, 0x100000000);

// within int32
var _0_2 = Random.integer(0, 2);
var _3_7 = Random.integer(3, 7);
var _1_20 = Random.integer(1, 20);
var _1_2 = Random.integer(1, 2);
var _1_6 = Random.integer(1, 2 * 3);
var _1_30 = Random.integer(1, 2 * 3 * 5);
var _1_210 = Random.integer(1, 2 * 3 * 5 * 7);
var _1_2310 = Random.integer(1, 2 * 3 * 5 * 7 * 11);
var _1_30030 = Random.integer(1, 2 * 3 * 5 * 7 * 11 * 13);
var _1_510510 = Random.integer(1, 2 * 3 * 5 * 7 * 11 * 13 * 17);
var _1_9699690 = Random.integer(1, 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19);
var _1_223092870 = Random.integer(1, 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23);
// within uint53-1
var _1_6469693230 = Random.integer(1, 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23 * 29);
var _1_200560490130 = Random.integer(1, 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23 * 29 * 31);
var _1_7420738134810 = Random.integer(1, 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23 * 29 * 31 * 37);
var _1_304250263527210 = Random.integer(1, 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23 * 29 * 31 * 37 * 41);
var _1_6541380665835015 = Random.integer(1, 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23 * 29 * 31 * 37 * 41 * 43);
var _1_0x300000000 = Random.integer(1, 0x300000000);

var uint53 = Random.integer(0, 0x1fffffffffffff);
var uint53Plus1 = Random.integer(1, 0x20000000000000);
var uint53Full = Random.integer(0, 0x20000000000000);
var int53 = Random.integer(-0x20000000000000, 0x1fffffffffffff);
var int53Plus1 = Random.integer(-0x1fffffffffffff, 0x20000000000000);
var int53Full = Random.integer(-0x20000000000000, 0x20000000000000);

// lower part of range is evenly int32, high part is easily-maskable.
var _1_0x200000000 = Random.integer(1, 0x200000000);
var _1_0x10000000000000 = Random.integer(1, 0x10000000000000);

// within int53-1
var _neg0x1fffffffffffff_0xe7ab3bddafc0e = Random.integer(-0x1fffffffffffff, 0xe7ab3bddafc0e);
var _neg0xe7ab3bddafc0d_0x20000000000000 = Random.integer(-0xe7ab3bddafc0d, 0x20000000000000);

suite
  .add('integer(1, 1)', function () {
    return _1_1(nativeMath);
  })
  .add('integer(0, 0x0f)', function () {
    return _0_15(nativeMath);
  })
  .add('integer(0, 0xff)', function () {
    return _0_255(nativeMath);
  })
  .add('integer(0, 0x7fffffff)', function () {
    return uint31(nativeMath);
  })
  .add('integer(-0x40000000, 0x3fffffff)', function () {
    return int31(nativeMath);
  })
  .add('integer(-0x80000000, 0x7fffffff)', function () {
    return int32(nativeMath);
  })
  .add('integer(0, 0xffffffff)', function () {
    return uint32(nativeMath);
  })
  .add('integer(1, 0x100000000)', function () {
    return uint32Plus1(nativeMath);
  })
  .add('integer(0, 2)', function () {
    return _0_2(nativeMath);
  })
  .add('integer(3, 7)', function () {
    return _3_7(nativeMath);
  })
  .add('integer(1, 20)', function () {
    return _1_20(nativeMath);
  })
  .add('integer(1, 2)', function () {
    return _1_2(nativeMath);
  })
  .add('integer(1, 2 * 3)', function () {
    return _1_6(nativeMath);
  })
  .add('integer(1, 2 * 3 * 5)', function () {
    return _1_30(nativeMath);
  })
  .add('integer(1, 2 * 3 * 5 * 7)', function () {
    return _1_210(nativeMath);
  })
  .add('integer(1, 2 * 3 * 5 * 7 * 11)', function () {
    return _1_2310(nativeMath);
  })
  .add('integer(1, 2 * 3 * 5 * 7 * 11 * 13)', function () {
    return _1_30030(nativeMath);
  })
  .add('integer(1, 2 * 3 * 5 * 7 * 11 * 13 * 17)', function () {
    return _1_510510(nativeMath);
  })
  .add('integer(1, 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19)', function () {
    return _1_9699690(nativeMath);
  })
  .add('integer(1, 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23)', function () {
    return _1_223092870(nativeMath);
  })
  .add('integer(1, 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23 * 29)', function () {
    return _1_6469693230(nativeMath);
  })
  .add('integer(1, 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23 * 29 * 31)', function () {
    return _1_200560490130(nativeMath);
  })
  .add('integer(1, 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23 * 29 * 31 * 37)', function () {
    return _1_7420738134810(nativeMath);
  })
  .add('integer(1, 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23 * 29 * 31 * 37 * 41)', function () {
    return _1_304250263527210(nativeMath);
  })
  .add('integer(1, 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23 * 29 * 31 * 37 * 41 * 43)', function () {
    return _1_6541380665835015(nativeMath);
  })
  .add('integer(1, 0x300000000)', function () {
    return _1_0x300000000(nativeMath);
  })
  .add('integer(0, 0x1fffffffffffff)', function () {
    return uint53(nativeMath);
  })
  .add('integer(1, 0x20000000000000)', function () {
    return uint53Plus1(nativeMath);
  })
  .add('integer(0, 0x20000000000000)', function () {
    return uint53Full(nativeMath);
  })
  .add('integer(-0x20000000000000, 0x1fffffffffffff)', function () {
    return int53(nativeMath);
  })
  .add('integer(-0x1fffffffffffff, 0x20000000000000)', function () {
    return int53Plus1(nativeMath);
  })
  .add('integer(-0x20000000000000, 0x20000000000000)', function () {
    return int53Full(nativeMath);
  })
  .add('integer(1, 0x200000000)', function () {
    return _1_0x200000000(nativeMath);
  })
  .add('integer(1, 0x10000000000000)', function () {
    return _1_0x10000000000000(nativeMath);
  })
  .add('integer(-0x1fffffffffffff, 0xe7ab3bddafc0e)', function () {
    return _neg0x1fffffffffffff_0xe7ab3bddafc0e(nativeMath);
  })
  .add('integer(-0xe7ab3bddafc0d, 0x20000000000000)', function () {
    return _neg0xe7ab3bddafc0d_0x20000000000000(nativeMath);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .run({
    async: true
  });