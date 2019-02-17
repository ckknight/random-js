/**
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul
 */
export const imul: (a: number, b: number) => number =
  typeof (Math as any).imul === "function" &&
  (Math as any).imul(0xffffffff, 5) === -5
    ? (Math as any).imul
    : (a, b) => {
        const ah = (a >>> 16) & 0xffff;
        const al = a & 0xffff;
        const bh = (b >>> 16) & 0xffff;
        const bl = b & 0xffff;
        // the shift by 0 fixes the sign on the high part
        // the final |0 converts the unsigned value into a signed value
        return (al * bl + (((ah * bl + al * bh) << 16) >>> 0)) | 0;
      };
