export const getRedisURL = () => {
  if (process.env.REDIS_URL === undefined) {
    throw new Error("Please provide an `REDIS_URL`");
  }

  return process.env.REDIS_URL;
};
