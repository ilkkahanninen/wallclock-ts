import { useState } from "react";

export const useFullscreen = () => {
  const [enabled, setEnabled] = useState(false);
  const available = document.fullscreenEnabled;

  const request = () => {
    console.log(request);
    if (!enabled) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setEnabled(!enabled);
  };

  return {
    available,
    request,
  };
};
