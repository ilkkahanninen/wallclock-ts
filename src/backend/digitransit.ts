import { digitransitApiKey } from "./secrets.ts";

const fetchDigitransit = async (query: string) => {
  const response = await fetch(
    "https://api.digitransit.fi/routing/v1/routers/finland/index/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "digitransit-subscription-key": digitransitApiKey,
      },
      body: JSON.stringify({ query }),
    }
  );
  const body = await response.text();
  try {
    return JSON.parse(body);
  } catch (error) {
    console.error(error);
    console.log(`Response was: ${body}`);
    throw error;
  }
};

type DigitransitStoptimes = {
  data: {
    stop: {
      code: string;
      name: string;
      stoptimesWithoutPatterns: StoptimeWithoutPatterns[];
    };
  };
};

type StoptimeWithoutPatterns = {
  realtimeDeparture: number;
  departureDelay: number;
  realtime: boolean;
  realtimeState: RealtimeState;
  headsign: string;
  trip: {
    routeShortName: string;
    tripHeadsign: string;
  };
};

type RealtimeState =
  | "SCHEDULED"
  | "UPDATED"
  | "CANCELLED"
  | "ADDED"
  | "MODIFIED";

export type Stop = {
  code: string;
  name: string;
  stoptimes: Stoptime[];
};

export type Stoptime = {
  departure: number;
  delay: number;
  realtime: boolean;
  state: RealtimeState;
  routeName: string;
  headsign: string;
  shortHeadsign: string;
};

export const getStoptimes = async (id: string): Promise<Stop> => {
  const stoptimes = (await fetchDigitransit(`{
    stop(id: "${id}") {
      code
      name
      stoptimesWithoutPatterns {
        realtimeDeparture
        departureDelay
        realtime
        realtimeState
        headsign
        trip {
          routeShortName
          tripHeadsign
        }
      }
    }
  }`)) as DigitransitStoptimes;

  const stop = stoptimes.data.stop;
  return {
    code: stop.code,
    name: stop.name,
    stoptimes: stop.stoptimesWithoutPatterns.map((st) => ({
      departure: st.realtimeDeparture,
      delay: st.departureDelay,
      realtime: st.realtime,
      state: st.realtimeState,
      routeName: st.trip.routeShortName,
      headsign: st.headsign,
      shortHeadsign: st.trip.tripHeadsign,
    })),
  };
};
