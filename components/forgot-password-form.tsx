"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { ArrowLeft, Mail } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function ForgotPasswordForm() {
    const [email, setEmail] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            const supabase = createClient()
            const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            })
            if (err) {
                setError(err.message ?? "Failed to send reset email.")
                setLoading(false)
                return
            }
            setSuccess(true)
        } catch {
            setError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
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
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Forgot Password?</h1>
                <p className="text-gray-500 text-xs">
                    No worries, we'll send you reset instructions.
                </p>
            </div>

            {/* Form */}
            {success ? (
                <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-start gap-3">
                        <Mail className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold mb-1">Check your email</p>
                            <p className="text-emerald-700/80">We've sent a password reset link to <span className="font-bold text-emerald-800">{email}</span></p>
                        </div>
                    </div>
                    <Link href="/login" className="block">
                        <Button variant="outline" className="w-full h-12 border-gray-200 rounded-xl font-bold flex items-center justify-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Sign In
                        </Button>
                    </Link>
                </div>
            ) : (
                <form className="space-y-6 text-gray-900" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="william@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-12 border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70">
                        {loading ? "Sending link…" : "Reset Password"}
                    </Button>

                    <Link href="/login" className="flex items-center justify-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Sign In
                    </Link>
                </form>
            )}
        </div>
    )
}
