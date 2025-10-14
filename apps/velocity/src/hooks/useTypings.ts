import { useCallback, useEffect, useRef, useState } from "react";
import { isKeyboardCodeAllowed } from "../utils/helpers";
import { playSound } from "@/utils/soundEffects";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { setError } from "@/store/positionSlice";
import { MIN_INTERVAL_THRESHOLD, TYPING_VARIANCE_THRESHOLD } from "@/utils/constants";

const useTypings = (enabled: boolean) => {
  const [cursor, setCursor] = useState(0);
  const [typed, setTyped] = useState<string>("");
  const [isShift, setIsShift] = useState<boolean>(false);
  const totalTyped = useRef(0);
  const keystrokeTimestamps = useRef<number[]>([]);
  const sound = useSelector((state: RootState) => state.sound.sound);
  const { error } = useAppSelector(state => state.position);
  const dispatch = useAppDispatch();

  const keydownHandler = useCallback(
    ({ key, code }: KeyboardEvent) => {

      if (key === 'Shift') {
        setIsShift(true);
        return;
      }

      if (!enabled || !isKeyboardCodeAllowed(code)) return;
      if (error) return;

      const now = Date.now();
      keystrokeTimestamps.current.push(now);
      if (keystrokeTimestamps.current.length > 10) keystrokeTimestamps.current.shift()

      if (keystrokeTimestamps.current.length >= 8) {
        // array of time intervals between keystrokes
        const intervals =
          keystrokeTimestamps.current.slice(1).map((time, i) => time - keystrokeTimestamps.current[i]);

        // average of intervals
        const average =
          intervals.reduce((a, b) => a + b, 0) / intervals.length;

        // Variance close to zero indicates potential automation. sum(interval - average) / length
        const variance =
          intervals.reduce((sum, interval) => sum + Math.pow(interval - average, 2), 0) / intervals.length;

        if (variance < TYPING_VARIANCE_THRESHOLD && average < MIN_INTERVAL_THRESHOLD) {
          dispatch(setError(true));
          clearTyped()
          resetTotalTyped()
        }
      }

      if (sound) playSound(key);
      switch (key) {
        case "Backspace":
          setTyped((prev) => prev.slice(0, -1));
          setCursor((cursor) => cursor - 1);
          if (totalTyped.current !== 0) totalTyped.current -= 1;
          break;
        default:
          setTyped((prev) => prev.concat(key));
          setCursor((cursor) => cursor + 1);
          if (code !== "Space") totalTyped.current += 1;
      }
    },
    [enabled, sound, error]
  );

  const keyupHandler = useCallback(
    ({ key }: KeyboardEvent) => {
      if (key === 'Shift') {
        setIsShift(false);
      }
    }, []);

  const clearTyped = useCallback(() => {
    setTyped("");
    setCursor(0);
    keystrokeTimestamps.current = [];
  }, []);

  const resetTotalTyped = useCallback(() => {
    totalTyped.current = 0;
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", keydownHandler);
    window.addEventListener("keyup", keyupHandler);
    return () => {
      window.removeEventListener("keydown", keydownHandler);
      window.removeEventListener("keyup", keyupHandler);
    };
  }, [keydownHandler, keyupHandler]);

  return {
    typed,
    cursor,
    clearTyped,
    resetTotalTyped,
    totalTyped: totalTyped.current,
    isShift
  };
};

export default useTypings;
