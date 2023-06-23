import { bool } from "../src/distribution/bool";
import { date } from "../src/distribution/date";
import { dice } from "../src/distribution/dice";
import { die } from "../src/distribution/die";
import { hex } from "../src/distribution/hex";
import { int32 } from "../src/distribution/int32";
import { int53 } from "../src/distribution/int53";
import { int53Full } from "../src/distribution/int53Full";
import { integer } from "../src/distribution/integer";
import { pick } from "../src/distribution/pick";
import { real } from "../src/distribution/real";
import { realZeroToOneExclusive } from "../src/distribution/realZeroToOneExclusive";
import { realZeroToOneInclusive } from "../src/distribution/realZeroToOneInclusive";
import { sample } from "../src/distribution/sample";
import { shuffle } from "../src/distribution/shuffle";
import { string } from "../src/distribution/string";
import { uint32 } from "../src/distribution/uint32";
import { uint53 } from "../src/distribution/uint53";
import { uint53Full } from "../src/distribution/uint53Full";
import { uuid4 } from "../src/distribution/uuid4";
import { nativeMath } from "../src/engine/nativeMath";
import { Random } from "../src/Random";
import { Distribution, Engine } from "../src/types";

jest.mock("../src/distribution/integer");
jest.mock("../src/distribution/real");
jest.mock("../src/distribution/bool");
jest.mock("../src/distribution/pick");
jest.mock("../src/distribution/shuffle");
jest.mock("../src/distribution/sample");
jest.mock("../src/distribution/die");
jest.mock("../src/distribution/dice");
jest.mock("../src/distribution/uuid4");
jest.mock("../src/distribution/string");
jest.mock("../src/distribution/hex");
jest.mock("../src/distribution/date");
jest.mock("../src/distribution/int32");
jest.mock("../src/distribution/int53");
jest.mock("../src/distribution/int53Full");
jest.mock("../src/distribution/realZeroToOneExclusive");
jest.mock("../src/distribution/realZeroToOneInclusive");
jest.mock("../src/distribution/uint32");
jest.mock("../src/distribution/uint53");
jest.mock("../src/distribution/uint53Full");

