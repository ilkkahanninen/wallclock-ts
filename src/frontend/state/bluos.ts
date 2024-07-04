import { parse } from "@lowlighter/xml/parse";
import { Effect } from "effect";

const bluOSPlayerIP: string | null = (() => {
  const match = location.search.match(/bluos=(.+)/);
  return match ? match[1] : null;
})();

const bluOSAddress = `http://${bluOSPlayerIP}:11000`;

export type PlayerStatus = {
  etag: string;
  titles: string[];
  image?: string;
  serviceIcon: string;
  service: string;
};

const fetchPlayerStatus = async (etag?: string) => {
  const response = await fetch(
    `${bluOSAddress}/Status?timeout=100${etag ? `&etag=${etag}` : ""}`
  );
  const body = await response.text();
  const xml = await parse(body);
  const data = xml.status as any;
  return ["play", "stream"].includes(data.state)
    ? ({
        etag: data["@etag"],
        titles: [data.title1, data.title2, data.title3],
        image:
          data.image[0] === "/" ? `${bluOSAddress}${data.image}` : data.image,
      } as PlayerStatus)
    : null;
};

let etag: string | undefined = undefined;

const getCurrentStatus = async () => {
  const status = await fetchPlayerStatus(etag);
  etag = status?.etag;
  return status;
};

export const playerStatus: Effect.Effect<PlayerStatus | null, Error> =
  bluOSPlayerIP ? Effect.tryPromise(getCurrentStatus) : Effect.sync(() => null);
