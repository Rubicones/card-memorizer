import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Missing access token" });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  const { dictionaries } = req.body;
  if (!dictionaries) {
    return res.status(400).json({ error: "Missing dictionaries payload" });
  }

  // Step 1: Try to update existing row
  const { data: updateData, error: updateError } = await supabase
    .from("memento_data")
    .update({ dictionaries })
    .eq("user_id", user.id)
    .select(); // important to get `data` back to check if anything was updated

  if (updateError) {
    return res.status(500).json({ error: "Update failed", details: updateError.message });
  }

  // Step 2: If no existing row was updated, insert new one
  if (!updateData || updateData.length === 0) {
    const { error: insertError } = await supabase
      .from("memento_data")
      .insert({ user_id: user.id, dictionaries });

    if (insertError) {
      return res.status(500).json({ error: "Insert failed", details: insertError.message });
    }

    return res.status(200).json({ message: "New row inserted" });
  }

  return res.status(200).json({ message: "Row updated" });
}
