"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { fetchUser } from "@/store/authSlice";
import { toast } from "@/hooks/use-toast";
import { UserSkeleton } from "@/components/skeleton/UserSkeleton"
import { UserData } from "@/utils/types/profileTypes"
import UserProfile from "@/components/userProfile";
import { fetchProfile } from "@/utils/fetchProfile";

export default function Page() {

    const { profile: slug } = useParams() as { profile: string };

    const { user, loading, initialized } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);

    const bringProfile = useCallback(async () => {
        try {
            const data = await fetchProfile(slug)
            setUserData(data);
        } catch {
            toast({
                variant: "destructive",
                title: "something went while fetching profile"
            })
        }
    }, [slug, setUserData])

    useEffect(() => {
        const fetchProfile = async () => {
            if (initialized && !loading && !user) {
                toast({
                    variant: "destructive",
                    title: "Please login to visit the profile"
                })
                router.push("/velocity/login");
            } else if (user) {
                await bringProfile();
            }
        };
        fetchProfile();
    }, [user, loading, initialized, router, slug, bringProfile]);

    useEffect(() => {
        if (!initialized) {
            const findUser = async () => {
                const result = await dispatch(fetchUser());
                if (result.payload) {
                    await bringProfile();
                }
            };
            findUser();
        }
    }, [initialized, dispatch, slug, bringProfile]);

    if (initialized && !loading && !user || !userData) return <UserSkeleton />

    return <UserProfile userData={userData} />
}
