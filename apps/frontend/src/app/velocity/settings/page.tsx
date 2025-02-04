import { Edit, UserLeaderboard } from "@/components/Icons"

const page = () => {
    return (
        <div className=" w-full h-full grid relative">
            <button className="bg-slate-900 px-2 rounded absolute top-2 -right-9 text-yellow-500">
                Logout
            </button>
            <div className="flex flex-col h-auto justify-center items-center py-2 w-full">
                <div className="space-y-2">
                    <span className="text-8xl">
                        <UserLeaderboard />
                    </span>
                    <div className="bg-slate-900 flex justify-center rounded-md items-center space-x-2 relative text-end">
                        <Edit />
                        <span>Upload</span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-4">
                <div className="col-span-2 space-y-3 text-end">
                    <div>Full Name :</div>
                    <div><span className="text-xs">(Velocity_ID) </span>Unique Name :</div>
                    <div>Email :</div>
                    <div>Status :</div>
                    <div>Password :</div>
                    <div>(Socials) Twitter :</div>
                    <div>(Socials) Instagram :</div>
                    <div>(Socials) Website :</div>
                    <div>(Authentication) Logout :</div>
                    <div>(Authentication) Google :</div>
                    <div>(Authentication) Danger :</div>
                </div>
                <div className="col-span-2 space-y-3 px-2">
                    <div className="space-x-2">
                        <input type="text" className="rounded bg-neutral-900 px-2" placeholder="full_name" />
                        <button className="bg-slate-950 rounded-md px-2">Update</button>
                    </div >
                    <div className="space-x-2">
                        <input type="text" className="rounded bg-neutral-900 px-2" placeholder="unique_name" />
                        <button className="bg-slate-950 rounded-md px-2">Update</button>
                    </div>
                    <div className="space-x-2">
                        <input type="text" className="rounded bg-neutral-900 px-2" placeholder="email" />
                        <button className="bg-slate-950 rounded-md px-2">Update</button>
                    </div>
                    <div className="space-x-2">
                        <input type="text" className="rounded bg-neutral-900 px-2" placeholder="status" />
                        <button className="bg-slate-950 rounded-md px-2">Update</button>
                    </div>
                    <div className="space-x-2">
                        <input type="text" className="rounded bg-neutral-900 px-2" placeholder="new password" />
                        <input type="text" className="rounded bg-neutral-900 px-2" placeholder="confirm password" />
                        <button className="bg-slate-950 rounded-md px-2">Update</button>
                    </div>
                    <div className="space-x-2 ">
                        <input type="text" className="rounded bg-neutral-900 px-2" placeholder="twitter/X" />
                        <button className="bg-slate-950 rounded-md px-2">Update</button>
                    </div>
                    <div className="space-x-2 ">
                        <input type="text" className="rounded bg-neutral-900 px-2" placeholder="instagram" />
                        <button className="bg-slate-950 rounded-md px-2">Update</button>
                    </div>
                    <div className="space-x-2 ">
                        <input type="text" className="rounded bg-neutral-900 px-2" placeholder="website" />
                        <button className="bg-slate-950 rounded-md px-2">Update</button>
                    </div>
                    <div className=" space-x-2 ">
                        <button className="bg-slate-900 px-2 rounded">Logout from all devices</button>
                    </div>
                    <div className="space-x-2">
                        <button className="bg-slate-900 px-2 rounded">Google authentication</button>
                    </div>
                    <div className="space-x-2">
                        <button className="bg-slate-900 px-2 rounded text-yellow-500">Reset Account</button>
                        <button className="bg-slate-900 px-2 rounded text-red-500">Delete Account</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page