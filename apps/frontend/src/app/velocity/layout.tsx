"use client"

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

    return (
        <>
            <Header />
            <section className="w-full md:px-10 px-6 h-[80vh] flex flex-col justify-center items-center">
                {children}
            </section>
            <Toaster />
            <motion.div
                key="footer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <Footer />
            </motion.div>
        </>
    )
}