import { nativeMath } from "../engine/nativeMath";
import { createEntropy } from "./createEntropy";

describe("createEntropy", () => {
  it("returns a non-empty array of int32s", () => {
    const actual = createEntropy();

    expect(actual instanceof Array).toBe(true);
    expect(actual.length).not.toBe(false);
    for (const value of actual) {
      expect(value).toBe(value | 0);
    }
  });

  it("gets entropy from the current date", () => {
    const GLOBAL: any = typeof window !== "undefined" ? window : global;
    const realDate = GLOBAL.Date;
    try {
      const stubDate = {
        getTime: () => {
          return 0x12345678;
        }
      };
      // tslint:disable-next-line:only-arrow-functions
      GLOBAL.Date = jest.fn().mockImplementation(() => stubDate);

      const actual = createEntropy();

      expect(actual).toContain(stubDate.getTime());
    } finally {
      GLOBAL.Date = realDate;
    }
  });

  it("gets entropy from the nativeMath engine", () => {
    jest.spyOn(nativeMath, "next");

    createEntropy();

    expect(nativeMath.next).toHaveBeenCalled();
  });
});
