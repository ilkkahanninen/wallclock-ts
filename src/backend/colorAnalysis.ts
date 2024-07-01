import { cachedStringInput } from "./cached.ts";
import { Canvas } from "./deps.ts";

export type DynamicColors = {
  accent: string;
};

export const analyzeColors = cachedStringInput(
  async (src: string): Promise<DynamicColors> => {
    const data = await getImageData(src);
    if (!data) throw new Error("Could not read pixel data");

    const hsl = getRGBValues(data).map(RGBToHSL);
    const hues = hsl.filter((h) => h[1] > 25 && h[2] > 25).map((h) => h[0]);
    const mostCommonHue = getMostCommonValue(hues);

    const saturations = hsl
      .filter((h) => h[0] === mostCommonHue)
      .map((h) => h[1]);
    const averageSaturation = Math.round(average(saturations));
    const maxSaturation = max(saturations);
    const saturation = average([averageSaturation, maxSaturation]);

    return {
      accent: `hsl(${mostCommonHue}, ${saturation}%, 66%)`,
    };
  }
);

const getImageData = async (src: string) => {
  const size = 160;
  const image = await Canvas.loadImage(src);
  const canvas = Canvas.createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  ctx?.drawImage(image, 0, 0, image.width(), image.height(), 0, 0, size, size);
  return ctx?.getImageData(0, 0, canvas.width, canvas.height).data;
};

const getRGBValues = (data: Uint8ClampedArray): Uint8ClampedArray[] => {
  const result = [];
  for (let i = 0; i < data.length; i += 4) {
    result.push(data.slice(i, i + 3));
  }
  return result;
};

type HSLColor = [number, number, number];

const RGBToHSL = (rgb: Uint8ClampedArray): HSLColor => {
  // Make r, g, and b fractions of 1
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;

  // Find greatest and smallest channel values
  const cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin;
  let h = 0,
    s = 0,
    l = 0;

  // Calculate hue
  // No difference
  if (delta === 0) h = 0;
  // Red is max
  else if (cmax === r) h = ((g - b) / delta) % 6;
  // Green is max
  else if (cmax === g) h = (b - r) / delta + 2;
  // Blue is max
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  // Make negative hues positive behind 360°
  if (h < 0) h += 360;

  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return [h, s, l];
};

const getMostCommonValue = (ns: number[]): number => {
  const counts = ns.reduce(
    (counts, n) => ({ ...counts, [n]: (counts[n] || 0) + 1 }),
    {} as Record<number, number>
  );
  const largest = Object.entries(counts).reduce((largest, count) =>
    largest[1] > count[1] ? largest : count
  );
  return parseInt(largest[0]);
};

const average = (ns: number[]): number =>
  ns.length > 0 ? sum(ns) / ns.length : NaN;

const sum = (ns: number[]): number => ns.reduce((a, b) => a + b);

const max = (ns: number[]): number => ns.reduce((a, b) => (a > b ? a : b));
