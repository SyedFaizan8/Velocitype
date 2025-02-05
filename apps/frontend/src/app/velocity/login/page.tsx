"use client"

import { Google, Login, Register } from "@/components/Icons"
import { useState } from "react"
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, registerSchema } from "@repo/zod";
import { useDebouncedCallback } from "use-debounce";
import axios from "axios";
import PasswordInput from "@/components/form/PasswordInput";
import InputField from "@/components/form/InputField";

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

    const [availability, setAvailability] = useState({
        username: null as boolean | null,
        email: null as boolean | null
    });

    const checkAvailability = async (field: string, value: string) => {
        try {
            const { data } = await axios.get(`http://localhost:4000/api/check-${field}`, {
                params: { [field]: value },
            });
            setAvailability(prev => ({
                ...prev,
                [field]: data.available
            }));
        } catch (error) {
            console.error(`Error checking ${field}:`, error);
            setAvailability(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    const debouncedCheck = useDebouncedCallback((field: string, value: string) => {
        checkAvailability(field, value);
    }, 500);

    const onSubmit = (data: FormValues) => {
        if (!availability.username || !availability.email) {
            // Handle feedback: username or email is unavailable
            return;
        }
        console.log("submitted registration data ", data);
        // Send registration data to your backend
    }

    const onLogin = (data: LoginValues) => {
        console.log("user loged in", data);
        // login the user 
    }

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
                    onChange={(e) => debouncedCheck("username", e.target.value)}
                />
                {/* {availability.username !== null && (
                        <p>{availability.username ? '✅ Username available' : '❌ Username taken'}</p>
                    )} */}
                <InputField
                    register={registerRegister}
                    name="email"
                    placeholder="email"
                    errors={errorsRegister}
                    onChange={(e) => debouncedCheck("email", e.target.value)}
                />
                {/* {availability.email !== null && (
                        <p>{availability.email ? '✅ Email available' : '❌ Email already registered'}</p>
                    )} */}
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