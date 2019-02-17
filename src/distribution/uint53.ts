import { Engine } from "../types";

/**
 * Returns a value within [0, 0x1fffffffffffff]
 */
export function uint53(engine: Engine): number {
  const high = engine.next() & 0x1fffff;
  const low = engine.next() >>> 0;
  return high * 0x100000000 + low;
}
