import { ForgotPasswordForm } from "@/components/forgot-password-form"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Forgot Password - CashMind",
    description: "Reset your CashMind account password.",
}

export default function ForgotPasswordPage() {
    return (
        <main className="min-h-screen bg-white flex flex-col justify-center">
            <ForgotPasswordForm />
        </main>
    )
}
