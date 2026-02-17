"use client"

import { AuthPreview } from "@/components/auth-preview"
import { OTPForm } from "@/components/otp-form"
import { motion } from "framer-motion"

export default function VerifyPage() {
    return (
        <main className="min-h-screen bg-white overflow-hidden flex flex-col lg:flex-row">
            {/* Form Section */}
            <motion.section
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex-1 flex items-center justify-center relative bg-white z-10"
            >
                <div className="w-full">
                    <OTPForm />
                </div>
            </motion.section>

            {/* Preview Section (Hidden on mobile) */}
            <motion.section
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="flex-1 relative hidden lg:block"
            >
                <AuthPreview />
            </motion.section>
        </main>
    )
}
