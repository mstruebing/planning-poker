import Redis from "ioredis";

import { getRedisURL } from "./config";

export const redis = new Redis(6379, getRedisURL());

// Returns all the votes
export const getAllVotes = async (): Promise<(string | null)[]> => {
  const keys = await redis.keys("*");
  if (keys.length > 0) {
    const values = await redis.mget(keys);
    return values;
  }

  return [];
};

// Resets every connected sockets vote
export const resetStore = async () => {
  const keys = await redis.keys("*");
  if (keys.length > 0) {
    // Construct an object suitable for mset
    // {key1: "value", key2: "value"}
    const values = keys.reduce((obj, key) => {
      return { ...obj, [key]: "" };
    }, {});

    await redis.mset(values);
  }
};
