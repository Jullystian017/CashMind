"use server"

import { createClient } from "@/lib/supabase/server"

export interface ExportTransaction {
    id: string
    date: string
    description: string
    amount: number
    category: string
    type: 'income' | 'expense'
    paymentMethod: string
    status: string
    note?: string
}

export async function getExportData(month: number, year: number) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { data: null, error: "Not authenticated" };

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", firstDay.toISOString())
        .lte("date", lastDay.toISOString())
        .order("date", { ascending: false });

    if (error) return { data: null, error: error.message };

    const formattedData: ExportTransaction[] = data.map((tx: any) => ({
        id: tx.id,
        date: tx.date,
        description: tx.description,
        amount: tx.amount,
        category: tx.category,
        type: tx.type,
        paymentMethod: tx.payment_method || "Balance",
        status: tx.status || "success",
        note: tx.note
    }));

    return { data: formattedData, error: null };
}
