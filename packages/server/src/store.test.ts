import { store, getAllVotes, resetStore } from "./store";

describe("store", () => {
  beforeEach(() => {
    resetStore(store);
  });

  test("getAllVotes", () => {
    store["123"] = {
      vote: "1",
    };

    store["456"] = {
      vote: "2",
    };

    expect(getAllVotes(store)).toStrictEqual(["1", "2"]);
  });

  test("resetStore", () => {
    store["123"] = {
      vote: "1",
    };

    store["456"] = {
      vote: "2",
    };

    resetStore(store);

    expect(getAllVotes(store)).toStrictEqual([null, null]);
  });
});
