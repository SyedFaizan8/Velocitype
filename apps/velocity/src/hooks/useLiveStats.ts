import { useMemo } from "react";

const COUNTDOWN_SECONDS = 15;

const useLiveStats = (totalWords: string, timeLeft: number) => {
    return useMemo(() => {
        // Calculate elapsed seconds
        const elapsedSeconds = COUNTDOWN_SECONDS - timeLeft;
        // Count letters (ignoring spaces)
        const lettersCount = totalWords.replace(/\s/g, "").length;
        // Count words (trim and split on whitespace)
        const wordsArray = totalWords.trim().split(/\s+/).filter(Boolean);
        const wordsCount = wordsArray.length;
        // Calculate WPM: standard formula using 5 characters per word
        const wpm =
            elapsedSeconds > 0
                ? Math.round((lettersCount / 5) / (elapsedSeconds / 60))
                : 0;
        return { lettersCount, wordsCount, wpm };
    }, [totalWords, timeLeft]);
};

export default useLiveStats;
