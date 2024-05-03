import { bem } from "./bem";
import { weatherData } from "./state/openmeteo";
import { useSchedule } from "./state/useSchedule";
import "./styles/Weather.css";

const cx = bem("Weather");

export const Weather = () => {
  const { value: weather } = useSchedule(weatherData, "10 minutes");

  return (
    weather && (
      <div {...cx({ current: true })}>
        {weather.current.temperature2m.toFixed(1)}°C
      </div>
    )
  );
};
