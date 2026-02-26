"use server"

import { createClient } from "@/lib/supabase/server"

export interface SplitBill {
    id: string
    title: string
    total_amount: number
    payer: string
    status: string
    created_at: string
    participant_count: number
    paid_count: number
}

export interface SplitParticipant {
    id: string
    split_bill_id: string
    name: string
    amount: number
    is_paid: boolean
    created_at: string
}

export interface SplitBillDetail extends Omit<SplitBill, 'participant_count' | 'paid_count'> {
    participants: SplitParticipant[]
}

// Fetch all split bills for the current user
export async function getSplitBills() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: "Not authenticated" }

    const { data: bills, error } = await supabase
        .from("split_bills")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

    if (error) return { data: null, error: error.message }

    // fetch participant counts for each bill
    const billIds = bills.map(b => b.id)
    const { data: participants } = await supabase
        .from("split_participants")
        .select("split_bill_id, is_paid")
        .in("split_bill_id", billIds)

    const result: SplitBill[] = bills.map(bill => {
        const billParticipants = (participants || []).filter(p => p.split_bill_id === bill.id)
        return {
            ...bill,
            participant_count: billParticipants.length,
            paid_count: billParticipants.filter(p => p.is_paid).length
        }
    })

    return { data: result, error: null }
}

// Fetch a single split bill with its participants
export async function getSplitBillDetail(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: "Not authenticated" }

    const { data: bill, error: billError } = await supabase
        .from("split_bills")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single()

    if (billError) return { data: null, error: billError.message }

    const { data: participants, error: partError } = await supabase
        .from("split_participants")
        .select("*")
        .eq("split_bill_id", id)
        .order("created_at", { ascending: true })

    if (partError) return { data: null, error: partError.message }

    const result: SplitBillDetail = {
        ...bill,
        participants: participants || []
    }

    return { data: result, error: null }
}

// Create a new split bill with participants
export async function createSplitBill(data: {
    title: string
    totalAmount: number
    payer: string
    participants: { name: string; amount: number }[]
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: "Not authenticated" }

    // Insert the bill
    const { data: bill, error: billError } = await supabase
        .from("split_bills")
        .insert({
            user_id: user.id,
            title: data.title,
            total_amount: data.totalAmount,
            payer: data.payer,
            status: "active"
        })
        .select()
        .single()

    if (billError) return { data: null, error: billError.message }

    // Insert participants
    if (data.participants.length > 0) {
        const participantRows = data.participants.map(p => ({
            split_bill_id: bill.id,
            name: p.name,
            amount: p.amount,
            is_paid: false
        }))

        const { error: partError } = await supabase
            .from("split_participants")
            .insert(participantRows)

        if (partError) return { data: null, error: partError.message }
    }

    return { data: bill, error: null }
}

// Toggle a participant's paid status
export async function toggleParticipantPaid(participantId: string) {
    const supabase = await createClient()

    // Get current status
    const { data: current, error: getError } = await supabase
        .from("split_participants")
        .select("is_paid")
        .eq("id", participantId)
        .single()

    if (getError) return { error: getError.message }

    const { error } = await supabase
        .from("split_participants")
        .update({ is_paid: !current.is_paid })
        .eq("id", participantId)

    if (error) return { error: error.message }
    return { error: null }
}

// Settle an entire bill
export async function settleBill(billId: string) {
    const supabase = await createClient()

    // Mark all participants as paid
    const { error: partError } = await supabase
        .from("split_participants")
        .update({ is_paid: true })
        .eq("split_bill_id", billId)

    if (partError) return { error: partError.message }

    // Mark bill as settled
    const { error } = await supabase
        .from("split_bills")
        .update({ status: "settled" })
        .eq("id", billId)

    if (error) return { error: error.message }
    return { error: null }
}

// Delete a split bill (cascade deletes participants)
export async function deleteSplitBill(billId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from("split_bills")
        .delete()
        .eq("id", billId)

    if (error) return { error: error.message }
    return { error: null }
}
