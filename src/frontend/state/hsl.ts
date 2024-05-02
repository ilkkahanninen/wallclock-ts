import * as Http from "@effect/platform/HttpClient";
import { Effect } from "effect";
import { Stop } from "../../backend/digitransit";

export const HSLStopIds = {
  postipuistoToSouth: "HSL:1286160",
  postiljooninkatuToEast: "HSL:1286179",
  postiljooninkatuToWest: "HSL:1286180",
};

export const getStoptimes = (id: string) =>
  Http.request
    .get(`/api/stoptimes/${id}`)
    .pipe(Http.client.fetch, Http.response.json) as Effect.Effect<
    Stop,
    Http.error.HttpClientError
  >;
