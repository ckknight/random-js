import { Engine } from "../types";

/**
 * Returns a value within [-0x20000000000000, 0x20000000000000]
 */
export function int53Full(engine: Engine): number {
  while (true) {
    const high = engine.next() | 0;
    if (high & 0x400000) {
      if ((high & 0x7fffff) === 0x400000 && (engine.next() | 0) === 0) {
        return 0x20000000000000;
      }
    } else {
      const low = engine.next() >>> 0;
      return (
        (high & 0x1fffff) * 0x100000000 +
        low +
        (high & 0x200000 ? -0x20000000000000 : 0)
      );
    }
  }
}
