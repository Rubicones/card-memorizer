import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

  const { data, error } = await supabase
    .from("memento_data")
    .select("dictionaries")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: "DB error", details: error.message });
  }

  if (!data) {
    return res.status(404).json({ error: "No data found for user" });
  }

  return res.status(200).json({ data: data.dictionaries });
}
