import Link from "next/link";
import { Info, Keyboard, LeaderBoard, Mute, Speaker, User } from "./Icons";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch } from "@/store/reduxHooks";
import { changeSound } from "@/store/soundSlice"
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import TooltipIcon from "./TooltipIcon";
import { CoolMode } from "./ui/cool-mode";
import useIsMobile from "@/hooks/useIsMobile";

const Header = () => {
    const sound = useSelector((state: RootState) => state.sound.sound);
    const isMobile = useIsMobile();
    const dispatch = useAppDispatch();

    return (
        <div className="z-10 relative w-full flex justify-between md:text-3xl text-lg text-slate-500 ">
            <div className="flex space-x-5">
                <div>
                    <CoolMode>
                        <Link href="/">
                            <div className="text-white font-bold cursor-pointer ">VelociType</div>
                        </Link>
                    </CoolMode>
                </div>
                <AnimatePresence>
                    <motion.div
                        key="header"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="flex space-x-5">
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
                        {isMobile && <div className="flex space-x-5">
                            <div className="hover:text-slate-200 cursor-pointer pt-2 md:text-2xl text-sm">
                                <TooltipIcon icon={<User />} tooltipText="profile" />
                            </div>
                            <div
                                className={`hover:text-slate-200 cursor-pointer pt-2 md:text-2xl text-md ${sound ? "text-yellow-200" : "text-slate-500"}`}
                                onClick={() => { dispatch(changeSound()) }}
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
            {!isMobile &&
                <AnimatePresence>
                    <motion.div
                        key="header"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="flex space-x-5 px-2 md:pl-0">
                        <div className="hover:text-slate-200 cursor-pointer pt-2 md:text-2xl text-sm">
                            <TooltipIcon icon={<User />} tooltipText="profile" />
                        </div>
                        <div
                            className={`hover:text-slate-200 cursor-pointer pt-2 md:text-2xl text-md ${sound ? "text-yellow-200" : "text-slate-500"}`}
                            onClick={() => { dispatch(changeSound()) }}
                        >
                            {sound ?
                                <TooltipIcon icon={<Speaker />} tooltipText="sound On" />
                                : <TooltipIcon icon={<Mute />} tooltipText="sound off" />}
                        </div>
                    </motion.div>
                </AnimatePresence>
            }
        </div >
    )
}

export default Header