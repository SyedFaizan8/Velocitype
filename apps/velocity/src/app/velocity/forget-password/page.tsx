"use client";

import React, { useState, useEffect } from "react";
import InputField from "@/components/form/InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema } from "@repo/zod";
import { useForm } from "react-hook-form";
import { useAvailability } from "@/hooks/useAvalibility";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { encryptFrontend } from "@/utils/encryptFrontend";


interface FormValues {
    email: string;
}

const Page = () => {
    const [isWaiting, setIsWaiting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(emailSchema),
        mode: "onBlur",
    });

    const { emailAvailability, checkEmailAvailability } = useAvailability();

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isWaiting) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev === 1) {
                        clearInterval(timer);
                        setIsWaiting(false);
                        return 60;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isWaiting]);

    const onSubmit = async (data: FormValues) => {
        if (emailAvailability && emailAvailability !== null) {
            toast({
                variant: "destructive",
                title: "User with this email does not exist."
            })
        } else {
            try {
                setIsWaiting(true);

                const { error, iv, ciphertext, signature } = await encryptFrontend(data);
                if (error) {
                    toast({
                        title: "Something went wrong while encrypting"
                    })
                    setIsWaiting(false)
                }

                const response = await axios.post("/api/forgot-password",
                    {
                        data: ciphertext,
                        iv
                    },
                    {
                        headers: { "x-signature": signature }
                    });
                if (response.data) {
                    toast({
                        title: "Verification sent to the email successfully"
                    })
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast({
                        variant: "destructive",
                        title: error?.response?.data || error.message,
                    })
                }
                setIsWaiting(false);
            }
        }
    };

    return (
        <div className="flex flex-col justify-center items-center w-full h-full p-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 w-1/2 h-1/2 bg-slate-900 rounded-lg flex flex-col justify-center items-center p-28">
                <div className="self-start text-slate-500 text-2xl font-bold">Forgot password</div>
                <div className="w-full relative">
                    <InputField
                        register={register}
                        name="email"
                        placeholder="Email"
                        errors={errors}
                        className="border-2 border-slate-500"
                        onChange={(e) => checkEmailAvailability(e.target.value)}
                    />
                    <span className="ml-2 text-lg w-8 flex justify-center absolute right-0 top-1">
                        {(emailAvailability && emailAvailability !== null) && "❌"}
                    </span>
                </div>
                <button
                    type="submit"
                    disabled={isWaiting}
                    className={`py-1 flex bg-slate-500 text-black font-extrabold rounded-md gap-2 w-full justify-center items-center ${!isWaiting && "hover:bg-slate-600 hover:text-white hover:scale-105 transition transform  duration-200"} tracking-widest`}
                >
                    {isWaiting ? `Wait ${timeLeft}s` : "Send →"}
                </button>
            </form>
        </div>
    );
};

export default Page;