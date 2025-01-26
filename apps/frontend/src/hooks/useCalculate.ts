import { useState, useEffect } from 'react';
import useEngine from './useEngine';

const useCalculate = (typed: string) => {
    const { timeLeft } = useEngine();
    const [wpm, setWpm] = useState<number>(0);
    const [cpm, setCpm] = useState<number>(0);

    useEffect(() => {
        const totalWords = typed.split(" ");
        const totalLetters = typed.split("");
        if (!(totalWords.length === 1 && timeLeft === 15)) setWpm(totalWords.length * 4);
        else setWpm(0)
        setCpm(totalLetters.length * 4)
    }, [timeLeft]);

    return { wpm, cpm, setWpm, setCpm };
};

export default useCalculate;