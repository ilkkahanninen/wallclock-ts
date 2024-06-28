export const useFullscreen = () => {
  const available = document.fullscreenEnabled;
  const request = () => {
    document.documentElement.requestFullscreen();
  };

  return {
    available,
    request,
  };
};
