import { Clock } from "./Clock";
import { BusStop } from "./Stoptimes";
import { Weather } from "./Weather";
import { useFullscreen } from "./state/fullscreen";
import { HSLStopIds } from "./state/hsl";

import "./styles/Clock.css";

export const App = () => {
  const fullscreen = useFullscreen();

  return (
    <div>
      <div className="top">
        <Clock />
        <Weather />
      </div>
      <BusStop id={HSLStopIds.postipuistoToSouth} />
      <BusStop id={HSLStopIds.postiljooninkatuToEast} />
      {fullscreen.available && !fullscreen.requested && (
        <button onClick={fullscreen.request}>Fullscreen</button>
      )}
    </div>
  );
};