describe("Random", () => {
  describe("constructor", () => {
    beforeEach(() => {
      (int32 as jest.Mock).mockImplementation((e: Engine) => e.next() | 0);
    });
    describe("when passed an engine", () => {
      it("uses the engine when calculating", () => {
        const engine = { next: jest.fn(() => 0) };

        const random = new Random(engine);
        random.int32();

        expect(engine.next).toHaveBeenCalledTimes(1);
      });
    });

    describe("when passed nothing", () => {
      it("uses the engine when calculating", () => {
        jest.spyOn(nativeMath, "next");

        const random = new Random();
        random.int32();

        expect(nativeMath.next).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("prototype methods", () => {
    let random!: Random;
    let engine!: Engine;
    beforeEach(() => {
      engine = {
        next: () => 0
      };
      random = new Random(engine);
    });

    describe("integer", () => {
      it("calls integer distribution", () => {
        const min = 1234;
        const max = 2345;
        const dummy = 1337;
        const spy = jest.fn().mockReturnValue(dummy);
        (integer as jest.Mock).mockReturnValue(spy);

        const actual = random.integer(min, max);

        expect(integer).toHaveBeenCalledWith(min, max);
        expect(spy).toHaveBeenCalledWith(engine);
        expect(actual).toBe(dummy);
      });
    });

    describe("real", () => {
      [false, true, undefined].forEach(inclusive =>
        describe(`with inclusive=${inclusive}`, () => {
          it("calls real distribution", () => {
            const min = 1234.5;
            const max = 2345.6;
            const dummy = 1337.5;
            const spy = jest.fn().mockReturnValue(dummy);
            (real as jest.Mock).mockReturnValue(spy);

            const actual = random.real(min, max, inclusive);

            expect(real).toHaveBeenCalledWith(min, max, inclusive || false);
            expect(spy).toHaveBeenCalledWith(engine);
            expect(actual).toBe(dummy);
          });
        })
      );
    });

    describe("bool", () => {
      describe("with no arguments", () => {
        it("calls bool distribution", () => {
          const dummy = true;
          const spy = jest.fn().mockReturnValue(dummy);
          (bool as jest.Mock).mockReturnValue(spy);

          const actual = random.bool();

          expect(bool).toHaveBeenCalledWith(undefined, undefined);
          expect(spy).toHaveBeenCalledWith(engine);
          expect(actual).toBe(dummy);
        });
      });
      describe("with one argument", () => {
        it("calls bool distribution", () => {
          const percentage = 0.1234;
          const dummy = true;
          const spy = jest.fn().mockReturnValue(dummy);
          (bool as jest.Mock).mockReturnValue(spy);

          const actual = random.bool(percentage);

          expect(bool).toHaveBeenCalledWith(percentage, undefined);
          expect(spy).toHaveBeenCalledWith(engine);
          expect(actual).toBe(dummy);
        });
      });
      describe("with two arguments", () => {
        it("calls bool distribution", () => {
          const numerator = 1234;
          const denominator = 2345;
          const dummy = true;
          const spy = jest.fn().mockReturnValue(dummy);
          (bool as jest.Mock).mockReturnValue(spy);

          const actual = random.bool(numerator, denominator);

          expect(bool).toHaveBeenCalledWith(numerator, denominator);
          expect(spy).toHaveBeenCalledWith(engine);
          expect(actual).toBe(dummy);
        });
      });
    });

    describe("pick", () => {
      it("calls pick distribution", () => {
        const array = ["a", "b", "c"];
        const dummy = "d";
        const begin = 1;
        const end = -1;
        (pick as jest.Mock).mockReturnValue(dummy);

        const actual = random.pick(array, begin, end);

        expect(pick).toHaveBeenCalledWith(engine, array, begin, end);
        expect(actual).toBe(dummy);
      });
    });

    describe("shuffle", () => {
      it("calls shuffle distribution", () => {
        const array = ["a", "b", "c"];
        const dummy = ["d"];
        (shuffle as jest.Mock).mockReturnValue(dummy);

        const actual = random.shuffle(array);

        expect(shuffle).toHaveBeenCalledWith(engine, array);
        expect(actual).toBe(dummy);
      });
    });

    describe("sample", () => {
      it("calls sample distribution", () => {
        const array = ["a", "b", "c"];
        const sampleSize = 2;
        const dummy = ["d"];
        (sample as jest.Mock).mockReturnValue(dummy);

        const actual = random.sample(array, sampleSize);

        expect(sample).toHaveBeenCalledWith(engine, array, sampleSize);
        expect(actual).toBe(dummy);
      });
    });

    describe("die", () => {
      it("calls die distribution", () => {
        const sideCount = 1337;
        const dummy = 123;
        const spy = jest.fn().mockReturnValue(dummy);
        (die as jest.Mock).mockReturnValue(spy);

        const actual = random.die(sideCount);

        expect(die).toHaveBeenCalledWith(sideCount);
        expect(spy).toHaveBeenCalledWith(engine);
        expect(actual).toBe(dummy);
      });
    });

    describe("dice", () => {
      it("calls dice distribution", () => {
        const sideCount = 1337;
        const dieCount = 6;
        const dummy = 123;
        const spy = jest.fn().mockReturnValue(dummy);
        (dice as jest.Mock).mockReturnValue(spy);

        const actual = random.dice(sideCount, dieCount);

        expect(dice).toHaveBeenCalledWith(sideCount, dieCount);
        expect(spy).toHaveBeenCalledWith(engine);
        expect(actual).toBe(dummy);
      });
    });

    describe("uuid4", () => {
      it("calls pick distribution", () => {
        const dummy = "unique";
        (uuid4 as jest.Mock).mockReturnValue(dummy);

        const actual = random.uuid4();

        expect(uuid4).toHaveBeenCalledWith(engine);
        expect(actual).toBe(dummy);
      });
    });

    describe("string", () => {
      it("calls string distribution", () => {
        const length = 1337;
        const pool = "alpha";
        const dummy = "bravo";
        const spy = jest.fn().mockReturnValue(dummy);
        (string as jest.Mock).mockReturnValue(spy);

        const actual = random.string(length, pool);

        expect(string).toHaveBeenCalledWith(pool);
        expect(spy).toHaveBeenCalledWith(engine, length);
        expect(actual).toBe(dummy);
      });
    });

    describe("hex", () => {
      it("calls hex distribution", () => {
        const length = 1337;
        const upper = true;
        const dummy = "bravo";
        const spy = jest.fn().mockReturnValue(dummy);
        (hex as jest.Mock).mockReturnValue(spy);

        const actual = random.hex(length, upper);

        expect(hex).toHaveBeenCalledWith(upper);
        expect(spy).toHaveBeenCalledWith(engine, length);
        expect(actual).toBe(dummy);
      });
    });

    describe("date", () => {
      it("calls Random.date", () => {
        const now = new Date();
        const later = new Date(now.getTime() + 86400);
        const dummy = new Date(now.getTime() + 12345);
        const spy = jest.fn().mockReturnValue(dummy);
        (date as jest.Mock).mockReturnValue(spy);

        const actual = random.date(now, later);

        expect(date).toHaveBeenCalledWith(now, later);
        expect(spy).toHaveBeenCalledWith(engine);
        expect(actual).toBe(dummy);
      });
    });

    const SIMPLE_METHODS = {
      int32,
      int53,
      int53Full,
      realZeroToOneExclusive,
      realZeroToOneInclusive,
      uint32,
      uint53,
      uint53Full
    };
    (Object.keys(SIMPLE_METHODS) as Array<keyof typeof SIMPLE_METHODS>).forEach(
      methodName => {
        const distribution: Distribution = SIMPLE_METHODS[methodName];
        describe(methodName, () => {
          it(`calls ${methodName} distribution`, () => {
            const dummy = 1234;
            (distribution as jest.Mock).mockReturnValue(dummy);

            const actual = random[methodName]();

            expect(distribution).toHaveBeenCalledWith(engine);
            expect(actual).toBe(dummy);
          });
        });
      }
    );
  });
});
