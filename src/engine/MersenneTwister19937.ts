import { Engine } from "../types";
import { createEntropy } from "../utils/createEntropy";
import { imul } from "../utils/imul";
import { Int32Array } from "../utils/Int32Array";

/**
 * An Engine that is a pseudorandom number generator using the Mersenne
 * Twister algorithm based on the prime 2**19937 − 1
 *
 * See http://en.wikipedia.org/wiki/Mersenne_twister
 */
export class MersenneTwister19937 implements Engine {
  /**
   * Returns a MersenneTwister19937 seeded with an initial int32 value
   * @param initial the initial seed value
   */
  public static seed(initial: number): MersenneTwister19937 {
    return new MersenneTwister19937().seed(initial);
  }

  /**
   * Returns a MersenneTwister19937 seeded with zero or more int32 values
   * @param source A series of int32 values
   */
  public static seedWithArray(source: ArrayLike<number>): MersenneTwister19937 {
    return new MersenneTwister19937().seedWithArray(source);
  }

  /**
   * Returns a MersenneTwister19937 seeded with the current time and
   * a series of natively-generated random values
   */
  public static autoSeed(): MersenneTwister19937 {
    return MersenneTwister19937.seedWithArray(createEntropy());
  }

  private readonly data = new Int32Array(624);
  private index = 0; // integer within [0, 624]
  private uses = 0;

  /**
   * MersenneTwister19937 should not be instantiated directly.
   * Instead, use the static methods `seed`, `seedWithArray`, or `autoSeed`.
   */
  private constructor() {}

  /**
   * Returns the next int32 value of the sequence
   */
  public next(): number {
    if ((this.index | 0) >= 624) {
      refreshData(this.data);
      this.index = 0;
    }

    const value = this.data[this.index];
    this.index = (this.index + 1) | 0;
    this.uses += 1;
    return temper(value) | 0;
  }

  /**
   * Returns the number of times that the Engine has been used.
   *
   * This can be provided to an unused MersenneTwister19937 with the same
   * seed, bringing it to the exact point that was left off.
   */
  public getUseCount(): number {
    return this.uses;
  }

  /**
   * Discards one or more items from the engine
   * @param count The count of items to discard
   */
  public discard(count: number): this {
    if (count <= 0) {
      return this;
    }
    this.uses += count;
    if ((this.index | 0) >= 624) {
      refreshData(this.data);
      this.index = 0;
    }
    while (count + this.index > 624) {
      count -= 624 - this.index;
      refreshData(this.data);
      this.index = 0;
    }
    this.index = (this.index + count) | 0;
    return this;
  }

  private seed(initial: number): this {
    let previous = 0;
    this.data[0] = previous = initial | 0;

    for (let i = 1; i < 624; i = (i + 1) | 0) {
      this.data[i] = previous =
        (imul(previous ^ (previous >>> 30), 0x6c078965) + i) | 0;
    }
    this.index = 624;
    this.uses = 0;
    return this;
  }

  private seedWithArray(source: ArrayLike<number>): this {
    this.seed(0x012bd6aa);
    seedWithArray(this.data, source);
    return this;
  }
}

function refreshData(data: Int32Array) {
  let k = 0;
  let tmp = 0;
  for (; (k | 0) < 227; k = (k + 1) | 0) {
    tmp = (data[k] & 0x80000000) | (data[(k + 1) | 0] & 0x7fffffff);
    data[k] = data[(k + 397) | 0] ^ (tmp >>> 1) ^ (tmp & 0x1 ? 0x9908b0df : 0);
  }

  for (; (k | 0) < 623; k = (k + 1) | 0) {
    tmp = (data[k] & 0x80000000) | (data[(k + 1) | 0] & 0x7fffffff);
    data[k] = data[(k - 227) | 0] ^ (tmp >>> 1) ^ (tmp & 0x1 ? 0x9908b0df : 0);
  }

  tmp = (data[623] & 0x80000000) | (data[0] & 0x7fffffff);
  data[623] = data[396] ^ (tmp >>> 1) ^ (tmp & 0x1 ? 0x9908b0df : 0);
}

function temper(value: number) {
  value ^= value >>> 11;
  value ^= (value << 7) & 0x9d2c5680;
  value ^= (value << 15) & 0xefc60000;
  return value ^ (value >>> 18);
}

function seedWithArray(data: Int32Array, source: ArrayLike<number>) {
  let i = 1;
  let j = 0;
  const sourceLength = source.length;
  let k = Math.max(sourceLength, 624) | 0;
  let previous = data[0] | 0;
  for (; (k | 0) > 0; --k) {
    data[i] = previous =
      ((data[i] ^ imul(previous ^ (previous >>> 30), 0x0019660d)) +
        (source[j] | 0) +
        (j | 0)) |
      0;
    i = (i + 1) | 0;
    ++j;
    if ((i | 0) > 623) {
      data[0] = data[623];
      i = 1;
    }
    if (j >= sourceLength) {
      j = 0;
    }
  }
  for (k = 623; (k | 0) > 0; --k) {
    data[i] = previous =
      ((data[i] ^ imul(previous ^ (previous >>> 30), 0x5d588b65)) - i) | 0;
    i = (i + 1) | 0;
    if ((i | 0) > 623) {
      data[0] = data[623];
      i = 1;
    }
  }
  data[0] = 0x80000000;
}
