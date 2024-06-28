import * as React from "react";
import { useFullscreen } from "./state/fullscreen";
import "./styles/Background.css";

export type BgContextType = {
  setImage: (url: string) => void;
  clearImage: () => void;
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

  return (
    <>
      <div
        className="Background__image"
        style={{ backgroundImage: image ? `url("${image}")` : "none" }}
        onClick={fullscreen.available ? fullscreen.request : undefined}
      />
      <div className="Background__content">
        <BgContext.Provider value={context}>
          {props.children}
        </BgContext.Provider>
      </div>
    </>
  );
};
