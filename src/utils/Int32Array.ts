/**
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int32Array
 */
const I32Array: typeof Int32Array = (() => {
  try {
    const buffer = new ArrayBuffer(4);
    const view = new Int32Array(buffer);
    view[0] = 0x80000000;
    if (view[0] === -0x80000000) {
      return Int32Array;
    }
  } catch {
    // nothing to do here
  }
  return (Array as unknown) as typeof Int32Array;
})();
export { I32Array as Int32Array };
