"use client"

import { LoginForm } from "@/components/login-form"
import { AuthPreview } from "@/components/auth-preview"

export default function LoginPage() {
    return (
        <main className="h-screen flex flex-col lg:flex-row bg-white font-inter overflow-hidden">
            {/* Left Side: Form */}
            <section className="flex-1 flex flex-col justify-center items-center py-6 lg:py-0 overflow-y-auto">
                <LoginForm />
            </section>

            {/* Right Side: Visual Preview */}
            <section className="hidden lg:block flex-1">
                <AuthPreview />
            </section>
        </main>
    )
}
