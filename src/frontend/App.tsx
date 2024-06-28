import { Background } from "./Background";
import { BluOS } from "./BluOs";
import { Clock } from "./Clock";
import { BusStop } from "./Stoptimes";
import { Weather } from "./Weather";
import { HSLStopIds } from "./state/hsl";

import "./styles/Clock.css";

export const App = () => {
  return (
    <Background>
      <div className="top">
        <Clock />
        <Weather />
      </div>
      <BluOS />
      <div className="top">
        <BusStop id={HSLStopIds.postipuistoToSouth} />
        <BusStop id={HSLStopIds.postiljooninkatuToEast} />
      </div>
    </Background>
  );
};
