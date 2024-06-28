import { Background } from "./Background";
import { BluOS } from "./BluOs";
import { Clock } from "./Clock";
import { BusStop } from "./Stoptimes";
import { Weather } from "./Weather";
import { HSLStopIds } from "./state/hsl";

import "./styles/Clock.css";
import "./styles/Stoptimes.css";

export const App = () => {
  return (
    <Background>
      <div className="top">
        <Clock />
        <Weather />
      </div>
      <div className="main">
        <BluOS />
        <div className="Stoptimes__container">
          <BusStop id={HSLStopIds.postipuistoToSouth} />
          <BusStop id={HSLStopIds.postiljooninkatuToEast} />
        </div>
      </div>
    </Background>
  );
};
