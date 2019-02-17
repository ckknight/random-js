import { dice } from "./dice";
import { die } from "./die";

jest.mock("./die");

describe("dice", () => {
  function makeReturner<T>(input: ReadonlyArray<T>): () => T {
    let index = 0;
    return () => {
      return input[index++];
    };
  }
  it("creates a distribution using die and uses it repeatedly", () => {
    const data = [1, 2, 3, 4, 5, 6];
    const dieCount = 4;
    const expected = data.slice(0, dieCount);
    (die as jest.Mock).mockReturnValue(makeReturner(data));
    const sideCount = 1337;

    const rollDice = dice(sideCount, dieCount);
    const actual = rollDice({ next: () => 0 });

    expect(die).toHaveBeenCalledWith(sideCount);
    expect(actual).toEqual(expected);
  });
});
