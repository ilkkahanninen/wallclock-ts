import { Either, Option, pipe } from "effect";
import { useContext, useEffect } from "react";
import { BgContext } from "./Background";
import { bem } from "./bem";
import { playerStatus } from "./state/bluos";
import { renderScheduled, useSchedule } from "./state/useSchedule";
import "./styles/BluOS.css";

const cx = bem("BluOS");

export const BluOS = () => {
  const currentStatus = useSchedule(playerStatus, "1 seconds");

  const background = useContext(BgContext);
  useEffect(() => {
    if (currentStatus) {
      pipe(
        currentStatus,
        Option.match({
          onSome: Either.map((s) => {
            if (s?.image) {
              background.setImage(s.image);
            } else {
              background.clearImage();
            }
            return Option.none;
          }),
          onNone: () => {
            background.clearImage();
            return Option.none;
          },
        })
      );
    }
  }, [currentStatus, background]);

  return renderScheduled(
    currentStatus,
    (status) =>
      status && (
        <div {...cx({ container: true })}>
          <img {...cx({ cover: true })} src={status.image} />
          <ul {...cx({ titles: true })}>
            {status.titles.map((title, i) => (
              <li key={i}>{title}</li>
            ))}
          </ul>
        </div>
      ),
    (e) => {
      console.error(e);
      return null;
    }
  );
};
