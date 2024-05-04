import { bem } from "./bem";
import { weatherData } from "./state/openmeteo";
import { renderScheduled, useSchedule } from "./state/useSchedule";
import "./styles/Weather.css";

const cx = bem("Weather");

export const Weather = () => {
  const weather = useSchedule(weatherData, "10 minutes");

  return renderScheduled(
    weather,
    (weather) => (
      <div {...cx({ current: true })}>
        {weather.current.temperature2m.toFixed(1)}°C
      </div>
    ),
    (error) => (
      <div className="error">
        Säätietoja ei saatu ladattua ({error.message})
      </div>
    )
  );
};
