export const stringRepeat = (() => {
  try {
    if (("x" as any).repeat(3) === "xxx") {
      return (pattern: string, count: number): string =>
        (pattern as any).repeat(count);
    }
  } catch (_) {
    // nothing to do here
  }
  return (pattern: string, count: number): string => {
    let result = "";
    while (count > 0) {
      if (count & 1) {
        result += pattern;
      }
      count >>= 1;
      pattern += pattern;
    }
    return result;
  };
})();
