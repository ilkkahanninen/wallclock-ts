import { Clock } from "./Clock";
import { BusStop } from "./Stoptimes";
import { Weather } from "./Weather";
import { HSLStopIds } from "./state/hsl";

import "./styles/Clock.css";

export const App = () => (
  <div>
    <div className="top">
      <Clock />
      <Weather />
    </div>
    <BusStop id={HSLStopIds.postipuistoToSouth} />
    <BusStop id={HSLStopIds.postiljooninkatuToEast} />
  </div>
);
