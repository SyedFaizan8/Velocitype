"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Link as InternalLink, Site, UserLeaderboard } from "@/components/Icons";
import TooltipIcon from "@/components/TooltipIcon";
import { Chart } from "@/components/Chart";
import { HyperText } from "@/components/ui/hyper-text";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { fetchUser } from "@/store/authSlice";
import axios from "axios";
import Link from "next/link";
import { formatTime } from "@/utils/helpers";
import { toast } from "@/hooks/use-toast";

interface UserStats {
    total_tests_taken: number;
    total_letters_typed: number;
    total_words_typed: number;
}

export interface HistoryEntry {
    wpm: number;
    date: string;
}

interface HighestRank {
    highest_wpm: number;
    highest_accuracy: number;
    achieved_at: Date | string;
}

interface User {
    imageUrl: string;
    fullname: string;
    username: string;
    created_at: string | Date;
    bio: string;
    website: string;
    stats: UserStats;
    leaderboard: null | HighestRank;
    history: null | HistoryEntry[];
}

interface UserData {
    user: User;
    userRank: null | number;
}

export default function Page() {

    const { profile: slug } = useParams() as { profile: string };

    const { user, loading, initialized } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);

    const bringProfile = useCallback(async () => {
        try {
            const response = await axios.get(
                "/api/profile",
                {
                    params: { username: slug },
                    withCredentials: true
                },
            );
            setUserData(response.data.data);
        } catch {
            toast({
                variant: "destructive",
                title: "something went while fetching profile"
            })
        }
    }, [slug, setUserData])

    useEffect(() => {
        const fetchProfile = async () => {
            if (initialized && !loading && !user) {
                router.push("/velocity/login");
                toast({
                    variant: "destructive",
                    title: "Please login to visit the profile"
                })
            } else if (user) {
                await bringProfile();
            }
        };
        fetchProfile();
    }, [user, loading, initialized, router, slug, bringProfile]);

    useEffect(() => {
        if (!initialized) {
            const findUser = async () => {
                const result = await dispatch(fetchUser());
                if (result.payload) {
                    await bringProfile();
                }
            };
            findUser();
        }
    }, [initialized, dispatch, slug, bringProfile]);

    const handleCopy = async () => {
        const link = window.location.href;
        await navigator.clipboard.writeText(link);
        toast({
            title: "Profile link copied to clipboard"
        })

    };

    if (initialized && !loading && !user) return null

    if (!userData) return <div>Loading...</div>

    const { stats, leaderboard, imageUrl, username, created_at, bio, website, fullname } = userData.user;
    const totalTestsTaken = stats.total_tests_taken.toString();
    const totalTimeTyping = formatTime((stats.total_tests_taken || 0) * 15)
    const totalLettersTyped = stats.total_letters_typed.toString();
    const totalWordsTyped = stats.total_words_typed.toString();
    const highestAccuracy = leaderboard?.highest_accuracy?.toString() ?? "";
    const totalTest = stats.total_tests_taken > 100 ? 100 : stats.total_tests_taken;

    return (
        <div className="w-full h-full space-y-2 py-2 flex flex-col justify-center">
            <div className="w-full space-y-2">
                <div className="grid grid-cols-10 w-full bg-slate-900 rounded-t-xl">
                    <div className="flex flex-col justify-center col-span-4 border border-r-slate-800 border-r-8 p-2 space-y-2">
                        <div className="flex space-x-5 pl-5">
                            <div className="text-7xl">
                                {imageUrl ? (
                                    <Image className="rounded-full h-30 w-30" src={imageUrl} alt="dp" width={100} height={100} />
                                ) : (
                                    <UserLeaderboard />
                                )}
                            </div>
                            <div className="flex flex-col justify-center">
                                <p className="text-xl text-yellow-500">{fullname}</p>
                                <span className="text-sm text-slate-500 flex space-x-1"><span>id:</span><HyperText className="text-white" animateOnHover={false}>{username}</HyperText></span>
                                <span className="text-xs text-slate-500 flex space-x-1"><span>joined:</span>
                                    <HyperText className="text-white" animateOnHover={false}>{new Date(created_at).toDateString()}</HyperText>
                                </span>
                            </div>
                        </div>
                        <div className="pl-5">
                            <p className="text-sm text-slate-500">{bio ? "bio :" : null} <span className="text-white">{bio}</span></p>
                        </div>
                        <div className="pl-5 flex justify-start items-center">
                            <div className=" space-x-2">
                                {website && (
                                    <Link href={website} target="_blank" rel="noopener noreferrer">
                                        <TooltipIcon icon={<Site />} tooltipText="Website" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="col-span-3 text-slate-500 text-start border border-r-slate-800 border-r-8 px-4 py-2 space-y-2">
                        <div>
                            <h1 className="text-xs">Test Completed</h1>
                            <div className="text-yellow-500 text-lg">
                                <HyperText animateOnHover={false}>{totalTestsTaken}</HyperText>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xs">Time Typing</h1>
                            <div className="text-yellow-500 text-lg">
                                <HyperText animateOnHover={false}>{totalTimeTyping}</HyperText>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xs">Total Characters Typed</h1>
                            <div className="text-yellow-500 text-lg">
                                <HyperText animateOnHover={false}>{totalLettersTyped}</HyperText>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xs">Total Words Typed</h1>
                            <div className="text-yellow-500 text-lg">
                                <HyperText animateOnHover={false}>{totalWordsTyped}</HyperText>
                            </div>
                        </div>
                    </div>


                    <div className="relative flex col-span-3 border text-center items-center justify-center p-2 space-x-3">
                        <span onClick={handleCopy} className="cursor-pointer absolute right-0 top-0 p-3">
                            <TooltipIcon icon={<InternalLink />} tooltipText="Copy Profile Link" />
                        </span>
                        <div>
                            <h1 className="text-lg">All-Time-Leaderboard</h1>
                            <div className="flex justify-center items-center">
                                <div className="text-yellow-500 text-5xl">
                                    <HyperText animateOnHover={false}>
                                        {userData.userRank ? userData.userRank.toString() : "New User"}
                                    </HyperText>
                                </div>
                            </div>
                            {leaderboard && <div className="flex space-x-4 text-sm">
                                <div>
                                    <p>WPM</p>
                                    <div className="text-yellow-500">
                                        <HyperText animateOnHover={false}>
                                            {leaderboard?.highest_wpm ? leaderboard.highest_wpm.toString() : ""}
                                        </HyperText>
                                    </div>
                                </div>
                                <div>
                                    <p>Accuracy</p>
                                    <div className="text-yellow-500">
                                        <HyperText animateOnHover={false}>{highestAccuracy + "%"}</HyperText>
                                    </div>
                                </div>
                                <div>
                                    <p>Date</p>
                                    <div className="text-yellow-500">
                                        <HyperText animateOnHover={false}>
                                            {leaderboard?.achieved_at ? new Date(leaderboard.achieved_at).toLocaleDateString() : ""}
                                        </HyperText>
                                    </div>
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <Chart userData={userData.user.history} totalTest={totalTest} />
                </div>
            </div>
        </div>
    );
}
