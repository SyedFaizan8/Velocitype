"use client";
import FileUpload from "@/components/FileUpload";
import { Edit, Loading, UserLeaderboard } from "@/components/Icons";
import { addTransformationToImageKitURL } from "@/utils/addTranformation";
import { authenticator } from "@/utils/imagekitAuth";
import { ImageKitProvider } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { bioSchema, emailSchema, fullnameSchema, socialSchema, updatePasswordSchema, usernameSchema } from "@repo/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BioFormData, EmailFormData, FullnameFormData, SocialsFormData, UpdatePasswordFormData, UsernameFormData } from "@/utils/types";
import { useDebouncedCallback } from "use-debounce";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { useRouter } from "next/navigation";
import { fetchUser, logoutUser } from "@/store/authSlice";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

interface UserProfile {
    imageUrl: string | null;
    fullname: string | null;
    username: string;
    email: string;
    bio: string | null;
    website: string | null;
}

const page = () => {

    const dispatch = useAppDispatch();
    const { user, loading, initialized } = useAppSelector(state => state.auth);
    const router = useRouter();

    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>();
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileUploadRef = useRef<HTMLInputElement | null>(null);
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

    const findUser = async () => {
        await dispatch(fetchUser());
    };

    const bringProfile = async () => {
        try {
            if (!user?.username) return;
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile/${user.username}`,
                { withCredentials: true }
            );
            console.log("Fetched profile:", response.data.data);
            setUserData(response.data.data);
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            if (initialized && !loading && !user) {
                router.push("/velocity/login");
            }
        };
        checkAuth();
    }, [user, router, loading, initialized]);

    useEffect(() => {
        if (!initialized) {
            findUser();
        }
    }, [initialized, dispatch]);

    useEffect(() => {
        if (user?.username) {
            bringProfile();
        }
    }, [user]);


    const checkAvailability = async (value: string, type: "username" | "email") => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/check-${type}`, {
                params: { [type]: value },
            });
            console.log(data.data)
            if (type === "username") setUsernameAvailable(data.data.available);
            else setEmailAvailable(data.data.available)
        } catch (error) {
            console.error(`Error checking ${type}:`, error);
            if (type === "username") {
                setUsernameAvailable(false);
            } else {
                setEmailAvailable(false);
            }
        }
    };

    const debouncedCheckUsername = useDebouncedCallback((value: string) => {
        checkAvailability(value, "username");
    }, 500);

    const debouncedCheckEmail = useDebouncedCallback((value: string) => {
        checkAvailability(value, "email");
    }, 500);

    const onSuccess = async (res: IKUploadResponse) => {
        const transformation = "tr:h-500,w-500";
        const transformUrl = addTransformationToImageKitURL(res.url, transformation);
        setImageUrl(transformUrl);
        try {
            handleSubmitForm('dp', { imageUrl: transformUrl })
            alert('Profile picture updated successfully');
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmitForm = async (url: string, data: any) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${url}`, data, { withCredentials: true });
            alert('Updated successfully'); //show any tip or side thing
        } catch (error) {
            console.error(error);
        }
    };

    const { register: registerFullname, handleSubmit: handleFullnameSubmit, reset: resetFullname, formState: { errors: errorsFullname, isDirty: fullnameDirty } } = useForm<FullnameFormData>({
        resolver: zodResolver(fullnameSchema),
        defaultValues: { fullname: "" },
    });

    const { register: registerUsername, handleSubmit: handleUsernameSubmit, reset: resetUsername, formState: { errors: errorsUsername, isDirty: usernameDirty } } = useForm<UsernameFormData>({
        resolver: zodResolver(usernameSchema),
        defaultValues: { username: "" },
    });

    const { register: registerEmail, handleSubmit: handleEmailSubmit, reset: resetEmail, formState: { errors: errorsEmail, isDirty: emailDirty } } = useForm<EmailFormData>({
        resolver: zodResolver(emailSchema),
        defaultValues: { email: "" },
    });

    const { register: registerBio, handleSubmit: handleBioSubmit, reset: resetBio, formState: { errors: errorsBio, isDirty: bioDirty } } = useForm<BioFormData>({
        resolver: zodResolver(bioSchema),
        defaultValues: { bio: "" },
    });

    const { register: registerSocials, handleSubmit: handleSocialsSubmit, reset: resetSocial, formState: { errors: errorsSocials, isDirty: socialDirty } } = useForm<SocialsFormData>({
        resolver: zodResolver(socialSchema),
        defaultValues: { website: "" },
    });

    const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, formState: { errors: errorsPassword, isDirty: passwordDirty } } = useForm<UpdatePasswordFormData>({
        resolver: zodResolver(updatePasswordSchema),
    });

    useEffect(() => {
        if (userData && !fullnameDirty) resetFullname({ fullname: userData.fullname || "" })
        if (userData && !usernameDirty) resetUsername({ username: userData.username || "" })
        if (userData && !emailDirty) resetEmail({ email: userData.email || "" })
        if (userData && !bioDirty) resetBio({ bio: userData.bio || "" })
        if (userData && !socialDirty) resetSocial({ website: userData.website || "" });
        if (userData && !passwordDirty) resetPassword({ oldPassword: "", newPassword: "" });
        if (userData?.imageUrl) setImageUrl(userData.imageUrl)
    }, [userData, resetFullname, fullnameDirty, usernameDirty, resetUsername, emailDirty, resetEmail, bioDirty, resetBio, socialDirty, resetSocial]);

    const handleLogout = async () => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/logout`, {}, { withCredentials: true });
            dispatch(logoutUser());
            router.push("/velocity/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const resetAccount = async () => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/reset`, {}, { withCredentials: true });
            alert('reset successfully');
        } catch (error) {
            console.error(error);
        }
    }
    const deleteAccount = async () => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/delete`, {}, { withCredentials: true });
            alert('delete successfully');
        } catch (error) {
            console.error(error);
        }
    }

    if (loading || !user || !userData) return null

    return (
        <div className="w-full h-full grid relative">
            <button onClick={handleLogout} className="bg-slate-900 px-2 rounded absolute top-2 -right-9 text-yellow-500">
                Logout
            </button>
            <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
                <div className="flex flex-col h-auto justify-center items-center py-2 w-full">
                    <div className="space-y-2">
                        <span className="text-8xl text-center">
                            {uploading ? <Loading className="animate-spin text-6xl" /> : (imageUrl ? <Image height={100} width={100} src={imageUrl} alt={"user"} className="rounded-full" /> : <UserLeaderboard />)}
                        </span>
                        <div className="bg-slate-900 px-1 flex justify-center rounded-md items-center space-x-2 relative text-end">
                            <Edit />
                            <button disabled={uploading} onClick={() => fileUploadRef.current?.click()}>Upload</button>
                        </div>
                    </div>
                    <FileUpload
                        ref={fileUploadRef}
                        onSuccess={onSuccess}
                        setUploading={setUploading}
                        setError={setError}
                    />
                    {error && <div className="text-red-500">{error}</div>}
                </div>
            </ImageKitProvider>
            <div className="grid grid-cols-6">
                <div className="col-span-2 space-y-3 text-end">
                    <div>Full Name:</div>
                    <div><span className="text-xs">(Velocity_ID) </span>User Name:</div>
                    <div>Email:</div>
                    <div>Status:</div>
                    <div>Socials:</div>
                    <div>Password:</div>
                    <div className="invisible">Reset form :</div>
                    <div>(Authentication) Google:</div>
                    <div>(Authentication) Danger:</div>
                </div>
                <div className="col-span-4 space-y-3 px-2">
                    <form onSubmit={handleFullnameSubmit((data) => handleSubmitForm('fullname', data))} className="space-x-2">
                        <input {...registerFullname('fullname')} type="text" className="rounded bg-neutral-900 px-2 w-96" placeholder="Full Name" />
                        <button type="submit" className="bg-slate-950 rounded-md px-2">Update</button>
                        {errorsFullname.fullname?.message && <span>{errorsFullname.fullname.message}</span>}
                    </form>

                    <form onSubmit={handleUsernameSubmit((data) => handleSubmitForm('username', data))} className="space-x-2">
                        <input {...registerUsername('username')} onChange={(e) => { debouncedCheckUsername(e.target.value); }} type="text" className="rounded bg-neutral-900 px-2" placeholder="Username" />
                        <button type="submit" className="bg-slate-950 rounded-md px-2">Update</button>
                        {usernameAvailable !== null && (usernameAvailable === true ? <span>✅</span> : <span>❌</span>)}
                        {errorsUsername.username?.message && <span>{errorsUsername.username.message}</span>}
                    </form>

                    <form onSubmit={handleEmailSubmit((data) => handleSubmitForm('email', data))} className="space-x-2">
                        <input {...registerEmail('email')} onChange={(e) => { debouncedCheckEmail(e.target.value); }} type="text" className="rounded bg-neutral-900 px-2" placeholder="Email" />
                        <button type="submit" className="bg-slate-950 rounded-md px-2">Update</button>
                        {emailAvailable !== null && (emailAvailable === true ? <span>✅</span> : <span>❌</span>)}
                        {errorsEmail.email?.message && <span>{errorsEmail.email.message}</span>}
                    </form>

                    <form onSubmit={handleBioSubmit((data) => handleSubmitForm('bio', data))} className="space-x-2">
                        <input {...registerBio('bio')} type="text" className="rounded bg-neutral-900 px-2" placeholder="Bio" />
                        {errorsBio.bio?.message && <span>{errorsBio.bio.message}</span>}
                        <button type="submit" className="bg-slate-950 rounded-md px-2">Update</button>
                    </form>

                    <form onSubmit={handleSocialsSubmit((data) => handleSubmitForm('socials', data))} className="space-x-2" >
                        <input {...registerSocials('website')} type="text" className="rounded bg-neutral-900 px-2" placeholder="Website" />
                        {errorsSocials.website?.message && (<span>{errorsSocials.website?.message}</span>)}
                        <button type="submit" className="bg-slate-950 rounded-md px-2">Update</button>
                    </form>

                    <form onSubmit={handlePasswordSubmit((data) => handleSubmitForm('password', data))} className="space-x-2">
                        <input {...registerPassword('oldPassword')} type="password" className="rounded bg-neutral-900 px-2" placeholder="Old Password" />
                        <input {...registerPassword('newPassword')} type="password" className="rounded bg-neutral-900 px-2" placeholder="New Password" />
                        <button type="submit" className="bg-slate-950 rounded-md px-2">Update</button>
                        {(errorsPassword.oldPassword?.message || errorsPassword.newPassword?.message)
                            && <span>{errorsPassword.oldPassword?.message || errorsPassword.newPassword?.message}</span>}
                    </form>

                    <div className="space-x-2">
                        <button onClick={() => bringProfile()} className="bg-slate-950 text-yellow-500 rounded-md px-2">Clear Form</button>
                    </div>
                    <div className="space-x-2">
                        <button className="bg-yellow-800 rounded-md px-2">Google Authentication</button>
                    </div>
                    <div className="space-x-2">
                        <button onClick={() => resetAccount()} className="bg-yellow-500 rounded-md px-2">Reset Accout Stats</button>
                        <button onClick={() => deleteAccount()} className="bg-red-500 rounded-md px-2">Delete Account</button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default page;
