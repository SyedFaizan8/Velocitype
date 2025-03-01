"use client"

import { useCallback, useEffect, useState } from "react";
import { countErrors } from "../utils/helpers";
import useCountdown from "./useCountdown";
import useWords from "./useWords";
import useTypings from "./useTypings";
import { useAppDispatch } from "@/store/reduxHooks";
import { changePosition } from "@/store/positionSlice";

export type State = "start" | "run" | "finish";

const useEngine = (timer: number) => {
    const [state, setState] = useState<State>("start");
    const { timeLeft, startCountdown, resetCountdown } = useCountdown(timer);
    const { words, updateWords } = useWords();
    const { cursor, typed, clearTyped, totalTyped, resetTotalTyped } = useTypings(state !== "finish");
    const dispatch = useAppDispatch();

    const [errors, setErrors] = useState(0);

    const isStarting = state === "start" && cursor > 0;
    const areWordsFinished = cursor === words.length;

    const restart = useCallback(() => {
        resetCountdown();
        resetTotalTyped();
        setState("start");
        dispatch(changePosition("start"))
        setErrors(0);
        updateWords();
        clearTyped();
    }, [clearTyped, updateWords, resetCountdown, resetTotalTyped]);

    const sumErrors = useCallback(() => {
        const wordsReached = words.substring(0, Math.min(cursor, words.length));
        setErrors((prevErrors) => prevErrors + countErrors(typed, wordsReached));
    }, [typed, words, cursor]);

    // as soon the user starts typing the first letter, we start
    useEffect(() => {
        if (isStarting) {
            setState("run");
            dispatch(changePosition("run"))
            startCountdown();
        }
    }, [isStarting, startCountdown]);

    // when the time is up, we've finished
    useEffect(() => {
        if (!timeLeft && state === "run") {
            setState("finish");
            dispatch(changePosition("finish"))
            sumErrors();
        }
    }, [timeLeft, state, sumErrors]);

    /**
     * when the current words are all filled up,
     * we generate and show another set of words
     */
    useEffect(() => {
        if (areWordsFinished) {
            // console.log("words are finished...");
            sumErrors();
            updateWords();
            clearTyped();
        }
    }, [clearTyped, areWordsFinished, updateWords, sumErrors]);

    return { state, words, typed, errors, restart, timeLeft, totalTyped };
};

export default useEngine;
