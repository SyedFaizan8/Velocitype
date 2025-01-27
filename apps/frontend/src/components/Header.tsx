import Link from "next/link";
import { Info, Keyboard, LeaderBoard, User } from "./Icons";


const Header = () => {
    return (
        <div className="w-full flex justify-between md:text-3xl text-lg text-neutral-500 ">
            <div className="flex space-x-5">
                <Link href="/">
                    <div className="text-white font-bold cursor-pointer">VelociType</div>
                </Link>
                <Link href="/">
                    <div className="hover:text-neutral-200 cursor-pointer pt-2 md:text-2xl text-md"><Keyboard /></div>
                </Link>
                <div className="hover:text-neutral-200 cursor-pointer pt-2 md:text-xl text-sm"><Info /></div>
                <div className="hover:text-neutral-200 cursor-pointer pt-2 md:text-2xl text-md"><LeaderBoard /></div>
            </div>
            <div className="hover:text-neutral-200 cursor-pointer pt-2 md:text-2xl text-md"><User /></div>
        </div >
    )
}

export default Header