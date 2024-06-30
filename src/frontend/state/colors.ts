import * as Http from "@effect/platform/HttpClient";
import { Effect, pipe } from "effect";
import { DynamicColors } from "../../backend/colorAnalysis";

export const getRedirectUrl = (url: string) =>
  Effect.tryPromise(async () => {
    const response = await fetch(url);
    return response.redirected ? response.url : url;
  });

export const analyzeDynamicColors = (imageSrc: string) => {
  console.log("analyzeDynamicColors", imageSrc);
  return Http.request
    .get(`/api/colors?src=${imageSrc}`)
    .pipe(Http.client.fetchOk, Http.response.json) as Effect.Effect<
    DynamicColors,
    Http.error.HttpClientError
  >;
};

export const getDynamicColors = (imageSrc: string) =>
  Effect.andThen(getRedirectUrl(imageSrc), analyzeDynamicColors);
