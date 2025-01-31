"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/reduxHooks";
import { resetStats } from "@/store/typingSlice";
import { formatPercentage } from "@/utils/helpers";
import { useEffect, useRef } from "react";
import { Refresh } from "@/components/Icons";
import useIsMobile from "@/hooks/useIsMobile";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { HyperText } from "@/components/ui/hyper-text";

const page = () => {
    const { wpm, cpm, accuracy, totalLetters, totalWords, errors } = useSelector((state: RootState) => state.typing);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const isMobile = useIsMobile();
    const buttonRef = useRef<HTMLButtonElement>(null);


    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Tab") {
            dispatch(resetStats());
            router.push("/");
        }
    }

    const handleRestart = () => {
        buttonRef.current?.blur();
        dispatch(resetStats());
        router.push("/");
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div className="p-6 flex flex-col items-center">
            {!isMobile &&
                <div className="fixed inset-0 z-0">
                    <FlickeringGrid
                        className="absolute inset-0 z-[-1] [mask-image:radial-gradient(650px_circle_at_center,white,transparent)]"
                        squareSize={5}
                        gridGap={6}
                        color="#60A5FA"
                        maxOpacity={0.5}
                        flickerChance={0.1}
                        height={typeof window !== 'undefined' ? window.innerHeight : 0}
                        width={typeof window !== 'undefined' ? window.innerWidth : 0}
                    />
                </div>
            }
            {isMobile ?
                <div className="w-full max-w-md p-4 border rounded bg-gray-50 text-black z-10">
                    <p><strong>WPM:</strong>{wpm}</p>
                    <p><strong>CPM:</strong>{cpm}</p>
                    <p><strong>Accuracy:</strong>{formatPercentage(accuracy)}</p>
                    <p><strong>Total Letters Typed:</strong>{totalLetters}</p>
                    <p><strong>Total Words Typed:</strong>{totalWords}</p>
                    <p><strong>Errors:</strong>{errors}</p>
                    <p><strong>ALL in 15 Seconds</strong></p>
                </div>
                : <div className="w-full  h-full p-10  space-x-2 rounded-md text-slate-300 z-10">
                    <div className="text-center text-3xl flex justify-center items-center space-x-10 p-3">
                        {[
                            { label: "WPM", value: wpm, size: "text-8xl" },
                            { label: "Accuracy", value: formatPercentage(accuracy), size: "text-5xl" }
                        ].map(({ label, value, size }) => (
                            <div key={label}>
                                <strong>{label}</strong>
                                <HyperText className={`text-yellow-500 ${size}`} animateOnHover={false}>{value.toString()}</HyperText>
                            </div>
                        ))}
                    </div>
                    <div className="p-5 text-2xl">
                        {[
                            { label: "Total Letters Typed", value: totalLetters },
                            { label: "Total Words Typed", value: totalWords },
                            { label: "Errors", value: errors }
                        ].map(({ label, value }) => (
                            <div className="text-center flex justify-center items-center" key={label}>
                                <strong>{label}:</strong>
                                <HyperText className="text-yellow-500 text-2xl" animateOnHover={false}>{value.toString()}</HyperText>
                            </div>
                        ))}
                    </div>
                    <div className="text-center">
                        <strong>In 15 Seconds</strong>
                    </div>
                    <div className="flex justify-center mt-8">
                        <button
                            tabIndex={-1}
                            ref={buttonRef}
                            className="z-10 block rounded px-8 py-2 text-white text-xl"
                            onClick={handleRestart}
                        >
                            <Refresh />
                        </button>
                    </div>
                </div>
            }
            {!isMobile &&
                <div className='z-10 w-full hidden md:flex justify-center items-center space-x-2 text-xs text-white '>
                    <span className="bg-slate-500 rounded-sm px-1 ">tab</span>
                    <span>- Restart</span>
                </div>
            }
        </div >
    );
};

export default page;

