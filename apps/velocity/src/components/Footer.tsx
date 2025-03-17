"use client"

import Link from "next/link";
import { Developer, Github, Mail, Privacy } from "./Icons";
import { AnimatePresence, motion } from "framer-motion";
import { useAppSelector } from "@/store/reduxHooks";
import { useEffect, useState } from "react";
import { State } from "@/hooks/useEngine"
import useIsMobile from "@/hooks/useIsMobile";

const Footer = () => {
    const { position } = useAppSelector(state => state.position);
    const [run, setRun] = useState<State | null>(position);
    const isMobile = useIsMobile();

    useEffect(() => {
        setRun(position);
    }, [run, position])


    return (
        <>
            <AnimatePresence>
                {run !== "run" ? (
                    <motion.div
                        key="footer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        < div className="z-10 w-full md:flex text-slate-500 md:justify-start md:items-center bottom-0  md:relative md:space-x-4">
                            <Link href="https://www.syedfaizan.in" target="_blank" rel="noopener noreferrer">
                                <div className="flex  space-x-1 hover:text-slate-200 cursor-pointer">
                                    <span className="pt-1  md:text-sm text-xs"><Developer /></span>
                                    <span className="md:text-md text-sm">Developer</span>
                                </div>
                            </Link>
                            <Link href="https://www.syedfaizan.in#contact" target="_blank" rel="noopener noreferrer">
                                <div className="flex space-x-1 hover:text-slate-200 cursor-pointer">
                                    <span className="pt-1 md:text-md text-sm"><Mail /></span>
                                    <span className="md:text-md text-sm">Contact</span>
                                </div>
                            </Link>
                            <Link href="https://www.github.com/syedfaizan8/velocitype.git" target="_blank" rel="noopener noreferrer" >
                                <div className="flex  space-x-1 hover:text-slate-200 cursor-pointer">
                                    <span className="pt-1  md:text-xs text-xs"><Github /></span>
                                    <span className="md:text-md text-sm">Github</span>
                                </div>
                            </Link>
                            {!isMobile ? <Link href="/velocity/privacy-policy" >
                                <div className="flex  space-x-1 hover:text-slate-200 cursor-pointer">
                                    <span className="pt-1 md:text-xs text-xs"><Privacy /></span>
                                    <span className="md:text-md text-sm">Privacy-Policy</span>
                                </div>
                            </Link> : null}
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence >
        </>
    )
}

export default Footer