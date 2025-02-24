"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Crown, UserLeaderboard } from "@/components/Icons";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { LeaderboardType } from "@/utils/types/leaderboardTypes";
import { USERS_PER_PAGE } from "@/utils/constants"
import { useRouter } from "next/navigation";


const Page = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [data, setData] = useState<LeaderboardType[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const observer = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

    const fetchLeaderboard = async (page: number) => {
        try {
            const response = await axios.get("/api/leaderboard", { params: { page } });
            const newData: LeaderboardType[] = response.data.data;

            if (newData.length < USERS_PER_PAGE) setHasMore(false)

            setData((prev) => [...prev, ...newData]);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 404) setHasMore(false);
                else toast({
                    variant: "destructive",
                    title: error.response?.data.message || "Error fetching leaderboard data"
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

    const onSubmit = (username: string) => {
        router.push(`/velocity/profile/${username}`)
    }

    return (
        <div className="w-full text-center max-h-full md:px-20 h-5/6">
            <h1 className="text-xl md:text-4xl text-slate-500 mb-2 ">
                All-Time Leaderboard
                <div className="text-base">updates in every 5 minutes</div>
            </h1>
            <div>
                <div className="w-full p-2 md:p-4">
                    <div className="flex text-left text-sm md:text-xl text-slate-500 font-semibold border-b pb-1">
                        <div className="flex items-center justify-center p-1 w-2/12 md:w-1/12">#</div>
                        <div className="flex items-center p-1 w-8/12 md:w-4/12">name</div>
                        <div className="flex items-center w-2/12">wpm</div>
                        <div className="hidden md:flex items-center w-2/12">accuracy</div>
                        <div className="hidden md:flex items-center w-3/12">date</div>
                    </div>
                    <div className="overflow-auto md:h-[330px] scroll-smooth scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-transparent">
                        {data.map(({ user, highest_wpm, highest_accuracy, achieved_at }, index) => (
                            <div
                                onClick={() => onSubmit(user.username)}
                                key={index}
                                className={`md:py-2 flex text-left text-slate-100 ${(index + 1) % 2 !== 0 ? "bg-slate-500" : ""
                                    } rounded-l-md`}
                            >
                                <div className="p-1 flex cursor-pointer justify-center items-center w-2/12 md:w-1/12">
                                    {index === 0 ? (
                                        <div className="flex items-center justify-center text-xl">
                                            <Crown />
                                        </div>
                                    ) : (
                                        <span>{index + 1}</span>
                                    )}
                                </div>
                                <div className="p-1 cursor-pointer space-x-2 w-8/12 md:w-4/12 flex items-center">
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
                                    <span>{user.username}</span>
                                </div>
                                <div className="p-1 w-2/12 cursor-pointer flex items-center">{highest_wpm}</div>
                                <div className="hidden md:flex p-1 w-2/12 items-center cursor-pointer">
                                    {highest_accuracy}%
                                </div>
                                <div className="hidden md:flex p-1 w-3/12 items-center cursor-pointer">
                                    {new Date(achieved_at).toLocaleString()}
                                </div>
                            </div>
                        ))}
                        <div ref={loadMoreRef}>
                            {hasMore ? <Skeleton className="w-full h-10" /> : null}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Page;
