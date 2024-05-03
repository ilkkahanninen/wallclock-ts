import { Effect } from "effect";
import { fetchWeatherApi } from "openmeteo";

const params = {
  latitude: 60.1695,
  longitude: 24.9354,
  current: ["temperature_2m", "relative_humidity_2m", "weather_code"],
};
const url = "https://api.open-meteo.com/v1/forecast";

const getWeather = async () => {
  const responses = await fetchWeatherApi(url, params);

  const response = responses[0];
  const utcOffsetSeconds = response.utcOffsetSeconds();

  const current = response.current()!;
  const hourly = response.hourly()!;

  // Note: The order of weather variables in the URL query and the indices below need to match!
  return {
    current: {
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      temperature2m: current.variables(0)!.value(),
      relativeHumidity2m: current.variables(1)!.value(),
      weatherCode: current.variables(2)!.value(),
    },
  };
};

export const weatherData = Effect.tryPromise(getWeather);
