type Confirmation = {
  id: number;
  message: string;
  result: boolean | null;
  createdAt: Date;
};

const confirmations: Confirmation[] = [];

export const addConfirmation = (message: string): Confirmation => {
  const confirmation: Confirmation = {
    id: nextId(),
    message,
    result: null,
    createdAt: new Date(),
  };
  confirmations.push(confirmation);
  return confirmation;
};

export const resolveConfirmation = (
  id: number,
  result: boolean
): Confirmation | null => {
  for (const c of confirmations) {
    if (c.id === id) {
      c.result = result;
      return c;
    }
  }
  return null;
};

export const waitForConfirmation = async (): Promise<Confirmation> => {
  while (true) {
    const c = confirmations.find((c) => c.result === null);
    if (c) return c;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
};

export const waitForResult = async (id: number): Promise<Confirmation> => {
  while (true) {
    const c = confirmations.find((c) => c.id === id);
    if (!c) throw new Error("Not found");
    if (c.result !== null) return c;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
};

let counter = 0;
const nextId = (): number => {
  return counter++;
};
