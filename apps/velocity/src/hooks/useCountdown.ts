import { useState, useRef, useEffect, useCallback } from "react";

const useCountdown = (initialSeconds: number) => {
    const [timeLeft, setTimeLeft] = useState(initialSeconds);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setTimeLeft(initialSeconds);
    }, [initialSeconds]);

    const startCountdown = useCallback(() => {
        if (intervalRef.current) return;
        intervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current!);
                    intervalRef.current = null;
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    const resetCountdown = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setTimeLeft(initialSeconds);
    }, [initialSeconds]);

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return { timeLeft, startCountdown, resetCountdown };
};

export default useCountdown;
