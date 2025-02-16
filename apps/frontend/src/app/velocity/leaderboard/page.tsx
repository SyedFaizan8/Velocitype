"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Crown, UserLeaderboard } from "@/components/Icons";
import Link from "next/link";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import TooltipIcon from "@/components/TooltipIcon";

interface UserNameType {
    username: string;
    imageUrl: URL | string | null;
}

interface LeaderboardType {
    user: UserNameType;
    highest_wpm: number;
    highest_accuracy: number;
    achieved_at: Date | string;
}

const USERS_PER_PAGE = 50;

const Page = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [data, setData] = useState<LeaderboardType[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const observer = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const fetchLeaderboard = async (page: number) => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/leaderboard`,
                { params: { page } }
            );
            const newData: LeaderboardType[] = response.data.data;

            if (newData.length < USERS_PER_PAGE) setHasMore(false)

            setData((prev) => [...prev, ...newData]);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 404) setHasMore(false);
                else toast({
                    variant: "destructive",
                    title: "Error fetching leaderboard data"
                })
            }
        }
    };

    useEffect(() => {
        if (hasMore) {
            fetchLeaderboard(currentPage);
        }
    }, [currentPage, hasMore]);

    useEffect(() => {
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) setCurrentPage((prev) => prev + 1)
        });

        if (loadMoreRef.current) observer.current.observe(loadMoreRef.current);

        return () => observer.current?.disconnect();
    }, [hasMore]);

    return (
        <div className="w-full text-center max-h-full md:px-20 h-5/6">
            <h1 className="text-xl md:text-4xl text-slate-500 mb-2 ">
                All-Time Leaderboard
            </h1>
            <div>
                <div className="w-full p-2 md:p-4">
                    <div className="flex text-left text-sm md:text-xl text-slate-500 font-semibold border-b pb-1">
                        <div className="flex items-center justify-center p-1 w-2/12 md:w-1/12">#</div>
                        <div className="flex items-center p-1 w-8/12 md:w-4/12">Name</div>
                        <div className="flex items-center w-2/12">WPM</div>
                        <div className="hidden md:flex items-center w-2/12">Accuracy</div>
                        <div className="hidden md:flex items-center w-3/12">Date</div>
                    </div>
                    <div className="overflow-auto h-80 scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-transparent">
                        {data.map(({ user, highest_wpm, highest_accuracy, achieved_at }, index) => (
                            <div
                                key={index}
                                className={`md:py-2 flex text-left text-slate-100 ${(index + 1) % 2 !== 0 ? "bg-slate-500" : ""
                                    } rounded-md mb-2`}
                            >
                                <div className="p-1 flex justify-center items-center w-2/12 md:w-1/12">
                                    {index === 0 ? (
                                        <div className="flex items-center justify-center text-xl">
                                            <Crown />
                                        </div>
                                    ) : (
                                        <span>{index + 1}</span>
                                    )}
                                </div>
                                <div className="p-1 space-x-2 w-8/12 md:w-4/12 flex items-center">
                                    {user.imageUrl &&
                                        typeof user.imageUrl === "string" &&
                                        user.imageUrl.length > 0 ? (
                                        <Image
                                            width={24}
                                            height={24}
                                            src={user.imageUrl}
                                            alt={user.username}
                                            className="inline rounded-full w-6 h-6"
                                        />
                                    ) : (
                                        <div className="rounded-full text-2xl">
                                            <UserLeaderboard />
                                        </div>
                                    )}
                                    <Link href={`/velocity/user/${user.username}`}>
                                        <span><TooltipIcon icon={user.username} tooltipText={"login to view profile"} /></span>
                                    </Link>
                                </div>
                                <div className="p-1 w-2/12 flex items-center">{highest_wpm}</div>
                                <div className="hidden md:flex p-1 w-2/12 items-center">
                                    {highest_accuracy}%
                                </div>
                                <div className="hidden md:flex p-1 w-3/12 items-center">
                                    {new Date(achieved_at).toLocaleString()}
                                </div>
                            </div>
                        ))}
                        <div ref={loadMoreRef} className="py-2">
                            {hasMore ? <span className="animate-pulse">Loading...</span> : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
