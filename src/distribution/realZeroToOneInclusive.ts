import { Engine } from "../types";
import { uint53Full } from "./uint53Full";

/**
 * Returns a floating-point value within [0.0, 1.0]
 */
export function realZeroToOneInclusive(engine: Engine): number {
  return uint53Full(engine) / 0x20000000000000;
}
