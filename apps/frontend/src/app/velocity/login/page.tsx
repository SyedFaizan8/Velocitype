"use client"

import { Google, Login, Register } from "@/components/Icons"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, registerSchema } from "@repo/zod";
import { useDebouncedCallback } from "use-debounce";
import axios from "axios";
import PasswordInput from "@/components/form/PasswordInput";
import InputField from "@/components/form/InputField";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { useRouter } from "next/navigation";
import { fetchUser, loginUser } from "@/store/authSlice";

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

const page = () => {
    const dispatch = useAppDispatch();
    const { user, error } = useAppSelector((state) => state.auth);
    const router = useRouter();

    useEffect(() => {
        if (!user) dispatch(fetchUser())
    }, [user, router])

    useEffect(() => {
        if (user) router.push("/")
    }, [user, router])


    const {
        register: registerRegister,
        handleSubmit: handleSubmitRegister,
        formState: { errors: errorsRegister },
    } = useForm<FormValues>({
        resolver: zodResolver(registerSchema),
    });

    const {
        register: registerLogin,
        handleSubmit: handleSubmitLogin,
        formState: { errors: errorsLogin },
    } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema)
    });

    const [availability, setAvailability] = useState<boolean | null>(null);

    const checkAvailability = async (value: string) => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/check-username`, {
                params: { username: value },
            });
            setAvailability(data.data.available);
        } catch (error) {
            setAvailability(false);
        }
    };

    const debouncedCheck = useDebouncedCallback((value: string) => {
        checkAvailability(value);
    }, 500);

    const onSubmit = async (data: FormValues) => {
        if (!availability) return;
        console.log("submitted registration data ", data);
        try {
            const responce = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/register`, data);
            console.log(responce.data)
            if (responce.data) onLogin({ email: data.email, password: data.password });
        } catch (error) {
            console.log("something went wrong while registering the user");
        }
    }

    const onLogin = async (data: LoginValues) => {
        try {
            const resultAction = await dispatch(loginUser(data)).unwrap();
            console.log("User logged in", resultAction);
            router.push("/");
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    if (user) return null;

    return (
        <div className="grid grid-cols-2 h-full w-full">
            <form onSubmit={handleSubmitRegister(onSubmit)} className="w-full flex flex-col justify-center items-center space-y-3">
                <div className="flex gap-2 w-2/5 text-xl"><span className="pt-1"><Register /></span>register</div>
                <InputField
                    register={registerRegister}
                    name="fullname"
                    placeholder="full name"
                    errors={errorsRegister}
                />
                <InputField
                    register={registerRegister}
                    name="username"
                    placeholder="username"
                    errors={errorsRegister}
                    onChange={(e) => debouncedCheck(e.target.value)}
                />
                {availability !== null && (availability ? <span>✅</span> : <span>❌</span>)}
                <InputField
                    register={registerRegister}
                    name="email"
                    placeholder="email"
                    errors={errorsRegister}
                />
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
                <button type="submit" className="py-1 flex bg-slate-500 text-black font-extrabold rounded-md gap-2 w-2/5 justify-center items-center hover:bg-slate-900 hover:text-white transition">
                    <Register /> Sign Up</button>
            </form >

            <form onSubmit={handleSubmitLogin(onLogin)} className="flex flex-col justify-center items-center space-y-3">
                <div className="flex gap-2 w-2/5 text-xl"><span className="pt-1"><Login /></span>login</div>
                <button className="py-1 flex bg-slate-500 text-black font-extrabold rounded-md gap-2 w-2/5 justify-center items-center hover:bg-slate-900 hover:text-white transition">
                    <span className="p-1"><Google /></span>
                </button>
                <div className="w-2/5 text-center">or</div>
                <InputField
                    register={registerLogin}
                    name="email"
                    placeholder="email"
                    errors={errorsLogin}
                />
                <PasswordInput<LoginValues>
                    register={registerLogin}
                    name="password"
                    placeholder="password"
                    errors={errorsLogin}
                />
                <button type="submit" className="py-1 flex bg-slate-500 text-black font-extrabold rounded-md gap-2 w-2/5 justify-center items-center hover:bg-slate-900 hover:text-white transition">
                    <Login /> Sign In</button>
            </form>
        </div >
    )
}

export default page