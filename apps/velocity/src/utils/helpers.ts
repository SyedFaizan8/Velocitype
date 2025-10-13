export const isKeyboardCodeAllowed = (code: string) => {
    const allowedCodes = ["Backspace", "Space", "Minus", "Comma", "Period", "Quote", "Semicolon", "Colon", "Quote", "Slash", "Digit1", "Digit2"];
    return code.startsWith("Key") || code.startsWith("Digit") || allowedCodes.includes(code);
};

export const countErrors = (actual: string, expected: string) => {
    const expectedCharacters = expected.split("");

    return expectedCharacters.reduce((errors, expectedChar, i) => {
        const actualChar = actual[i];
        if (actualChar !== expectedChar) errors++;
        return errors;
    }, 0);
};

export const calculateAccuracyPercentage = (errors: number, total: number): number => {
    if (total > 0) {
        const corrects = total - errors;
        return Math.max(0, (corrects / total) * 100);
    }
    return 0;
};

export const calculateWPM = (totalTyped: number, errors: number, timer: number): number => {
    return Math.max(0, Math.floor(((totalTyped - errors) / 5) * (timer === 15 ? 4 : timer === 30 ? 2 : timer === 45 ? 1.333 : 1)));
}

export const formatPercentage = (percentage: number) => {
    if (percentage === 0) return 0;
    return percentage.toFixed(0) + "%";

};

export const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const result = [];

    if (hours > 0) result.push(`${hours}h`);
    if (minutes > 0) result.push(`${minutes}m`);
    if (secs > 0 || result.length === 0) result.push(`${secs}s`);

    return result.join(" ");
}

export const liveWPM = (totalTyped: number, seconds: number, timer: number): number => {
    const elapsedTime = timer - seconds;
    if (elapsedTime <= 0) return 0;
    const wpm = Math.round((totalTyped / 5) * (60 / elapsedTime))
    return wpm <= 0 ? 0 : wpm;
}