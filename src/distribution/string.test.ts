import { integer } from "./integer";
import { string } from "./string";

jest.mock("./integer");

describe("string", () => {
  describe("with pool = 'abcde'", () => {
    it("calls integer distribution", () => {
      string("abcde");

      expect(integer).toHaveBeenCalledWith(0, 4);
    });

    it("calls the integer distribution N times based on the length", () => {
      let index = 0;
      let expected = "";
      (integer as jest.Mock).mockReturnValue(() => {
        index = (index + 3) % 5;
        expected += "abcde".charAt(index);
        return index;
      });
      const engine = { next: () => 0 };
      const generate = string("abcde");

      const actual = generate(engine, 64);

      expect(actual).toBe(expected);
      expect(actual.length).toBe(64);
    });
  });

  describe("with default pool", () => {
    it("calls Random.integer", () => {
      string();

      expect(integer).toHaveBeenCalledWith(0, 63);
    });

    it("uses a pool of letters, numbers, '_', and '-'", () => {
      let index = 0;
      (integer as jest.Mock).mockReturnValue(() => index++);
      const engine = { next: () => 0 };
      const expected =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-";
      const generate = string();

      const actual = generate(engine, 64);

      expect(actual).toBe(expected);
    });
  });

  describe("with pool = ''", () => {
    it("throws an error", () => {
      expect(() => {
        string("");
      }).toThrow(new Error("Expected pool not to be an empty string"));
    });
  });
});
