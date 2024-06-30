export const cached =
  <I>(getKey: (i: I) => string) =>
  <O>(f: (i: I) => O) => {
    const cache: Record<string, O> = {};
    return (input: I) => {
      const key = getKey(input);
      let value = cache[key];
      if (value) {
        return value;
      }
      value = f(input);
      cache[key] = value;
      return value;
    };
  };

export const cachedStringInput = cached((s: string) => s);
