import { Engine } from "../types";
import { uint53 } from "./uint53";

/**
 * Returns a floating-point value within [0.0, 1.0)
 */
export function realZeroToOneExclusive(engine: Engine): number {
  return uint53(engine) / 0x20000000000000;
}
