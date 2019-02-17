import { Engine } from "../types";

/**
 * Returns a value within [-0x20000000000000, 0x1fffffffffffff]
 */
export function int53(engine: Engine): number {
  const high = engine.next() | 0;
  const low = engine.next() >>> 0;
  return (
    (high & 0x1fffff) * 0x100000000 +
    low +
    (high & 0x200000 ? -0x20000000000000 : 0)
  );
}
