import { Clock } from "./Clock";
import { BusStop } from "./Stoptimes";
import { HSLStopIds } from "./state/hsl";

import "./styles/Clock.css";

export const App = () => (
  <div>
    <Clock />
    <BusStop id={HSLStopIds.postipuistoToSouth} />
    <BusStop id={HSLStopIds.postiljooninkatuToEast} />
  </div>
);
