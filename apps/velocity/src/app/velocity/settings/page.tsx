"use client";

import FileUpload from "@/components/FileUpload";
import { Edit, Loading, UserLeaderboard } from "@/components/Icons";
import { addTransformationToImageKitURL } from "@/utils/addTranformation";
import { authenticator } from "@/utils/imagekitAuth";
import { ImageKitProvider } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { useRouter } from "next/navigation";
import { fetchUser, logoutUser } from "@/store/authSlice";
import { useToast } from "@/hooks/use-toast";
import { SettingsSkeleton } from "@/components/skeleton/SettingsSkeleton"
import {
    bioSchema,
    emailSchema,
    fullnameSchema,
    socialSchema,
    updatePasswordSchema,
    usernameSchema,
} from "@repo/zod";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    BioFormData,
    EmailFormData,
    FullnameFormData,
    SocialsFormData,
    UpdatePasswordFormData,
    UsernameFormData
} from "@/utils/types/formTypes";
import { urlEndpoint, publicKey } from "@/utils/constants"
import { UserProfile, UserUpdateData } from "@/utils/types/settingsTypes"

const Page = () => {

    const dispatch = useAppDispatch();
    const { user, loading, initialized } = useAppSelector(state => state.auth);
    const router = useRouter();
    const { toast } = useToast();

    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>();
    const [uploading, setUploading] = useState(false);
    const fileUploadRef = useRef<HTMLInputElement | null>(null);

    const findUser = useCallback(async () => {
        await dispatch(fetchUser());
    }, [dispatch])

    const bringProfile = useCallback(async () => {
        try {
            if (!user?.username) return;
            const response = await axios.get(
                "/api/user/profile",
                {
                    params: { username: user.username },
                    withCredentials: true
                }
            );
            setUserData(response.data.data);
        } catch {
            toast({
                variant: "destructive",
                title: "something went wrong while fetching profile"
            })
        }
    }, [user, setUserData, toast])

    useEffect(() => {
        const checkAuth = async () => {
            if (initialized && !loading && !user) router.push("/velocity/login")
        };
        checkAuth();
    }, [user, router, loading, initialized]);

    useEffect(() => {
        if (!initialized) findUser();
    }, [initialized, dispatch, findUser]);

    useEffect(() => {
        if (user?.username) bringProfile()
    }, [user, bringProfile]);

    const onSuccess = async (res: IKUploadResponse) => {
        const transformation = "tr:h-500,w-500";
        const transformUrl = addTransformationToImageKitURL(res.url, transformation);
        setImageUrl(transformUrl);
        handleSubmitForm('dp', { imageUrl: transformUrl })
    };

    const handleSubmitForm = async (url: string, data: UserUpdateData) => {
        try {
            await axios.post(`/api/user/${url}`, data, { withCredentials: true });
            toast({
                title: "Update Done",
                description: `${url} is updated`,
            })
        } catch {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: `There was a problem with your request.`,
            })
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
    }, [userData, resetFullname, fullnameDirty, usernameDirty, resetUsername, emailDirty, resetEmail, bioDirty, resetBio, socialDirty, resetSocial, passwordDirty, resetPassword]);

    const handleLogout = async () => {
        try {
            await axios.post("/api/logout", {}, { withCredentials: true });
            dispatch(logoutUser());
            router.push("/velocity/login");
        } catch {
            toast({
                title: "user loged out",
                description: "successfull"
            })
        }
    };

    const resetAccount = async () => {
        try {
            await axios.post("/api/user/reset", {}, { withCredentials: true });
            toast({
                title: "Account status",
                description: "Account Reset Successfull."
            })
        } catch {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: `There was a problem with your request.`,
            })
        }
    }
    const deleteAccount = async () => {
        try {
            await axios.post("/api/user/delete", {}, { withCredentials: true });
            toast({
                title: "Account status",
                description: `Account deletion successfull, we miss you.`,
            })
        } catch {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: `There was a problem with your request.`,
            })
        }
    }

    if (loading || !user || !userData) return <SettingsSkeleton />

    return (
        <div className="w-full h-full grid relative">
            <button onClick={handleLogout} className="text-xl bg-slate-900 px-3 rounded absolute top-2 -right-9 space-x-2  font-bold text-yellow-400 tracking-widest transform hover:scale-105 hover:bg-slate-900 transition-colors duration-200">
                Logout
            </button>
            <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
                <div className="flex flex-col h-auto justify-center items-center py-2 w-full">
                    <div className="space-y-2 flex flex-col justify-center items-center">
                        <span className="text-8xl text-center">
                            {uploading ? <Loading className="animate-spin text-8xl" /> : (imageUrl ? <Image height={100} width={100} src={imageUrl} alt={"user"} className="rounded-full" /> : <UserLeaderboard />)}
                        </span>
                        <div className="bg-slate-900 px-1 flex justify-center rounded-md items-center space-x-2 relative text-end  font-bold text-slate-400 tracking-widest transform hover:scale-105 hover:bg-slate-900 transition-colors duration-200">
                            <Edit />
                            <button disabled={uploading} onClick={() => fileUploadRef.current?.click()}>Upload</button>
                        </div>
                    </div>
                    <FileUpload
                        ref={fileUploadRef}
                        onSuccess={onSuccess}
                        setUploading={setUploading}
                        setError={(error) => {
                            if (error) {
                                toast({
                                    variant: "destructive",
                                    title: error,
                                })
                            }
                        }}
                    />
                </div>
            </ImageKitProvider>
            <div className="grid grid-cols-6">
                <div className="col-span-2 space-y-3 text-end text-slate-500">
                    <div>Full Name:</div>
                    <div><span className="text-xs">(Velocity_ID) </span>User Name:</div>
                    <div>Email:</div>
                    <div>Bio:</div>
                    <div>Socials:</div>
                    <div>Password:</div>
                    <div className="invisible">Reset form :</div>
                    <div>Connect to Google:</div>
                    <div>Reset Stats:</div>
                    <div>Account Deletion:</div>
                </div>
                <div className="col-span-4 space-y-3 px-2">
                    <form onSubmit={handleFullnameSubmit((data) => handleSubmitForm('fullname', data))} className="space-x-2">
                        <input {...registerFullname('fullname')} type="text" className="rounded bg-neutral-900 px-2 w-96" placeholder="Full Name" />
                        <button type="submit" className="bg-slate-950 rounded-md px-2 text-slate-400">Update</button>
                        {errorsFullname.fullname?.message && <span className="text-xs text-red-500">{errorsFullname.fullname.message}</span>}
                    </form>

                    <form onSubmit={handleUsernameSubmit((data) => handleSubmitForm('username', data))} className="space-x-2">
                        <input {...registerUsername('username')} type="text" className="rounded bg-neutral-900 px-2 w-96" placeholder="Username" />
                        <button type="submit" className="bg-slate-950 rounded-md px-2 text-slate-400">Update</button>
                        {errorsUsername.username?.message && <span className="text-xs text-red-500">{errorsUsername.username.message}</span>}
                    </form>

                    <form onSubmit={handleEmailSubmit((data) => handleSubmitForm('email', data))} className="space-x-2">
                        <input {...registerEmail('email')} type="text" className="rounded bg-neutral-900 px-2 w-96" placeholder="Email" />
                        <button type="submit" className="bg-slate-950 rounded-md px-2 text-slate-400">Update</button>
                        {errorsEmail.email?.message && <span className="text-xs text-red-500">{errorsEmail.email.message}</span>}
                    </form>

                    <form onSubmit={handleBioSubmit((data) => handleSubmitForm('bio', data))} className="space-x-2">
                        <input {...registerBio('bio')} type="text" className="rounded bg-neutral-900 px-2 w-96" placeholder="Bio" />
                        <button type="submit" className="bg-slate-950 rounded-md px-2 text-slate-400">Update</button>
                        {errorsBio.bio?.message && <span className="text-xs text-red-500">{errorsBio.bio.message}</span>}
                    </form>

                    <form onSubmit={handleSocialsSubmit((data) => handleSubmitForm('socials', { website: data?.website ?? '' }))} className="space-x-2" >
                        <input {...registerSocials('website')} type="text" className="rounded bg-neutral-900 px-2 w-96" placeholder="Website/Socials" />
                        <button type="submit" className="bg-slate-950 rounded-md px-2 text-slate-400">Update</button>
                        {errorsSocials.website?.message && (<span className="text-xs text-red-500">{errorsSocials.website?.message}</span>)}
                    </form>

                    <form onSubmit={handlePasswordSubmit((data) => handleSubmitForm('password', data))} className="space-x-2">
                        <input {...registerPassword('oldPassword')} type="password" className="rounded bg-neutral-900 px-2 w-[188px]" placeholder="Old Password" />
                        <input {...registerPassword('newPassword')} type="password" className="rounded bg-neutral-900 px-2 w-[188px]" placeholder="New Password" />
                        <button type="submit" className="bg-slate-950 rounded-md px-2 text-slate-400">Update</button>
                        {(errorsPassword.oldPassword?.message || errorsPassword.newPassword?.message)
                            && <span className="text-xs text-red-500">{errorsPassword.oldPassword?.message || errorsPassword.newPassword?.message}</span>}
                    </form>
                    <button className="space-x-2 px-4 rounded-md bg-slate-950 font-bold text-white tracking-widest transform hover:scale-105 hover:bg-slate-900 transition-colors duration-200">
                        Clear Form
                    </button>
                    <div className="space-x-2">
                        <button className="space-x-2 px-4 rounded-md bg-slate-950 font-bold text-yellow-400 tracking-widest transform hover:scale-105 hover:bg-slate-900 transition-colors duration-200">
                            Link Google
                        </button>
                    </div>
                    <div className="space-x-6">
                        <AlertDialog>
                            <AlertDialogTrigger className="space-x-2 px-4 rounded-md bg-slate-950 font-bold text-red-400 tracking-widest transform hover:scale-105 hover:bg-slate-900 transition-colors duration-200">
                                Reset
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-slate-800">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently Reset your account
                                        and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => resetAccount()}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    <div className="space-x-6">
                        <AlertDialog>
                            <AlertDialogTrigger className="space-x-2 px-4 rounded-md bg-slate-950 font-bold text-red-400 tracking-widest transform hover:scale-105 hover:bg-slate-900 transition-colors duration-200">
                                Delete
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-slate-800">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently Delete your account
                                        and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteAccount()}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Page;
