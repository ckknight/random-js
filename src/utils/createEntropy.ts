import { nativeMath } from "../engine/nativeMath";
import { Engine } from "../types";

/**
 * Returns an array of random int32 values.
 *
 * @param engine an Engine to pull random values from
 */
export function createEntropy(engine: Engine = nativeMath) {
  const array: number[] = [];
  for (let i = 0; i < 16; ++i) {
    array[i] = engine.next() | 0;
  }
  array.push(new Date().getTime() | 0);
  return array;
}
