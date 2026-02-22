"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Eye, EyeOff, Chrome } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const savedEmail = sessionStorage.getItem("cashmind_temp_email")
        const savedPassword = sessionStorage.getItem("cashmind_temp_password")
        const queryEmail = searchParams.get("email")

        if (savedEmail) setEmail(savedEmail)
        else if (queryEmail) setEmail(queryEmail)

        if (savedPassword) setPassword(savedPassword)

        // Clear session storage after reading once to avoid persistent auto-fill if not intended
        // and for security and to clean up.
        // But maybe we keep it until they successfully login?
        // Let's clear it now.
        if (savedEmail || savedPassword) {
            sessionStorage.removeItem("cashmind_temp_email")
            sessionStorage.removeItem("cashmind_temp_password")
        }
    }, [searchParams])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            const supabase = createClient()
            const { error: err } = await supabase.auth.signInWithPassword({ email, password })
            if (err) {
                setError(err.message ?? "Invalid email or password.")
                setLoading(false)
                return
            }
            router.push("/dashboard")
            router.refresh()
        } catch {
            setError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        try {
            const supabase = createClient()
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })
            if (error) setError(error.message)
        } catch {
            setError("Failed to sign in with Google.")
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
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h1>
                <p className="text-gray-500 text-xs">
                    Enter your details to access your account.
                </p>
            </div>

            {/* Form */}
            <form className="space-y-4 text-gray-900" onSubmit={handleSubmit}>
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

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
                        <Link href="/forgot-password" className="text-xs font-bold text-blue-600 hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
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

                <Button type="submit" disabled={loading} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70">
                    {loading ? "Signing in…" : "Sign In"}
                </Button>

                <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-400">Or</span>
                    </div>
                </div>

                <Button
                    type="button"
                    onClick={handleGoogleSignIn}
                    variant="outline"
                    className="w-full h-12 border-gray-200 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                    <Chrome className="w-5 h-5 text-gray-600" />
                    Sign in with Google
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
                Don't have an account? <Link href="/register" className="text-blue-600 font-bold hover:underline">Sign Up</Link>
            </p>
        </div>
    )
}
