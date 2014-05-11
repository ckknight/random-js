(function (Random) {
  describe("integer distribution", function () {
    [-Math.pow(2, 53) - 2, -Infinity, NaN, Infinity].forEach(function (min) {
      it("throws a RangeError if min = " + min, function () {
        expect(function () {
          Random.integer(min, 0);
        }).toThrow(new RangeError("Expected min to be at least " + (-0x20000000000000)));
      });
    });

    [Math.pow(2, 53) + 2, -Infinity, NaN, Infinity].forEach(function (max) {
      it("throws a RangeError if max = " + max, function () {
        expect(function () {
          Random.integer(0, max);
        }).toThrow(new RangeError("Expected max to be at most " + 0x20000000000000));
      });
    });

    var engine;
    beforeEach(function () {
      engine = Random.engines.mt19937().autoSeed();
    });

    function cmp(alpha, bravo) {
      return alpha === bravo ? 0 : alpha < bravo ? -1 : 1;
    }

    function sorted(array, comparer) {
      return array.slice().sort(comparer || cmp);
    }

    var primeCache = [2, 3];

    function primeGenerator() {
      var index = 0;
      return function () {
        var len = primeCache.length;
        if (index < len) {
          var result = primeCache[index];
          ++index;
          return result;
        } else {
          var current = primeCache[len - 1] + 2;
          for (;; current += 2) {
            var prime = true;
            for (var i = 0; i < len; ++i) {
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

    function calculatePrimeFactors(value) {
      var sqrt = Math.sqrt(value);
      var result = [];
      var nextPrime = primeGenerator();
      while (true) {
        var prime = nextPrime();
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

    var fullScaleFactors = [5, 13, 37, 109, 246241, 279073];

    function calculatePrimeFactorsOfRange(min, max) {
      if (max - min < 0x20000000000000) {
        return calculatePrimeFactors(max - min + 1);
      } else if (min === -0x20000000000000 && max === 0x20000000000000) {
        return fullScaleFactors.slice();
      }

      var extra = 0x20000000000000;
      var rangeMinusExtra = (max - extra) - min + 1;
      var nextPrime = primeGenerator();
      while (true) {
        var prime = nextPrime();
        if (rangeMinusExtra % prime === 0) {
          return [prime].concat(calculatePrimeFactors(Math.round(rangeMinusExtra / prime + extra / prime)));
        }
      }
      throw new Error("Can't calclate prime factors of range [" + min + ", " + max + "]");
    }

    function distinct(values) {
      var result = [];
      for (var i = 0, len = values.length; i < len; ++i) {
        var value = values[i];
        if (result.indexOf(value) === -1) {
          result.push(value);
        }
      }
      return result;
    }

    function returnValue(value) {
      return function () {
        return value;
      };
    }

    function toCallback(callback) {
      return typeof callback === "function" ? callback : returnValue(callback);
    }

    function times(count, callback) {
      callback = toCallback(callback);
      var result = [];
      for (var i = 0; i < count; ++i) {
        result.push(callback(i));
      }
      return result;
    }

    function verifyBucket(bucket, iterationCount) {
      var pdf = 1 / bucket.length;
      var dividend = Math.sqrt(iterationCount * pdf);
      for (var i = 0, len = bucket.length; i < len; ++i) {
        var d = Math.abs(bucket[i] - iterationCount * pdf);
        var s = d / dividend;
        if (d > 1) {
          expect(s).not.toBeGreaterThan(5);
        }
      }
    }

    function divmod(divisor, dividend) {
      var mod = divisor % dividend;
      if (mod < 0) {
        mod += dividend;
        return [Math.floor((divisor - mod) / dividend), mod];
      } else {
        return [Math.floor(divisor / dividend), mod];
      }
    }

    function testUniformDistribution(min, max, iterationCount) {
      var range = max - min + 1;
      var factors = calculatePrimeFactorsOfRange(min, max);
      if (factors.length === 1) {
        it("is uniformly distributed within [" + min + ", " + max + "] given " + iterationCount + " iterations", function () {
          var distribution = Random.integer(min, max);
          var bucket = [];
          var i;
          for (i = 0; i < range; ++i) {
            bucket.push(0);
          }
          for (i = 0; i < iterationCount; ++i) {
            var r = distribution(engine);

            expect(r).not.toBeLessThan(min);
            expect(r).not.toBeGreaterThan(max);
            ++bucket[r - min];
          }

          verifyBucket(bucket, iterationCount);
        });
      } else {
        it("is uniformly distributed within [" + min + ", " + max + "] modulo factors {" + factors.join(", ") + "} given " + iterationCount + " iterations", function () {
          var distribution = Random.integer(min, max);
          var buckets = times(factors.length, function (i) {
            return times(factors[i], 0);
          });

          function addToBuckets(value) {
            for (var i = 0, len = factors.length; i < len; ++i) {
              var factor = factors[i];
              var result = divmod(value, factor);
              ++buckets[i][result[1]];
              value = result[0];
            }
          }
          for (var i = 0; i < iterationCount; ++i) {
            var r = distribution(engine);

            expect(r).not.toBeLessThan(min);
            expect(r).not.toBeGreaterThan(max);

            addToBuckets(r);
          }

          buckets.forEach(function (bucket) {
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
    testUniformDistribution(1, 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23 * 29 * 31, 1000);
    testUniformDistribution(1, 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23 * 29 * 31 * 37, 1000);
    testUniformDistribution(1, 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23 * 29 * 31 * 37 * 41, 1000);
    testUniformDistribution(1, 3 * 5 * 7 * 11 * 13 * 17 * 19 * 23 * 29 * 31 * 37 * 41 * 43, 1000);
    testUniformDistribution(1, 0x300000000, 1000);

    // fits perfectly into int53
    testUniformDistribution(-0x1fffffffffffff, 0x20000000000000, 1000);
    testUniformDistribution(-0x20000000000000, 0x1fffffffffffff, 1000);

    // within int53-1
    testUniformDistribution(-0x1fffffffffffff, 0xe7ab3bddafc0e, 1000);
    testUniformDistribution(-0xe7ab3bddafc0d, 0x20000000000000, 1000);

    it("returns int32 if " + -0x80000000 + " and " + 0x7fffffff + " are passed in", function () {
      var expected = Random.int32;

      var actual = Random.integer(-0x80000000, 0x7fffffff);

      expect(actual).toBe(expected);
    });

    it("returns uint32 if 0 and " + 0xffffffff + " are passed in", function () {
      var expected = Random.uint32;

      var actual = Random.integer(0, 0xffffffff);

      expect(actual).toBe(expected);
    });

    it("returns uint53 if 0 and " + 0x1fffffffffffff + " are passed in", function () {
      var expected = Random.uint53;

      var actual = Random.integer(0, 0x1fffffffffffff);

      expect(actual).toBe(expected);
    });

    it("returns uint53Full if 0 and " + 0x20000000000000 + " are passed in", function () {
      var expected = Random.uint53Full;

      var actual = Random.integer(0, 0x20000000000000);

      expect(actual).toBe(expected);
    });

    it("returns int53 if " + (-0x20000000000000) + " and " + 0x1fffffffffffff + " are passed in", function () {
      var expected = Random.int53;

      var actual = Random.integer(-0x20000000000000, 0x1fffffffffffff);

      expect(actual).toBe(expected);
    });

    it("returns int53Full if " + (-0x20000000000000) + " and " + 0x20000000000000 + " are passed in", function () {
      var expected = Random.int53Full;

      var actual = Random.integer(-0x20000000000000, 0x20000000000000);

      expect(actual).toBe(expected);
    });

    function testFullScale(min, max, distribution) {
      it("is uniformly distributed within [" + min + ", " + max + "]", function () {
        var iterationCount = 1000;
        var factors = calculatePrimeFactorsOfRange(min + 1, max);
        var buckets = times(factors.length, function (i) {
          return times(factors[i], 0);
        });

        function addToBuckets(value) {
          for (var i = 0, len = factors.length; i < len; ++i) {
            var factor = factors[i];
            var result = divmod(value, factor);
            ++buckets[i][result[1]];
            value = result[0];
          }
        }
        for (var i = 0; i < iterationCount; ++i) {
          var r = 0;
          do {
            r = distribution(engine);
          } while (r === min);

          expect(r).not.toBeLessThan(min);
          expect(r).not.toBeGreaterThan(max);

          addToBuckets(r);
        }

        buckets.forEach(function (bucket) {
          verifyBucket(bucket, iterationCount);
        });
      });
    }

    testFullScale(-0x20000000000000, 0x20000000000000, Random.int53Full);
    testFullScale(0, 0x20000000000000, Random.uint53Full);

    function makeEngine(input) {
      var index = 0;
      return function () {
        if (index >= input.length) {
          return 0;
        } else {
          return input[index++] | 0;
        }
      };
    }

    it("can generate " + 0x20000000000000 + " given a distribution of [" + (-0x20000000000000) + ", " + 0x20000000000000 + "]", function () {
      var distribution = Random.int53Full;
      var engine = makeEngine([0x400000, 0]);

      var actual = distribution(engine);

      expect(actual).toBe(0x20000000000000);
    });

    it("can generate " + 0x20000000000000 + " given a distribution of [0, " + 0x20000000000000 + "]", function () {
      var distribution = Random.uint53Full;
      var engine = makeEngine([0x200000, 0]);

      var actual = distribution(engine);

      expect(actual).toBe(0x20000000000000);
    });
  });
}(typeof module !== "undefined" ? require("../lib/random") : Random));