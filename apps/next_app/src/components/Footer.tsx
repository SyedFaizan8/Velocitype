import Link from "next/link";
import { Developer, Github, Mail } from "./Icons";

const Footer = () => {
    return (
        <>
            <div className="z-10 w-full md:flex text-slate-500 md:justify-between md:items-center bottom-0  md:relative">
                <Link href="https://www.github.com/syedfaizan8/velocitype.git" target="_blank" rel="noopener noreferrer">
                    <div
                        className="flex space-x-1 hover:text-slate-200 cursor-pointer">
                        <span className="pt-1  text-xs"><Github /></span>
                        <span className="md:text-md text-sm">Github</span>
                    </div>
                </Link>
                <div className="md:space-x-4 md:flex ">
                    <Link href="https://www.syedfaizan.in" target="_blank" rel="noopener noreferrer">
                        <div className="flex md:space-x-1 space-x-1 hover:text-slate-200 cursor-pointer">
                            <span className="pt-1  md:text-sm text-xs"><Developer /></span>
                            <span className="md:text-md text-sm">Developer</span>
                        </div>
                    </Link>
                    <Link href="https://www.syedfaizan.in#contact" target="_blank" rel="noopener noreferrer">
                        <div className="flex md:space-x-1 space-x-1 hover:text-slate-200 cursor-pointer">
                            <span className="pt-1 md:text-md text-sm"><Mail /></span>
                            <span className="md:text-md text-sm">Contact</span>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Footer