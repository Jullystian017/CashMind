"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function ResetPasswordForm() {
    const router = useRouter()
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (password !== confirmPassword) {
            setError("Passwords do not match.")
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.")
            return
        }

        setLoading(true)
        try {
            const supabase = createClient()
            const { error: err } = await supabase.auth.updateUser({
                password: password,
            })
            if (err) {
                setError(err.message ?? "Failed to update password.")
                setLoading(false)
                return
            }
            setSuccess(true)
            // Redirect after a short delay
            setTimeout(() => {
                router.push("/login")
            }, 3000)
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
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Set New Password</h1>
                <p className="text-gray-500 text-xs">
                    Please enter your new password below.
                </p>
            </div>

            {/* Form */}
            {success ? (
                <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold mb-1">Password updated</p>
                            <p className="text-emerald-700/80">Your password has been reset successfully. Redirecting you to login...</p>
                        </div>
                    </div>
                    <Link href="/login" className="block">
                        <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl">
                            Go to Sign In
                        </Button>
                    </Link>
                </div>
            ) : (
                <form className="space-y-4 text-gray-900" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-semibold text-gray-700">New Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-12 border-gray-200 rounded-xl pr-10 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">Confirm New Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="h-12 border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70">
                        {loading ? "Updating…" : "Update Password"}
                    </Button>
                </form>
            )}
        </div>
    )
}
