interface Store {
  [key: string]: { vote: string | null };
}

export const store: Store = {};

// Returns all the votes
export const getAllVotes = (store: Store): (string | null)[] => {
  const allVotes = Object.values(store).map((storeItem) => storeItem.vote);
  return allVotes;
};

// Resets every connected sockets vote to null
export const resetStore = (store: Store) => {
  Object.keys(store).map((key) => (store[key].vote = null));
};
