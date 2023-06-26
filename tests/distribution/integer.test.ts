import { MersenneTwister19937 } from "../../src/engine/MersenneTwister19937";
import { Distribution, Engine } from "../../src/types";
import { int32 } from "../../src/distribution/int32";
import { int53 } from "../../src/distribution/int53";
import { int53Full } from "../../src/distribution/int53Full";
import { integer } from "../../src/distribution/integer";
import { uint32 } from "../../src/distribution/uint32";
import { uint53 } from "../../src/distribution/uint53";
import { uint53Full } from "../../src/distribution/uint53Full";

describe("integer distribution", () => {
  [-Math.pow(2, 53) - 2, -Infinity, NaN, Infinity].forEach(min => {
    it(`throws a RangeError if min = ${min}`, () => {
      expect(() => {
        integer(min, 0);
      }).toThrow(
        new RangeError(`Expected min to be at least ${-0x20000000000000}`)
      );
    });
  });

  [Math.pow(2, 53) + 2, -Infinity, NaN, Infinity].forEach(max => {
    it(`throws a RangeError if max = ${max}`, () => {
      expect(() => {
        integer(0, max);
      }).toThrow(
        new RangeError(`Expected max to be at most ${0x20000000000000}`)
      );
    });
  });

  let engine!: Engine;
  beforeEach(() => {
    engine = MersenneTwister19937.autoSeed();
  });

  const primeCache = [2, 3];

  function primeGenerator() {
    let index = 0;
    return () => {
      const len = primeCache.length;
      if (index < len) {
        const result = primeCache[index];
        ++index;
        return result;
      } else {
        let current = primeCache[len - 1] + 2;
        for (; ; current += 2) {
          let prime = true;
          for (let i = 0; i < len; ++i) {
            if (current % primeCache[i] === 0) {
              prime = false;
              break;
            }
          }
          if (prime) {
            primeCache.push(current);
            ++index;
            return current;
          }
        }
      }
    };
  }

  function calculatePrimeFactors(value: number) {
    const result = [];
    const nextPrime = primeGenerator();
    while (true) {
      const prime = nextPrime();
      if (prime > Math.sqrt(value)) {
        break;
      }
      while (value % prime === 0) {
        result.push(prime);
        value /= prime;
      }
    }
    if (value > 1) {
      result.push(value);
    }
    return result;
  }

  const fullScaleFactors = [5, 13, 37, 109, 246241, 279073];

  function calculatePrimeFactorsOfRange(min: number, max: number) {
    if (max - min < 0x20000000000000) {
      return calculatePrimeFactors(max - min + 1);
    } else if (min === -0x20000000000000 && max === 0x20000000000000) {
      return fullScaleFactors.slice();
    }
    const sqrt = Math.min(Math.sqrt(max - min), Number.MAX_SAFE_INTEGER);

    const extra = 0x20000000000000;
    const rangeMinusExtra = max - extra - min + 1;
    const nextPrime = primeGenerator();
    while (true) {
      const prime = nextPrime();
      if (prime > sqrt) {
        break;
      }
      if (rangeMinusExtra % prime === 0) {
        return [prime].concat(
          calculatePrimeFactors(
            Math.round(rangeMinusExtra / prime + extra / prime)
          )
        );
      }
    }
    throw new Error("uh oh");
  }

  function returnValue<T>(value: T) {
    return () => value;
  }

  function toCallback<T>(
    callback: T | ((index: number) => T)
  ): (index: number) => T {
    return typeof callback === "function"
      ? callback
      : (returnValue(callback) as any);
  }

  function times<T>(count: number, callback: T | ((index: number) => T)): T[] {
    callback = toCallback(callback);
    const result = [];
    for (let i = 0; i < count; ++i) {
      result.push(callback(i));
    }
    return result;
  }

  function verifyBucket(bucket: ReadonlyArray<number>, iterationCount: number) {
    const pdf = 1 / bucket.length;
    const dividend = Math.sqrt(iterationCount * pdf);
    for (let i = 0, len = bucket.length; i < len; ++i) {
      const d = Math.abs(bucket[i] - iterationCount * pdf);
      const s = d / dividend;
      if (d > 1) {
        expect(s).not.toBeGreaterThan(5);
      }
    }
  }

  function divmod(divisor: number, dividend: number) {
    let mod = divisor % dividend;
    if (mod < 0) {
      mod += dividend;
      return [Math.floor((divisor - mod) / dividend), mod];
    } else {
      return [Math.floor(divisor / dividend), mod];
    }
  }

  function testUniformDistribution(
    min: number,
    max: number,
    iterationCount: number
  ) {
    const range = max - min + 1;
    const factors = calculatePrimeFactorsOfRange(min, max);
    if (factors.length === 1) {
      it(`is uniformly distributed within [${min}, ${max}] given ${iterationCount} iterations`, () => {
        const distribution = integer(min, max);
        const bucket = [];
        let i;
        for (i = 0; i < range; ++i) {
          bucket.push(0);
        }
        for (i = 0; i < iterationCount; ++i) {
          const r = distribution(engine);

          expect(r).not.toBeLessThan(min);
          expect(r).not.toBeGreaterThan(max);
          ++bucket[r - min];
        }

        verifyBucket(bucket, iterationCount);
      });
    } else {
      it(`is uniformly distributed within [${min}, ${max}] modulo factors {${factors.join(
        ", "
      )}} given ${iterationCount} iterations`, () => {
        const distribution = integer(min, max);
        const buckets = times(factors.length, i => {
          return times(factors[i], 0);
        });

        function addToBuckets(value: number) {
          for (let i = 0, len = factors.length; i < len; ++i) {
            const factor = factors[i];
            const result = divmod(value, factor);
            ++buckets[i][result[1]];
            value = result[0];
          }
        }
        for (let i = 0; i < iterationCount; ++i) {
          const r = distribution(engine);

          expect(r).not.toBeLessThan(min);
          expect(r).not.toBeGreaterThan(max);

          addToBuckets(r);
        }

        buckets.forEach(bucket => {
          verifyBucket(bucket, iterationCount);
        });
      });
    }
  }

  // same min and max
  testUniformDistribution(1, 1, 10);

  // fits perfectly into int32
  testUniformDistribution(0, 0xffffffff, 1000);
  testUniformDistribution(1, 0x100000000, 1000);

  // easily maskable, since range is 2^x
  testUniformDistribution(0, 15, 1000);
  testUniformDistribution(0, 255, 1000);

  // within int32
  testUniformDistribution(0, 2, 1000);
  testUniformDistribution(3, 7, 1000);
  testUniformDistribution(1, 20, 1000);
  testUniformDistribution(1, 2, 1000);
  testUniformDistribution(1, 2 * 3, 1000);
  testUniformDistribution(1, 2 * 3 * 5, 1000);
  testUniformDistribution(1, 2 * 3 * 5 * 7, 1000);
  testUniformDistribution(1, 2 * 3 * 5 * 7 * 11, 1000);
  testUniformDistribution(1, 2 * 3 * 5 * 7 * 11 * 13, 1000);
  testUniformDistribution(1, 2 * 3 * 5 * 7 * 11 * 13 * 17, 1000);
  testUniformDistribution(1, 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19, 1000);
  testUniformDistribution(1, 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23, 1000);

  // lower part of range is evenly int32, high part is easily-maskable.
  testUniformDistribution(1, 0x200000000, 1000);
  testUniformDistribution(1, 0x10000000000000, 1000);

  // fits perfectly into uint53
  testUniformDistribution(1, 0x20000000000000, 1000);

  // within uint53-1
  testUniformDistribution(1, 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23 * 29, 1000);
  testUniformDistribution(
    1,
    2 * 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23 * 29 * 31,
    1000
  );
  testUniformDistribution(
    1,
    2 * 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23 * 29 * 31 * 37,
    1000
  );
  testUniformDistribution(
    1,
    2 * 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23 * 29 * 31 * 37 * 41,
    1000
  );
  testUniformDistribution(
    1,
    3 * 5 * 7 * 11 * 13 * 17 * 19 * 23 * 29 * 31 * 37 * 41 * 43,
    1000
  );
  testUniformDistribution(1, 0x300000000, 1000);

  // fits perfectly into int53
  testUniformDistribution(-0x1fffffffffffff, 0x20000000000000, 1000);
  testUniformDistribution(-0x20000000000000, 0x1fffffffffffff, 1000);

  // within int53-1
  testUniformDistribution(-0x1fffffffffffff, 0xe7ab3bddafc0e, 1000);
  testUniformDistribution(-0xe7ab3bddafc0d, 0x20000000000000, 1000);

  it(`returns int32 if ${-0x80000000} and ${0x7fffffff} are passed in`, () => {
    const expected = int32;

    const actual = integer(-0x80000000, 0x7fffffff);

    expect(actual).toBe(expected);
  });

  it(`returns uint32 if 0 and ${0xffffffff} are passed in`, () => {
    const expected = uint32;

    const actual = integer(0, 0xffffffff);

    expect(actual).toBe(expected);
  });

  it(`returns uint53 if 0 and ${0x1fffffffffffff} are passed in`, () => {
    const expected = uint53;

    const actual = integer(0, 0x1fffffffffffff);

    expect(actual).toBe(expected);
  });

  it(`returns uint53Full if 0 and ${0x20000000000000} are passed in`, () => {
    const expected = uint53Full;

    const actual = integer(0, 0x20000000000000);

    expect(actual).toBe(expected);
  });

  it(`returns int53 if ${-0x20000000000000} and ${0x1fffffffffffff} are passed in`, () => {
    const expected = int53;

    const actual = integer(-0x20000000000000, 0x1fffffffffffff);

    expect(actual).toBe(expected);
  });

  it(`returns int53Full if ${-0x20000000000000} and ${0x20000000000000} are passed in`, () => {
    const expected = int53Full;

    const actual = integer(-0x20000000000000, 0x20000000000000);

    expect(actual).toBe(expected);
  });

  function testFullScale(min: number, max: number, distribution: Distribution) {
    it(`is uniformly distributed within [${min}, ${max}]`, () => {
      const iterationCount = 1000;
      const factors = calculatePrimeFactorsOfRange(min + 1, max);
      const buckets = times(factors.length, i => {
        return times(factors[i], 0);
      });

      function addToBuckets(value: number) {
        for (let i = 0, len = factors.length; i < len; ++i) {
          const factor = factors[i];
          const result = divmod(value, factor);
          ++buckets[i][result[1]];
          value = result[0];
        }
      }
      for (let i = 0; i < iterationCount; ++i) {
        let r = 0;
        do {
          r = distribution(engine);
        } while (r === min);

        expect(r).not.toBeLessThan(min);
        expect(r).not.toBeGreaterThan(max);

        addToBuckets(r);
      }

      buckets.forEach(bucket => {
        verifyBucket(bucket, iterationCount);
      });
    });
  }

  testFullScale(-0x20000000000000, 0x20000000000000, int53Full);
  testFullScale(0, 0x20000000000000, uint53Full);

  function makeEngine(input: ReadonlyArray<number>) {
    let index = 0;
    return {
      next() {
        if (index >= input.length) {
          return 0;
        } else {
          return input[index++] | 0;
        }
      }
    };
  }

  it(`can generate ${0x20000000000000} given a distribution of [${-0x20000000000000}, ${0x20000000000000}]`, () => {
    const distribution = int53Full;
    const myEngine = makeEngine([0x400000, 0]);

    const actual = distribution(myEngine);

    expect(actual).toBe(0x20000000000000);
  });

  it(`can generate ${0x20000000000000} given a distribution of [0, ${0x20000000000000}]`, () => {
    const distribution = uint53Full;
    const myEngine = makeEngine([0x200000, 0]);

    const actual = distribution(myEngine);

    expect(actual).toBe(0x20000000000000);
  });
});
