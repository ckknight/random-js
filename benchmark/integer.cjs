"use strict";

const Benchmark = require("benchmark");
const { nativeMath, integer } = require("..");

const suite = new Benchmark.Suite();

// same min and max
const _1_1 = integer(1, 1);

// easily maskable, since range is 2^x
const _0_15 = integer(0, 15);
const _0_255 = integer(0, 255);
const uint31 = integer(0, 0x7fffffff);
const int31 = integer(-0x4000000, 0x3fffffff);

// fits perfectly into int32
const int32 = integer(-0x80000000, 0x7fffffff);
const uint32 = integer(0, 0xffffffff);
const uint32Plus1 = integer(1, 0x100000000);

// within int32
const _0_2 = integer(0, 2);
const _3_7 = integer(3, 7);
const _1_20 = integer(1, 20);
const _1_2 = integer(1, 2);
const _1_6 = integer(1, 2 * 3);
const _1_30 = integer(1, 2 * 3 * 5);
const _1_210 = integer(1, 2 * 3 * 5 * 7);
const _1_2310 = integer(1, 2 * 3 * 5 * 7 * 11);
const _1_30030 = integer(1, 2 * 3 * 5 * 7 * 11 * 13);
const _1_510510 = integer(1, 2 * 3 * 5 * 7 * 11 * 13 * 17);
const _1_9699690 = integer(1, 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19);
const _1_223092870 = integer(1, 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23);
// within uint53-1
const _1_6469693230 = integer(1, 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23 * 29);
const _1_200560490130 = integer(
  1,
  2 * 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23 * 29 * 31
);
const _1_7420738134810 = integer(
  1,
  2 * 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23 * 29 * 31 * 37
);
const _1_304250263527210 = integer(
  1,
  2 * 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23 * 29 * 31 * 37 * 41
);
const _1_6541380665835015 = integer(
  1,
  3 * 5 * 7 * 11 * 13 * 17 * 19 * 23 * 29 * 31 * 37 * 41 * 43
);
const _1_0x300000000 = integer(1, 0x300000000);

const uint53 = integer(0, 0x1fffffffffffff);
const uint53Plus1 = integer(1, 0x20000000000000);
const uint53Full = integer(0, 0x20000000000000);
const int53 = integer(-0x20000000000000, 0x1fffffffffffff);
const int53Plus1 = integer(-0x1fffffffffffff, 0x20000000000000);
const int53Full = integer(-0x20000000000000, 0x20000000000000);

// lower part of range is evenly int32, high part is easily-maskable.
const _1_0x200000000 = integer(1, 0x200000000);
const _1_0x10000000000000 = integer(1, 0x10000000000000);

// within int53-1
const _neg0x1fffffffffffff_0xe7ab3bddafc0e = integer(
  -0x1fffffffffffff,
  0xe7ab3bddafc0e
);
const _neg0xe7ab3bddafc0d_0x20000000000000 = integer(
  -0xe7ab3bddafc0d,
  0x20000000000000
);

suite
  .add("integer(1, 1)", () => _1_1(nativeMath))
  .add("integer(0, 0x0f)", () => _0_15(nativeMath))
  .add("integer(0, 0xff)", () => _0_255(nativeMath))
  .add("integer(0, 0x7fffffff)", () => uint31(nativeMath))
  .add("integer(-0x40000000, 0x3fffffff)", () => int31(nativeMath))
  .add("integer(-0x80000000, 0x7fffffff)", () => int32(nativeMath))
  .add("integer(0, 0xffffffff)", () => uint32(nativeMath))
  .add("integer(1, 0x100000000)", () => uint32Plus1(nativeMath))
  .add("integer(0, 2)", () => _0_2(nativeMath))
  .add("integer(3, 7)", () => _3_7(nativeMath))
  .add("integer(1, 20)", () => _1_20(nativeMath))
  .add("integer(1, 2)", () => _1_2(nativeMath))
  .add("integer(1, 2 * 3)", () => _1_6(nativeMath))
  .add("integer(1, 2 * 3 * 5)", () => _1_30(nativeMath))
  .add("integer(1, 2 * 3 * 5 * 7)", () => _1_210(nativeMath))
  .add("integer(1, 2 * 3 * 5 * 7 * 11)", () => _1_2310(nativeMath))
  .add("integer(1, 2 * 3 * 5 * 7 * 11 * 13)", () => _1_30030(nativeMath))
  .add("integer(1, 2 * 3 * 5 * 7 * 11 * 13 * 17)", () => _1_510510(nativeMath))
  .add("integer(1, 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19)", () =>
    _1_9699690(nativeMath)
  )
  .add("integer(1, 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23)", () =>
    _1_223092870(nativeMath)
  )
  .add("integer(1, 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23 * 29)", () =>
    _1_6469693230(nativeMath)
  )
  .add("integer(1, 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23 * 29 * 31)", () =>
    _1_200560490130(nativeMath)
  )
  .add(
    "integer(1, 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23 * 29 * 31 * 37)",
    () => _1_7420738134810(nativeMath)
  )
  .add(
    "integer(1, 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23 * 29 * 31 * 37 * 41)",
    () => _1_304250263527210(nativeMath)
  )
  .add(
    "integer(1, 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23 * 29 * 31 * 37 * 41 * 43)",
    () => _1_6541380665835015(nativeMath)
  )
  .add("integer(1, 0x300000000)", () => _1_0x300000000(nativeMath))
  .add("integer(0, 0x1fffffffffffff)", () => uint53(nativeMath))
  .add("integer(1, 0x20000000000000)", () => uint53Plus1(nativeMath))
  .add("integer(0, 0x20000000000000)", () => uint53Full(nativeMath))
  .add("integer(-0x20000000000000, 0x1fffffffffffff)", () => int53(nativeMath))
  .add("integer(-0x1fffffffffffff, 0x20000000000000)", () =>
    int53Plus1(nativeMath)
  )
  .add("integer(-0x20000000000000, 0x20000000000000)", () =>
    int53Full(nativeMath)
  )
  .add("integer(1, 0x200000000)", () => _1_0x200000000(nativeMath))
  .add("integer(1, 0x10000000000000)", () => _1_0x10000000000000(nativeMath))
  .add("integer(-0x1fffffffffffff, 0xe7ab3bddafc0e)", () =>
    _neg0x1fffffffffffff_0xe7ab3bddafc0e(nativeMath)
  )
  .add("integer(-0xe7ab3bddafc0d, 0x20000000000000)", () =>
    _neg0xe7ab3bddafc0d_0x20000000000000(nativeMath)
  )
  .on("cycle", function(event) {
    console.log(String(event.target));
  })
  .run({
    async: true
  });
