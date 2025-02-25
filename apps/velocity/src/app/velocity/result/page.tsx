"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { resetStats } from "@/store/typingSlice";
import { formatPercentage } from "@/utils/helpers";
import { useCallback, useEffect, useRef, useState } from "react";
import { Refresh } from "@/components/Icons";
import useIsMobile from "@/hooks/useIsMobile";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { HyperText } from "@/components/ui/hyper-text";
import { fetchUser } from "@/store/authSlice";
import axios from "axios";
import confetti from "canvas-confetti";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator"
import { encryptFrontend } from "@/utils/encryptFrontend";

const Page = () => {
    const { wpm, accuracy, raw, totalLetters, totalWords, errors } = useAppSelector((state) => state.typing);
    const { user, loading, initialized } = useAppSelector(state => state.auth)
    const dispatch = useAppDispatch();
    const router = useRouter();
    const isMobile = useIsMobile();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [newHighscore, setnewHighscore] = useState<boolean>(false)

    const sendData = useCallback(async () => {
        try {

            if (wpm !== 0) {

                const payload = {
                    wpm,
                    accuracy,
                    totalChars: totalLetters,
                    totalWords,
                };

                const { error, iv, ciphertext, signature } = await encryptFrontend(payload);
                if (error) {
                    toast({
                        title: "Something went wrong while encrypting"
                    })
                }

                const response = await axios.post(
                    "/api/result",
                    {
                        data: ciphertext,
                        iv
                    },
                    {
                        headers: {
                            "x-signature": signature,
                        },
                        withCredentials: true
                    }
                );
                const { newHighscore } = response.data.data
                setnewHighscore(newHighscore)
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast({
                    variant: "destructive",
                    title: error.response?.data.message
                })
            } else {
                toast({
                    variant: "destructive",
                    title: "something went wrong while registering data"
                })
            }
        }
    }, [accuracy, totalLetters, totalWords, wpm])

    useEffect(() => {
        const handleSendData = async () => {
            if (user?.username) await sendData()
            else if (!initialized) {
                const result = await dispatch(fetchUser());
                if (result.payload?.username) await sendData()
            }
        };
        if (!loading) handleSendData()
    }, [user, initialized, loading, dispatch, sendData]);

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Tab" || event.key === "Enter") {
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
    });

    useEffect(() => {
        if (totalLetters === 0) router.push("/")
    }, [totalLetters, router, accuracy])

    const handleClick = () => {
        const end = Date.now() + 3 * 1000;
        const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

        const frame = () => {
            if (Date.now() > end) return;
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                startVelocity: 60,
                origin: { x: 0, y: 0.5 },
                colors,
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                startVelocity: 60,
                origin: { x: 1, y: 0.5 },
                colors,
            });
            requestAnimationFrame(frame);
        };
        frame();
    };

    useEffect(() => {
        if (newHighscore) handleClick()
    }, [newHighscore]);

    if (totalLetters === 0) return null
    return (
        <div className=" p-6 flex flex-col items-center justify-center">
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
                <div className="relative w-full max-w-md p-4 border rounded bg-gray-50 text-black z-10">
                    {newHighscore && <div className="absolute top-0 text-yellow-300 text-5xl animate-bounce text-center"> New High Score</div>}
                    <p><strong>WPM:</strong>{wpm}</p>
                    <p><strong>Accuracy:</strong>{formatPercentage(accuracy)}</p>
                    <p><strong>Raw WPM:</strong>{raw}</p>
                    <p><strong>Total Letters Typed:</strong>{totalLetters}</p>
                    <p><strong>Total Words Typed:</strong>{totalWords}</p>
                    <p><strong>Errors:</strong>{errors}</p>
                    <p><strong>ALL in 15 Seconds</strong></p>
                </div>
                : <div className="relative w-full  h-full p-10  space-x-2 rounded-md text-slate-300 z-10 ">
                    {newHighscore && <div className="absolute top-0 text-5xl animate-bounce text-center font-extrabold text-yellow-300 w-full"> New High Score </div>}
                    <div className="flex space-x-5 justify-center items-center">
                        <div className="text-center text-4xl flex flex-col justify-center items-center p-2 border border-r-slate-300 ">
                            <strong>wpm</strong>
                            <HyperText className="text-yellow-500 text-9xl" animateOnHover={false}>{wpm.toString()}</HyperText>
                        </div>
                        <div className="text-3xl flex flex-col justify-center items-start p-3 space-y-1">
                            <div>
                                <strong className="text-neutral-300">accuracy</strong>
                                <HyperText className="text-yellow-500 text-6xl" animateOnHover={false}>{formatPercentage(accuracy).toString()}</HyperText>
                            </div>
                            <Separator className="bg-slate-300" />
                            <div className="flex  space-x-3">
                                <strong className="text-neutral-300 text-4xl">raw</strong>
                                <HyperText className="text-yellow-500 text-4xl" animateOnHover={false}>{raw.toString()}</HyperText>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 text-2xl">
                        {[
                            { label: "letters typed", value: totalLetters },
                            { label: "words typed", value: totalWords },
                            { label: "errors", value: errors }
                        ].map(({ label, value }) => (
                            <div className="text-center flex justify-center items-center text-neutral-300" key={label}>
                                <strong>{label}:</strong>
                                <HyperText className="text-yellow-500 text-3xl" animateOnHover={false}>{value.toString()}</HyperText>
                            </div>
                        ))}
                    </div>
                    <div className="text-center text-neutral-300">
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
                    {!user && <div className="text-yellow-300 text-2xl animate-pulse text-center"> Login to track Progress </div>}
                </div>
            }
            {
                !isMobile &&
                <div className='z-10 w-full hidden md:flex justify-center items-center space-x-2 text-sm text-white '>
                    <span className="bg-slate-500 rounded-sm px-1 text-xs">tab</span>
                    <span className="text-xs">or</span>
                    <span className="bg-slate-500 rounded-sm px-1 text-xs">enter</span>
                    <span>- restart</span>
                </div>
            }
        </div >
    );
};

export default Page;

