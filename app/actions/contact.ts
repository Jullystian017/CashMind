"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitContactForm(formData: {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
}) {
    try {
        const supabase = await createClient();

        const { error } = await supabase
            .from("contact_messages")
            .insert({
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                message: formData.message,
            });

        if (error) {
            console.error("Failed to submit contact message:", error);
            return { error: "Failed to send message. Please try again later." };
        }

        return { success: true };
    } catch (error) {
        console.error("Error submitting contact form:", error);
        return { error: "An unexpected error occurred." };
    }
}
