export function bem(block: string) {
  return (elements: Record<string, string | boolean>) => ({
    className: Object.entries(elements)
      .flatMap(([element, modifier]) =>
        modifier
          ? [
              `${block}__${element}`,
              modifier !== true ? `${block}__${element}--${modifier}` : null,
            ]
          : []
      )
      .filter((c) => c !== null)
      .join(" "),
  });
}
