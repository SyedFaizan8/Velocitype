import { useCallback, useEffect, useState } from "react";
import { countErrors } from "../utils/helpers";
import useCountdown from "./useCountdown";
import useWords from "./useWords";
import useTypings from "./useTypings";

export type State = "start" | "run" | "finish";

const COUNTDOWN_SECONDS = 15;

const useEngine = () => {
    const [state, setState] = useState<State>("start");
    const { timeLeft, startCountdown, resetCountdown } = useCountdown(COUNTDOWN_SECONDS);
    const { words, updateWords } = useWords();
    const { cursor, typed, clearTyped, totalTyped, resetTotalTyped, totalWords } = useTypings(state !== "finish");

    const [errors, setErrors] = useState(0);

    const isStarting = state === "start" && cursor > 0;
    const areWordsFinished = cursor === words.length;

    const restart = useCallback(() => {
        console.log("restarting...");
        resetCountdown();
        resetTotalTyped();
        setState("start");
        setErrors(0);
        updateWords();
        clearTyped();
    }, [clearTyped, updateWords, resetCountdown, resetTotalTyped]);

    const sumErrors = useCallback(() => {
        console.log(`cursor: ${cursor} - words.length: ${words.length}`);
        const wordsReached = words.substring(0, Math.min(cursor, words.length));
        setErrors((prevErrors) => prevErrors + countErrors(typed, wordsReached));
    }, [typed, words, cursor]);

    // as soon the user starts typing the first letter, we start
    useEffect(() => {
        if (isStarting) {
            setState("run");
            startCountdown();
        }
    }, [isStarting, startCountdown]);

    // when the time is up, we've finished
    useEffect(() => {
        if (!timeLeft && state === "run") {
            console.log("time is up...");
            setState("finish");
            sumErrors();
        }
    }, [timeLeft, state, sumErrors]);

    /**
     * when the current words are all filled up,
     * we generate and show another set of words
     */
    useEffect(() => {
        if (areWordsFinished) {
            console.log("words are finished...");
            sumErrors();
            updateWords();
            clearTyped();
        }
    }, [clearTyped, areWordsFinished, updateWords, sumErrors]);

    return { state, words, typed, errors, restart, timeLeft, totalTyped, totalWords };
};

export default useEngine;
