import { useState, useEffect, useCallback } from "react";
import quotesy from "quotesy";

const useWords = () => {
    const [words, setWords] = useState<string>("");

    useEffect(() => {
        setWords(quotesy.random().text.toLowerCase());
    }, []);

    const updateWords = useCallback(() => {
        setWords(quotesy.random().text.toLowerCase());
    }, []);

    return { words, updateWords };
};

export default useWords;
