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
        return (corrects / total) * 100;
    }
    return 0;
};

export const formatPercentage = (percentage: number) => {
    if (percentage === 0) return 0;
    return percentage.toFixed(0) + "%";

};

export const wordsPerMinute = (totalWords: string): number => {
    return totalWords.split(" ").length * 4;
}