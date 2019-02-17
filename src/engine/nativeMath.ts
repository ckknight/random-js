import { Engine } from "../types";

/**
 * An int32-producing Engine that uses `Math.random()`
 */
export const nativeMath: Engine = {
  next: () => (Math.random() * 0x100000000) | 0
};
