import { Google, Login, Register } from "@/components/Icons"

const page = () => {
    return (
        <div className="grid grid-cols-2 h-full w-full">
            <div className=" flex flex-col justify-center items-center space-y-3">
                <div className="flex gap-2 w-2/5 text-xl"><span className="pt-1"><Register /></span>register</div>
                <input className="rounded py-1 px-2 w-2/5 bg-slate-900" type="text" placeholder="full name" />
                <input className="rounded py-1 px-2 w-2/5 bg-slate-900" type="text" placeholder="username" />
                <input className="rounded py-1 px-2 w-2/5 bg-slate-900" type="text" placeholder="email" />
                <input className="rounded py-1 px-2 w-2/5 bg-slate-900" type="text" placeholder="password" />
                <input className="rounded py-1 px-2 w-2/5 bg-slate-900" type="text" placeholder="retype password" />
                <button className="py-1 flex bg-slate-500 text-black font-extrabold rounded-md gap-2 w-2/5 justify-center items-center hover:bg-slate-900 hover:text-white transition">
                    <Register /> Sign Up</button>
            </div>
            <div className="flex flex-col justify-center items-center space-y-3">
                <div className="flex gap-2 w-2/5 text-xl"><span className="pt-1"><Login /></span>login</div>
                <button className="py-1 flex bg-slate-500 text-black font-extrabold rounded-md gap-2 w-2/5 justify-center items-center hover:bg-slate-900 hover:text-white transition">
                    <span className="p-1"><Google /></span>
                </button>
                <div className="w-2/5 text-center">or</div>
                <input className="rounded py-1 px-2 w-2/5 bg-slate-900" type="text" placeholder="email" />
                <input className="rounded py-1 px-2 w-2/5 bg-slate-900" type="text" placeholder="password" />
                <button className="py-1 flex bg-slate-500 text-black font-extrabold rounded-md gap-2 w-2/5 justify-center items-center hover:bg-slate-900 hover:text-white transition">
                    <Login /> Sign In</button>
            </div>
        </div>
    )
}

export default page