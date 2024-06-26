import { parse } from "@lowlighter/xml/parse";
import { Effect } from "effect";

const bluOSPlayerIP = (() => {
  const match = location.search.match(/bluos=([\d.]+)/);
  return match ? match[1] : null;
})();

const bluOSAddress = `http://${bluOSPlayerIP}:11000`;

export type PlayerStatus = {
  etag: string;
  titles: string[];
  image: string;
  serviceIcon: string;
  service: string;
  playing: boolean;
};

const fetchPlayerStatus = async (etag?: string) => {
  const response = await fetch(
    `${bluOSAddress}/Status?timeout=100${etag ? `&etag=${etag}` : ""}`
  );
  const body = await response.text();
  const xml = await parse(body);
  const data = xml.status as any;
  return {
    etag: data["@etag"],
    titles: [data.title1, data.title2, data.title3],
    image: `${bluOSAddress}${data.image}`,
    playing: ["play", "stream"].includes(data.state),
  } as PlayerStatus;
};

let etag: string | undefined = undefined;

const getCurrentStatus = async () => {
  const status = await fetchPlayerStatus(etag);
  etag = status["@etag"];
  return status;
};

export const playerStatus = Effect.tryPromise(getCurrentStatus);
