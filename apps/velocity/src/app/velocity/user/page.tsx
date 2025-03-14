"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

const Page = () => {
    const router = useRouter();
    useEffect(() => {
        router.push('/velocity/login');
    }, [router])
}

export default Page

