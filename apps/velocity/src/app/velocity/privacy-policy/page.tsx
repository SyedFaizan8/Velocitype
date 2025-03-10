"use client"

import TooltipIcon from '@/components/TooltipIcon';
import { toast } from '@/hooks/use-toast';

const Page = () => {

    const handleCopy = () => {
        navigator.clipboard.writeText("contact@syedfaizan.in");
    };

    return (
        <div className="h-full w-full flex flex-col justify-center space-y-3">
            <h1 className="text-2xl font-bold ">VelociType Privacy Policy</h1>
            <p className='text-slate-400 text-sm'>Effective Date: March 11, 2025</p>
            <h2 className="text-md font-semibold ">1. Data Collection:</h2>
            <ul className="list-disc list-inside mb-4 text-slate-400">
                <li>Mandatory: Email, full name, username, and password.</li>
                <li>Optional: Profile photo, Bio and social links.</li>
                <li>Cookies: Used to verify login status and analytics (via Posthog).</li>
            </ul>
            <div className="text-md font-semibold ">2. Usage: <span className=" text-slate-400"> Manage accounts, send communications (e.g., password resets via Resend Mail), and improve our services.</span></div>
            <div className="text-md font-semibold ">3. Security: <span className=" text-slate-400"> We use industry-standard measures, including encryption, to protect your data.</span></div>
            <div className="text-md font-semibold ">4. Your Rights: <span className=" text-slate-400">You can access, update, or delete your account and personal data.</span></div>
            <div className="text-md font-semibold ">5. Third Parties: <span className=" text-slate-400"> Data is shared only with trusted partners under similar privacy standards.</span></div>
            <span className='text-slate-400'>
                Contact:
                <span onClick={() => {
                    handleCopy();
                    toast({ title: "email copied to clipboard" });
                }} className='cursor-pointer text-yellow-200'>
                    <TooltipIcon icon=" contact@syedfaizan.in" tooltipText="double click to copy" />
                </span>
            </span>
            <p className="mb-4 text-slate-400"> By using VelociType, you agree to this Privacy Policy.</p>
        </div >
    );
};

export default Page;