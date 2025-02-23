"use client"
import Link from "next/link";
import { Info, Keyboard, LeaderBoard, Mute, Settings, Speaker, User } from "./Icons";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { changeSound } from "@/store/soundSlice"
import TooltipIcon from "./TooltipIcon";
import useIsMobile from "@/hooks/useIsMobile";
import Image from "next/image";
import { useEffect } from "react";
import { fetchUser } from "@/store/authSlice";
import { Howler } from 'howler';

const Header = () => {
    const { sound } = useAppSelector(state => state.sound)
    const { user, initialized } = useAppSelector(state => state.auth)
    const isMobile = useIsMobile();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!initialized) {
            dispatch(fetchUser());
        }
    }, [initialized, dispatch]);

    const handleToggleSound = () => {
        dispatch(changeSound());
        if (!sound) Howler.unload();
    };

    return (
        <div className="z-10 relative w-full flex justify-between md:text-3xl text-lg text-slate-500 ">
            <div className="flex md:space-x-5 space-x-3">
                <div>
                    <Link href="/">
                        <div className="text-white font-bold cursor-pointer ">
                            velociType
                        </div>
                    </Link>
                </div>
                <AnimatePresence>
                    <motion.div
                        key="header"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="flex md:space-x-5 space-x-3">
                        <Link href="/">
                            <div className="hover:text-slate-200 cursor-pointer pt-2 md:text-2xl text-md">
                                <TooltipIcon icon={<Keyboard />} tooltipText="home" />
                            </div>
                        </Link>
                        <Link href="/velocity/information">
                            <div className="hover:text-slate-200 cursor-pointer pt-2 md:text-xl text-sm">
                                <TooltipIcon icon={<Info />} tooltipText="information" />
                            </div>
                        </Link>
                        <Link href="/velocity/leaderboard">
                            <div className="hover:text-slate-200 cursor-pointer pt-2 md:text-2xl text-md">
                                <TooltipIcon icon={<LeaderBoard />} tooltipText="leaderboard" />
                            </div>
                        </Link>
                        <Link href="/velocity/settings">
                            <div className="hover:text-slate-200 cursor-pointer pt-2 md:text-2xl text-md">
                                <TooltipIcon icon={<Settings />} tooltipText="settings" />
                            </div>
                        </Link>
                        {isMobile && <div className="flex space-x-3">
                            <Link href={`/velocity/user/${user && user.username}`}>
                                <div className="hover:text-slate-200 cursor-pointer pt-2 md:text-2xl text-sm">
                                    <TooltipIcon icon={<User />} tooltipText="profile" />
                                </div>
                            </Link>
                            <div
                                className={`hover:text-slate-200 cursor-pointer pt-2 md:text-2xl text-md ${sound ? "text-yellow-200" : "text-slate-500"}`}
                                onClick={handleToggleSound}
                            >
                                {sound ?
                                    <TooltipIcon icon={<Speaker />} tooltipText="sound On" />
                                    : <TooltipIcon icon={<Mute />} tooltipText="sound off" />}
                            </div>
                        </div>
                        }
                    </motion.div>
                </AnimatePresence>
            </div >
            {
                !isMobile &&
                <AnimatePresence>
                    <motion.div
                        key="header"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="flex space-x-5 px-2 md:pl-0">
                        <div
                            className={`hover:text-slate-200 cursor-pointer pt-2 md:text-2xl text-md ${sound ? "text-yellow-200" : "text-slate-500"}`}
                            onClick={() => { dispatch(changeSound()) }}
                        >
                            {sound ?
                                <TooltipIcon icon={<Speaker />} tooltipText="sound On" />
                                : <TooltipIcon icon={<Mute />} tooltipText="sound off" />}
                        </div>
                        <Link href={`/velocity/user/${user ? user.username : ""}`}>
                            {user?.imageUrl
                                ? <div className="pt-1">
                                    <Image className="rounded-full h-7 w-7  cursor-pointer" src={user.imageUrl} alt="user" height={100} width={100} />
                                </div>
                                : <div className="hover:text-slate-200 cursor-pointer pt-2 md:text-2xl text-sm">
                                    <TooltipIcon icon={<User />} tooltipText="profile" />
                                </div>
                            }
                        </Link>
                    </motion.div>
                </AnimatePresence>
            }
        </div >
    )
}

export default Header