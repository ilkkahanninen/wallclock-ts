const getSecret = (key: string): string => {
  const value = Deno.env.get(key);
  if (value === undefined) {
    throw new Error(`Environment variable ${key} undefined`);
  }
  return value;
};

export const digitransitApiKey = getSecret("DIGITRANSIT_API_KEY");
