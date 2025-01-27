import { useState, useEffect } from 'react';

function useIsMobile(breakpoint: number = 770): boolean {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        handleResize(); // Check the initial window size
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);

    }, [breakpoint]);

    return isMobile;
}

export default useIsMobile;


