import { useState } from "react";

export const useFullscreen = () => {
  const available = document.fullscreenEnabled;
  const [requested, setRequested] = useState(!!document.fullscreenElement);
  const request = () => {
    document.documentElement.requestFullscreen();
    setRequested(true);
  };

  return {
    available,
    requested,
    request,
  };
};
