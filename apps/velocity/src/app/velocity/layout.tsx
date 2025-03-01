"use client"

import MobileNotice from "@/components/MobileNotice";
import useIsMobile from "@/hooks/useIsMobile";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

    const isMobile = useIsMobile();
    return isMobile ? <MobileNotice /> : <>{children}</>

}