import { ResetPasswordForm } from "@/components/reset-password-form"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Reset Password - CashMind",
    description: "Set a new password for your CashMind account.",
}

export default function ResetPasswordPage() {
    return (
        <main className="min-h-screen bg-white flex flex-col justify-center">
            <ResetPasswordForm />
        </main>
    )
}
