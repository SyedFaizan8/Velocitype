import React, { useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserLeaderboard, Link as InternalLink, Site } from '@/components/Icons';
import TooltipIcon from '@/components/TooltipIcon';
import { Chart } from '@/components/Chart';
import { HyperText } from '@/components/ui/hyper-text';
import { toast } from '@/hooks/use-toast';
import { formatTime } from '@/utils/helpers';
import type { UserData } from '@/utils/types/profileTypes';

interface UserProfileProps {
    userData: UserData;
}

const UserProfile: React.FC<UserProfileProps> = ({ userData }) => {

    const {
        stats,
        leaderboard,
        imageUrl,
        username,
        created_at,
        bio,
        website,
        fullname,
    } = userData.user;

    const totalTestsTaken = stats.total_tests_taken.toString();
    const totalTimeTyping = formatTime((stats.total_tests_taken || 0) * 15);
    const totalLettersTyped = stats.total_letters_typed.toString();
    const totalWordsTyped = stats.total_words_typed.toString();
    const highestAccuracy = leaderboard?.highest_accuracy?.toString() ?? '';
    const totalTest = stats.total_tests_taken > 100 ? 100 : stats.total_tests_taken;

    const handleCopy = useCallback(async () => {
        let link = window.location.href;
        if (link.includes('/user/')) link = link.replace('/user/', '/profile/');
        await navigator.clipboard.writeText(link);
        toast({
            title: 'Profile link copied to clipboard',
        });
    }, []);

    return (
        <div className="w-full h-full space-y-2 py-2 flex flex-col justify-center">
            <div className="w-full space-y-2 h-full flex flex-col justify-center">
                <div className="grid grid-cols-10 w-full bg-slate-900 rounded-t-xl">
                    {/* Profile Header */}
                    <div className="flex flex-col justify-center col-span-4 border border-r-slate-800 border-r-8 px-2 space-y-2 py-5">
                        <div className="flex space-x-5 pl-5">
                            <div className="text-7xl">
                                {imageUrl ? (
                                    <Image
                                        className="rounded-full h-30 w-30"
                                        src={imageUrl}
                                        alt="Profile picture"
                                        width={100}
                                        height={100}
                                    />
                                ) : (
                                    <UserLeaderboard />
                                )}
                            </div>
                            <div className="flex flex-col justify-center">
                                <p className="text-xl text-yellow-500">{fullname}</p>
                                <span className="text-sm text-slate-500 flex space-x-1">
                                    <span>id:</span>
                                    <HyperText className="text-white" animateOnHover={false}>
                                        {username}
                                    </HyperText>
                                </span>
                                <span className="text-xs text-slate-500 flex space-x-1">
                                    <span>joined:</span>
                                    <HyperText className="text-white" animateOnHover={false}>
                                        {new Date(created_at).toDateString()}
                                    </HyperText>
                                </span>
                            </div>
                        </div>
                        <div className="pl-5">
                            <p className="text-sm text-slate-500">
                                {bio ? 'bio :' : null}{' '}
                                <span className="text-white">{bio}</span>
                            </p>
                        </div>
                        <div className="pl-5 flex justify-start items-center">
                            <div className="space-x-2">
                                {website && (
                                    <Link href={website} target="_blank" rel="noopener noreferrer">
                                        <TooltipIcon icon={<Site />} tooltipText="Website" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-span-3 text-slate-500 text-start border border-r-slate-800 border-r-8 pl-6 pr-4 py-2 space-y-2 flex flex-col justify-center">
                        <div className="flex items-center space-x-4 text-lg">
                            <h1>Test Completed</h1>
                            <div className="text-yellow-500">
                                <HyperText animateOnHover={false}>
                                    {totalTestsTaken}
                                </HyperText>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 text-lg">
                            <h1>Time Typing</h1>
                            <div className="text-yellow-500">
                                <HyperText animateOnHover={false}>
                                    {totalTimeTyping}
                                </HyperText>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 text-lg">
                            <h1>Characters Typed</h1>
                            <div className="text-yellow-500">
                                <HyperText animateOnHover={false}>
                                    {totalLettersTyped}
                                </HyperText>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 text-lg">
                            <h1>Words Typed</h1>
                            <div className="text-yellow-500">
                                <HyperText animateOnHover={false}>
                                    {totalWordsTyped}
                                </HyperText>
                            </div>
                        </div>
                    </div>

                    <div className="relative flex col-span-3 border text-center items-center justify-center p-8 space-x-3">
                        <span onClick={handleCopy} className="cursor-pointer absolute right-0 top-0 p-3">
                            <TooltipIcon icon={<InternalLink />} tooltipText="Copy Profile Link" />
                        </span>
                        <div>
                            <h1 className="text-lg">All-Time-Leaderboard</h1>
                            <div className="flex justify-center items-center">
                                <div className="text-yellow-500 text-5xl">
                                    <HyperText animateOnHover={false}>
                                        {userData.userRank ? userData.userRank.toString() : 'New User'}
                                    </HyperText>
                                </div>
                            </div>
                            {leaderboard && (
                                <div className="flex space-x-4 text-sm">
                                    <div>
                                        <p className='text-slate-400'>WPM</p>
                                        <div className="text-yellow-500">
                                            <HyperText animateOnHover={false}>
                                                {leaderboard.highest_wpm ? leaderboard.highest_wpm.toString() : ''}
                                            </HyperText>
                                        </div>
                                    </div>
                                    <div>
                                        <p className='text-slate-400'>Accuracy</p>
                                        <div className="text-yellow-500">
                                            <HyperText animateOnHover={false}>
                                                {highestAccuracy + '%'}
                                            </HyperText>
                                        </div>
                                    </div>
                                    <div>
                                        <p className='text-slate-400'>Date</p>
                                        <div className="text-yellow-500">
                                            <HyperText animateOnHover={false}>
                                                {leaderboard.achieved_at ? new Date(leaderboard.achieved_at).toLocaleDateString() : ''}
                                            </HyperText>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="w-full">
                    <Chart userData={userData.user.history} totalTest={totalTest} />
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
