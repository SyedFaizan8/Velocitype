"use client"

import PasswordInput from '@/components/form/PasswordInput'
import { Loading } from '@/components/Icons'
import { toast } from '@/hooks/use-toast'
import { encryptFrontend } from '@/utils/encryptFrontend'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordFrontend } from '@repo/zod'
import axios from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

interface resetPassword {
    password: string,
    confirmPassword: string
}

const Page = () => {

    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const [isloading, setisLoading] = useState<boolean>(false);
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<resetPassword>({
        resolver: zodResolver(resetPasswordFrontend),
        mode: "onBlur",
    });

    const onSubmit = async (data: resetPassword) => {
        try {
            setisLoading(true)

            const payload = {
                token,
                password: data.password,
                confirmPassword: data.confirmPassword
            }

            const { error, iv, ciphertext, signature } = await encryptFrontend(payload);
            if (error) {
                toast({
                    title: "Something went wrong while encrypting"
                })
            }

            const response = await axios.post("/api/reset-password",
                { data: ciphertext, iv },
                { headers: { "x-signature": signature } });

            if (response.data) {
                toast({ title: "password changed successfull" })
                router.push("/velocity/login")
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast({
                    variant: "destructive",
                    title: error?.response?.data.message || error.message,
                })
            }
            setisLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center w-full h-full p-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 w-1/2 h-1/2 bg-slate-900 rounded-lg flex flex-col justify-center items-center p-28">
                <div className="self-start text-slate-500 text-2xl font-bold">Reset password</div>
                <PasswordInput
                    register={register}
                    name="password"
                    placeholder="password"
                    errors={errors}
                    className='w-full'
                    inputClassName='border border-slate-400'
                />
                <PasswordInput
                    register={register}
                    name="confirmPassword"
                    placeholder="retype password"
                    errors={errors}
                    className='w-full'
                    inputClassName='border border-slate-400'
                />
                <button
                    type="submit"
                    disabled={isloading}
                    className={`py-1 flex bg-slate-500 text-black font-extrabold rounded-md gap-2 w-full justify-center items-center ${!isloading && "hover:bg-slate-600 hover:text-white hover:scale-105 transition transform  duration-200"} tracking-widest `}
                >
                    {isloading ? <span className='animate-spin py-1'><Loading /></span> : "Submit →"}
                </button>
            </form>
        </div>
    )
}

export default Page