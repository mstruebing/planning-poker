import { average, shouldShowResults } from "./votings";

test("average", () => {
  expect(average(["1", "2", "3"])).toBe(2);
  expect(average(["?", "2", "2"])).toBe(2);
  expect(average(["", "2", "2"])).toBe(2);
  expect(average(["5", "5", "5"])).toBe(5);
  expect(average(["2", "3"])).toBe(2.5);
});

test("shouldShowResults", () => {
  expect(shouldShowResults(["1", "2", "3"])).toBeTruthy();
  expect(shouldShowResults(["", "2", "3"])).toBeFalsy();
});
