"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Checkbox } from "./ui/checkbox"
import { Eye, EyeOff, Chrome } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function RegisterForm() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [agreed, setAgreed] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!agreed) {
            setError("You must agree to the Terms & Privacy policy.")
            return
        }

        setLoading(true)
        try {
            const supabase = createClient()
            const { error: err } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: name || undefined },
                    emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/dashboard?onboarding=true` : undefined,
                },
            })
            if (err) {
                setError(err.message ?? "Registration failed.")
                setLoading(false)
                return
            }

            // Save credentials for auto-fill on login page
            if (typeof window !== "undefined") {
                sessionStorage.setItem("cashmind_temp_email", email)
                sessionStorage.setItem("cashmind_temp_password", password)
            }

            setSuccess(true)
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
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Get Started Now</h1>
                <p className="text-gray-500 text-xs">
                    Discover the power of AI to manage your finances more efficiently.
                </p>
            </div>

            {/* Form */}
            {success ? (
                <div className="space-y-4 text-gray-900">
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
                        Check your email to confirm your account. Then you can sign in.
                    </div>
                    <Link href={`/login?email=${encodeURIComponent(email)}`} className="block">
                        <Button type="button" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl">
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
                        <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Name</Label>
                        <Input
                            id="name"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-12 border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

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
                        <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
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

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="terms"
                            className="rounded-md border-gray-300"
                            checked={agreed}
                            onCheckedChange={(checked) => setAgreed(!!checked)}
                        />
                        <label
                            htmlFor="terms"
                            className="text-sm text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            I agree to the <Link href="/terms" className="text-gray-900 font-semibold hover:underline">Terms & Privacy</Link>
                        </label>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70">
                        {loading ? "Signing up…" : "Sign Up"}
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
                        Sign up with Google
                    </Button>
                </form>
            )}

            <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
            </p>
        </div>
    )
}
