"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Crown, Left, Right, UserLeaderboard } from "@/components/Icons";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { LeaderboardType } from "@/utils/types/leaderboardTypes";
import { USERS_PER_PAGE } from "@/utils/constants"
import { useRouter } from "next/navigation";
import LeaderboardImage from "@/components/LeaderboardImage";
import TooltipIcon from "@/components/TooltipIcon";


const Page = () => {
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [data, setData] = useState<LeaderboardType[]>([]);
    const router = useRouter();

    const fetchLeaderboard = useCallback(async () => {
        try {
            const response = await axios.get("/api/leaderboard");
            setData(response.data.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast({
                    variant: "destructive",
                    title: error.response?.data.message || "Error fetching leaderboard data"
                });
            }
        }
    }, []);

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);

    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => {
            if (b.highest_wpm === a.highest_wpm) {
                if (b.highest_accuracy === a.highest_accuracy) {
                    return new Date(b.achieved_at).getTime() - new Date(a.achieved_at).getTime();
                }
                return b.highest_accuracy - a.highest_accuracy;
            }
            return b.highest_wpm - a.highest_wpm;
        });
    }, [data]);

    const noOfPages = useMemo(() => Math.ceil(sortedData.length / USERS_PER_PAGE), [sortedData]);

    const currentData = useMemo(() => {
        const start = currentPage * USERS_PER_PAGE;
        return sortedData.slice(start, start + USERS_PER_PAGE);
    }, [sortedData, currentPage]);

    const onSubmit = useCallback((username: string) => {
        router.push(`/velocity/profile/${username}`);
    }, [router]);

    return (
        <div className="w-full text-center max-h-full md:px-20 h-5/6">
            <h1 className="text-4xl text-slate-500 mb-2">
                All-Time Leaderboard
                <div className="text-base">Updated every minute</div>
            </h1>
            <div>
                <div className="w-full p-2 md:p-4">
                    <div className="flex text-left text-sm md:text-xl text-slate-500 font-semibold border-b pb-1">
                        <div className="flex items-center justify-center p-1 w-2/12 md:w-1/12">#</div>
                        <div className="flex items-center p-1 w-8/12 md:w-4/12">name</div>
                        <div className="flex items-center w-1/12">wpm</div>
                        <div className="hidden md:flex items-center w-2/12">accuracy</div>
                        <div className="hidden md:flex items-center w-3/12">date</div>
                        <div className="hidden md:flex items-center w-1/12">time</div>
                    </div>
                    <div className="overflow-auto md:h-[330px] scroll-smooth scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-transparent">
                        {sortedData.length ? (
                            currentData.map(({ user, highest_wpm, highest_accuracy, achieved_at, time }, index) => (
                                <div
                                    onClick={() => onSubmit(user.username)}
                                    key={`${user.username}-${index}`}
                                    className={`md:py-2 flex text-left text-slate-100 ${(currentPage * USERS_PER_PAGE + index) % 2 !== 0 ? "bg-slate-500" : ""} rounded-md`}
                                >
                                    <div className="p-1 flex cursor-pointer justify-center items-center w-2/12 md:w-1/12">
                                        {currentPage === 0 && index === 0 ? (
                                            <div className="flex items-center justify-center text-xl">
                                                <TooltipIcon icon={<Crown />} tooltipText="click to open profile" />
                                            </div>
                                        ) : (
                                            <span>
                                                <TooltipIcon icon={`${currentPage * USERS_PER_PAGE + index + 1}`} tooltipText="click to open profile" />
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-1 cursor-pointer space-x-2 w-8/12 md:w-4/12 flex items-center">
                                        {user.imageId ? (
                                            <LeaderboardImage imageId={user.imageId} username={user.username} />
                                        ) : (
                                            <div className="rounded-full text-2xl">
                                                <TooltipIcon icon={<UserLeaderboard />} tooltipText="click to open profile" />
                                            </div>
                                        )}
                                        <span>
                                            <TooltipIcon icon={user.username} tooltipText="click to open profile" />
                                        </span>
                                    </div>
                                    <div className="p-1 w-1/12 cursor-pointer flex items-center">
                                        <TooltipIcon icon={`${highest_wpm}`} tooltipText="click to open profile" />
                                    </div>
                                    <div className="hidden md:flex p-1 w-2/12 items-center cursor-pointer">
                                        <TooltipIcon icon={`${highest_accuracy}%`} tooltipText="click to open profile" />
                                    </div>
                                    <div className="hidden md:flex p-1 w-3/12 items-center cursor-pointer">
                                        <TooltipIcon icon={new Date(achieved_at).toLocaleString()} tooltipText="click to open profile" />
                                    </div>
                                    <div className="hidden md:flex p-1 w-1/12 items-center cursor-pointer">
                                        <TooltipIcon icon={`${time}s`} tooltipText="click to open profile" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div>
                                <Skeleton className="w-full h-10" />
                            </div>
                        )}
                    </div>
                    <div className="w-full mt-2 flex justify-center items-center space-x-2 text-xl">
                        <button
                            className={`${currentPage === 0 ? "text-slate-950" : "hover:bg-slate-500"} text-3xl rounded`}
                            onClick={() => currentPage > 0 && setCurrentPage(prev => prev - 1)}
                            disabled={currentPage === 0}
                        >
                            <Left />
                        </button>
                        {[...Array(noOfPages).keys()].map((p) => (
                            <button
                                key={p}
                                onClick={() => setCurrentPage(p)}
                                className={`${currentPage === p ? "bg-slate-500" : ""} hover:bg-slate-500 border border-slate-500 rounded px-2`}
                                disabled={currentPage === p}
                            >
                                {p + 1}
                            </button>
                        ))}
                        <button
                            className={`${currentPage + 1 === noOfPages ? "text-slate-950" : "hover:bg-slate-500"} text-3xl rounded`}
                            onClick={() => currentPage + 1 < noOfPages && setCurrentPage(prev => prev + 1)}
                            disabled={currentPage + 1 === noOfPages}
                        >
                            <Right />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;


