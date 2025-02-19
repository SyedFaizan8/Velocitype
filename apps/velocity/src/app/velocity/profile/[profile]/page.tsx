"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { UserSkeleton } from "@/components/skeleton/UserSkeleton"
import { UserData } from "@/utils/types/profileTypes"
import UserProfile from "@/components/userProfile";
import { fetchProfile } from "@/utils/fetchProfile";

export default function Page() {

    const { profile: slug } = useParams() as { profile: string };
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
        bringProfile();
    }, [slug, bringProfile]);

    if (!userData) return <UserSkeleton />
    return <UserProfile userData={userData} />

}
