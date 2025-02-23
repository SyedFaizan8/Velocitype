"use client"

import { Google, Login, Register } from "@/components/Icons"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, registerSchema } from "@repo/zod";
import axios from "axios";
import PasswordInput from "@/components/form/PasswordInput";
import InputField from "@/components/form/InputField";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { useRouter } from "next/navigation";
import { fetchUser, loginUser } from "@/store/authSlice";
import { toast } from "@/hooks/use-toast";
import { useAvailability } from "@/hooks/useAvalibility";
import Turnstile from "react-turnstile";
import { TURNSTILE_SITE_KEY } from "@/utils/constants";

interface FormValues {
    fullname: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface LoginValues {
    email: string;
    password: string;
}

const Page = () => {
    const dispatch = useAppDispatch();
    const { user, error } = useAppSelector((state) => state.auth);
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        if (!user) dispatch(fetchUser())
    }, [user, router, dispatch])

    const {
        register: registerRegister,
        handleSubmit: handleSubmitRegister,
        formState: { errors: errorsRegister },
    } = useForm<FormValues>({
        resolver: zodResolver(registerSchema),
        mode: "onBlur"
    });

    const {
        register: registerLogin,
        handleSubmit: handleSubmitLogin,
        formState: { errors: errorsLogin },
    } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        mode: "onBlur"
    });

    const {
        usernameAvailability,
        emailAvailability,
        checkUsernameAvailability,
        checkEmailAvailability
    } = useAvailability();

    const onSubmit = async (data: FormValues) => {

        if (!token) {
            toast({
                variant: "destructive",
                title: "Please complete the CAPTCHA."
            })
            return;
        }

        try {
            await axios.post("/api/verify-turnstile", { token });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast({
                    variant: "destructive",
                    title: "CAPTCHA verification failed",
                    description: error.response?.data?.message || "An error occurred during CAPTCHA verification."
                });
            }
        }

        if (!usernameAvailability) {
            toast({
                variant: "destructive",
                title: "username is taken",
                description: "try different username"
            })
        } else if (!emailAvailability) {
            toast({
                variant: "destructive",
                title: "email is taken ",
                description: "try different email"
            })
        } else if (usernameAvailability && emailAvailability) {
            try {
                const response = await axios.post("/api/register", data);
                if (response.data) onLogin({ email: data.email, password: data.password });
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast({
                        variant: "destructive",
                        title: error?.response?.data || error.message,
                    })
                }
            }
        }
    }

    const onLogin = useCallback(async (data: LoginValues) => {
        await dispatch(loginUser(data))
        if (!error) toast({ title: "login successfull" })
    }, [dispatch, error])

    useEffect(() => {
        if (!error && user?.username) router.push("/")
    }, [error, user, onLogin, router])

    useEffect(() => {
        if (error) {
            toast({
                variant: "destructive",
                title: error,
            })
        }
    }, [error])

    if (user) return null;

    return (
        <div className="grid grid-cols-2 h-full w-full">
            <form onSubmit={handleSubmitRegister(onSubmit)} className="w-full flex flex-col justify-center items-center space-y-3">

                <div className="flex gap-2 w-1/2 text-xl">
                    <span className="pt-1"><Register /></span>register
                </div>

                <div className="w-1/2">
                    <InputField
                        register={registerRegister}
                        name="fullname"
                        placeholder="full name"
                        errors={errorsRegister}
                    />
                </div>

                <div className="flex items-center w-1/2">
                    <InputField
                        register={registerRegister}
                        name="username"
                        placeholder="username"
                        errors={errorsRegister}
                        onChange={(e) => checkUsernameAvailability(e.target.value)}
                    />
                    {(usernameAvailability !== null && usernameAvailability && !errorsRegister.username) && (
                        <span className="ml-2 text-lg w-8 flex justify-center">
                            {usernameAvailability && "✅"}
                        </span>
                    )}
                </div>

                <div className="flex items-center w-1/2 relative">
                    <InputField
                        register={registerRegister}
                        name="email"
                        placeholder="email"
                        errors={errorsRegister}
                        onChange={(e) => checkEmailAvailability(e.target.value)}
                    />
                    {(emailAvailability !== null && emailAvailability && !errorsRegister.email) && (
                        <span className="ml-2 text-lg w-8 flex justify-center ">
                            {emailAvailability && "✅"}
                        </span>
                    )}
                </div>

                <PasswordInput<FormValues>
                    register={registerRegister}
                    name="password"
                    placeholder="password"
                    errors={errorsRegister}
                />
                <PasswordInput<FormValues>
                    register={registerRegister}
                    name="confirmPassword"
                    placeholder="retype password"
                    errors={errorsRegister}
                />

                <Turnstile
                    theme="dark"
                    sitekey={TURNSTILE_SITE_KEY}
                    onVerify={(token: string) => setToken(token)}
                />

                <button type="submit" className="py-1 flex bg-slate-500 text-black font-extrabold rounded-md gap-2 w-1/2 justify-center items-center hover:bg-slate-600 hover:text-white transition space-x-2 px-4  tracking-widest transform hover:scale-105 duration-200">
                    <Register /> Sign Up
                </button>
            </form>


            <form onSubmit={handleSubmitLogin(onLogin)} className="flex flex-col justify-center items-center space-y-3">
                <div className="flex gap-2 w-1/2 text-xl"><span className="pt-1"><Login /></span>login</div>
                <button className="py-1 flex bg-slate-500 text-black font-extrabold rounded-md gap-2 w-1/2 justify-center items-center hover:bg-slate-600 hover:text-white transition space-x-2 px-4  tracking-widest transform hover:scale-105 duration-200">
                    <span className="p-1 flex "><Google /></span>
                </button>
                <div className="w-2/5 text-center">or</div>
                <div className="w-1/2">
                    <InputField
                        register={registerLogin}
                        name="email"
                        placeholder="email"
                        errors={errorsLogin}
                    />
                </div>
                <PasswordInput<LoginValues>
                    register={registerLogin}
                    name="password"
                    placeholder="password"
                    errors={errorsLogin}
                />
                <button type="submit" className="py-1 flex bg-slate-500 text-black font-extrabold rounded-md gap-2 w-1/2 justify-center items-center hover:bg-slate-600 hover:text-white transition  space-x-2 px-4  tracking-widest transform hover:scale-105 duration-200">
                    <Login /> Sign In</button>
            </form>
        </div >
    )
}

export default Page