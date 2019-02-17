import { date } from "./date";
import { integer } from "./integer";

jest.mock("./integer");

describe("date distribution", () => {
  it("returns a wrapped integer distribution from start time to end time", () => {
    const now = new Date();
    const later = new Date(now.getTime() + 86400);
    const resultDummy = now.getTime() + 40000;
    const spy = jest.fn().mockReturnValue(resultDummy);
    (integer as jest.Mock).mockReturnValue(spy);
    const engine = {} as any;

    const distribution = date(now, later);
    const actual = distribution(engine);

    expect(integer).toHaveBeenCalledWith(now.getTime(), later.getTime());
    expect(spy).toHaveBeenCalledWith(engine);
    expect(actual).toEqual(new Date(resultDummy));
  });
});
