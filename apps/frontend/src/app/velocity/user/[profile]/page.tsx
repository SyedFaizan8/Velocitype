"use client"
import Image from "next/image"
import users from "./users.json"
import { Instagram, Link, Report, Site, UserLeaderboard, X } from "@/components/Icons";
import TooltipIcon from "@/components/TooltipIcon";
import { Chart } from "@/components/Chart";
import { HyperText } from "@/components/ui/hyper-text";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { useRouter } from "next/navigation";
import { fetchUser } from "@/store/authSlice";

export default async function Page({ params }: {
    params: Promise<{ profile: string }>
}) {

    const { user } = useAppSelector(state => state.auth)
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
        if (!user) dispatch(fetchUser())
    }, [dispatch, user])

    useEffect(() => {
        if (!user) router.push("/velocity/login")
    }, [user, router])

    const user_mc = users[0];
    const {
        all_time_ranking,
        bio,
        date_joined,
        dp,
        name,
        personal_highest_wpm,
        social_links,
        test_completed,
        time_typing,
        total_characters_typed,
        total_words_typed,
        unique_name
    } = user_mc;
    const slug = (await params).profile
    console.log(slug + "thhis is slug")

    if (!user) return null

    return (
        <div className="w-full h-full space-y-2 py-2 flex flex-col  justify-center">
            <h1 className="text-2xl">Public View</h1>
            <div className="w-full space-y-2">
                <div className="grid grid-cols-10 w-full bg-slate-900 rounded-t-xl">
                    <div className=" flex flex-col justify-center col-span-3 border border-r-slate-800 border-r-8 p-2 space-y-2">
                        <div className="flex space-x-2 pl-5">
                            <div className="text-7xl">
                                {/* <Image href={null} alt="dp" /> */}
                                <UserLeaderboard />
                            </div>
                            <div className="">
                                <p className="text-xl">{slug ? slug : "hello"}</p>
                                <p className="text-md">{unique_name}</p>
                                <p className="text-sm">joined {date_joined}</p>
                            </div>
                        </div>
                        <div className="pl-5">
                            <p className="text-sm">{bio}</p>
                        </div>
                        <div className="pl-5">
                            <div className="flex space-x-2" >
                                <span className="cursor-pointer"><TooltipIcon icon={<X />} tooltipText="Twitter/X" /></span>
                                <span className="cursor-pointer"><TooltipIcon icon={<Instagram />} tooltipText="Instagram" /></span>
                                <span className="cursor-pointer"><TooltipIcon icon={<Site />} tooltipText="Webite" /></span>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-3 text-start  border border-r-slate-800 border-r-8 px-4 py-2 space-y-2 ">
                        <div>
                            <h1 className="text-xs">Test Completed</h1>
                            <div className="text-yellow-500 text-lg">
                                <HyperText animateOnHover={false}>{test_completed.toString()}</HyperText>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xs">Time Typing</h1>
                            <div className="text-yellow-500 text-lg">
                                <HyperText animateOnHover={false}>{time_typing.toString()}</HyperText>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xs">Total Characters Typed</h1>
                            <div className="text-yellow-500 text-lg">
                                <HyperText animateOnHover={false}>{total_characters_typed.toString()}</HyperText>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xs">Total Words Typed</h1>
                            <div className="text-yellow-500 text-lg">
                                <HyperText animateOnHover={false}>{total_words_typed.toString()}</HyperText>
                            </div>
                        </div>
                    </div>

                    <div className="flex col-span-3 border  border-r-slate-800 border-r-8 text-center items-center justify-center   p-2 space-x-3">
                        <div>
                            <h1 className="text-lg">All-Time-Leaderboard</h1>
                            <div className="flex justify-center items-center">
                                <div className="text-yellow-500 text-5xl">
                                    <HyperText animateOnHover={false}>{all_time_ranking.rank.toString()}</HyperText>
                                </div>
                            </div>
                            <div className="flex space-x-4 text-sm">
                                <div>
                                    <p>WPM</p>
                                    <div className="text-yellow-500 ">
                                        <HyperText animateOnHover={false}>{all_time_ranking.wpm.toString()}</HyperText>
                                    </div>
                                </div>
                                <div>
                                    <p>Accuracy</p>
                                    <div className="text-yellow-500 ">
                                        <HyperText animateOnHover={false}>{all_time_ranking.accuracy.toString()}</HyperText>
                                    </div>
                                </div>
                                <div>
                                    <p>Date</p>
                                    <div className="text-yellow-500 ">
                                        <HyperText animateOnHover={false}>{new Date(all_time_ranking.date).toLocaleDateString()}</HyperText>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=" col-span-1 flex flex-col text-center items-center justify-evenly p-2  text-xl space-y-3">
                        <span className="cursor-pointer">
                            <TooltipIcon icon={<Link />} tooltipText="Share Profile" />
                        </span>
                        <span className="cursor-pointer">
                            <TooltipIcon icon={<Report />} tooltipText="Report User" />
                        </span>
                    </div>
                </div>
                <div className="w-full">
                    <Chart />
                </div>
            </div >
        </div >
    )
}