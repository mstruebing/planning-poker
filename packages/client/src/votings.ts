export const POSSIBLE_VOTES = ["?", 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

export const shouldShowResults = (votings: Array<string>): boolean => {
  return votings.every((v) => v !== "");
};

export const average = (votings: Array<string>): number => {
  const parsedVotings = votings.reduce((acc, vote) => {
    const parsedVote = parseInt(vote ?? "");
    if (isNaN(parsedVote)) {
      return acc;
    }
    return [...acc, parsedVote];
  }, [] as number[]);

  return parsedVotings.reduce((a, b) => a + b, 0) / parsedVotings.length;
};
