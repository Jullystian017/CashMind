"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "./ui/button"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"

export function OTPForm() {
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null)
    ]
    const [isSuccess, setIsSuccess] = useState(false)
    const router = useRouter()

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value.slice(-1)
        setOtp(newOtp)

        // Move to next input if value is entered
        if (value && index < 5) {
            inputRefs[index + 1].current?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs[index - 1].current?.focus()
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const code = otp.join("")
        if (code.length === 6) {
            setIsSuccess(true)
            setTimeout(() => {
                router.push('/dashboard?onboarding=true')
            }, 2000)
        }
    }

    if (isSuccess) {
        return (
            <div className="w-full max-w-md mx-auto pt-12 pb-8 px-6 lg:py-8 lg:px-0 text-center">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                    <CheckCircle2 className="w-10 h-10" />
                </motion.div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-black text-gray-900 leading-tight">Registration Successful!</h1>
                    <p className="text-gray-500 text-sm font-medium">Your account is now verified. <br /> Redirecting to dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-md mx-auto pt-12 pb-8 px-6 lg:py-8 lg:px-0">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 mb-8 group w-fit">
                <div className="relative w-8 h-8 transition-transform group-hover:scale-105">
                    <Image
                        src="/cashmind-logo.png"
                        alt="CashMind Logo"
                        fill
                        className="object-contain"
                    />
                </div>
                <span className="text-xl font-bold tracking-tight text-gray-900 font-inter">
                    CashMind
                </span>
            </Link>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">OTP Verification</h1>
                <p className="text-gray-500 text-xs">
                    Discover the power of AI to enhance business efficiency.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex justify-between gap-2 sm:gap-4">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={inputRefs[index]}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-full h-14 sm:h-16 text-center text-2xl sm:text-3xl font-bold border-2 border-gray-100 rounded-2xl focus:border-blue-600 focus:ring-0 focus:outline-none transition-all"
                        />
                    ))}
                </div>

                <div className="space-y-3">
                    <Button
                        type="submit"
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                    >
                        Verify
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full h-12 border-2 border-gray-100 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                    >
                        Resend
                    </Button>
                </div>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500 font-medium">
                Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
            </p>
        </div>
    )
}
