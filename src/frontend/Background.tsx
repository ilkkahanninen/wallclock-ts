import * as React from "react";
import { useFullscreen } from "./state/fullscreen";
import "./styles/Background.css";
import { useSchedule } from "./state/useSchedule";
import { getDynamicColors } from "./state/colors";
import { useRunOnChange } from "./state/useRunOnChange";
import { DynamicColors } from "../backend/colorAnalysis";

export type BgContextType = {
  setImage: (url: string) => void;
  clearImage: () => void;
  colors?: DynamicColors;
};

const emptyContext: BgContextType = {
  setImage(_) {
    throw new Error("BgContext missing");
  },
  clearImage() {
    throw new Error("BgContext missing");
  },
};

export const BgContext = React.createContext(emptyContext);

export const Background = (props: React.PropsWithChildren) => {
  const fullscreen = useFullscreen();
  const [image, setImage] = React.useState<string>();

  const context = React.useMemo(
    () => ({ setImage, clearImage: () => setImage(undefined) }),
    []
  );

  const colors = useRunOnChange(getDynamicColors, image);
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent-color", colors?.accent || "#6c4");
  }, [colors]);

  return (
    <>
      <div
        className="Background__image"
        style={{ backgroundImage: image ? `url("${image}")` : "none" }}
      />
      <div className="Background__content" onDoubleClick={fullscreen.request}>
        <BgContext.Provider value={context}>
          {props.children}
        </BgContext.Provider>
      </div>
    </>
  );
};
