"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import leaderboardData from './leaderboard.json';
import Image from 'next/image';
import { Crown, UserLeaderboard } from '@/components/Icons';
import Link from 'next/link';

const USERS_PER_PAGE = 10;

const Page = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const observer = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const loadMoreUsers = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    useEffect(() => {
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) loadMoreUsers();
        });

        if (loadMoreRef.current) {
            observer.current.observe(loadMoreRef.current);
        }

        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, []);

    const displayedUsers = useMemo(() => {
        return leaderboardData.leaderboard.slice(0, currentPage * USERS_PER_PAGE);
    }, [currentPage]);

    return (
        <div className='w-full text-center max-h-full md:px-20'>
            <h1 className="text-xl md:text-4xl text-slate-300 mb-6">All-Time Leaderboard</h1>
            <div>
                <div className="w-full p-2 md:p-4">
                    <div className="flex text-left text-sm md:text-xl text-slate-300 font-semibold border-b pb-1">
                        <div className="flex items-center justify-center p-1 w-2/12 md:w-1/12">#</div>
                        <div className="flex items-center p-1 w-8/12 md:w-4/12">Name</div>
                        <div className="flex items-center w-2/12">WPM</div>
                        <div className="hidden md:flex items-center w-2/12">Accuracy</div>
                        <div className="hidden md:flex items-center w-3/12">Date</div>
                    </div>
                    <div className='overflow-auto h-80 scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-transparent'>
                        {displayedUsers.map(({ rank, dp, userName, wpm, accuracy, timeDate }) => (
                            <div key={rank} className={`md:py-2 flex text-left text-slate-100 ${rank % 2 !== 0 && "bg-slate-500"} rounded-md mb-2`}>
                                <div className="p-1 flex justify-center items-center w-2/12 md:w-1/12">
                                    {rank === 1 ? <div className='items-center flex justify-center text-xl'><Crown /></div> : <span>{rank}</span>}
                                </div>
                                <div className="p-1 space-x-2 w-8/12 md:w-4/12 flex items-center">
                                    {typeof dp === "string" && dp.length > 0 ? (
                                        <Image
                                            width={24}
                                            height={24}
                                            src={dp}
                                            alt={userName}
                                            className="inline rounded-full w-6 h-6"
                                        />
                                    ) : (
                                        <div className="rounded-full text-2xl">
                                            <UserLeaderboard />
                                        </div>
                                    )}
                                    <Link href={`/velocity/user/${userName}`}>
                                        <span>{userName}</span>
                                    </Link>
                                </div>
                                <div className="p-1 w-2/12 flex items-center">{wpm}</div>
                                <div className="hidden md:flex p-1 w-2/12 items-center">{accuracy}%</div>
                                <div className="hidden md:flex p-1 w-3/12 items-center">{new Date(timeDate).toLocaleString()}</div>
                            </div>
                        ))}
                        <div ref={loadMoreRef} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
