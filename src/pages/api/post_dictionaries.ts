import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { login, dictionaries } = req.body;

    if (req.method === "POST") {
        await supabase
            .from("memento_data")
            .update({ dictionaries })
            .eq("login", login);
    } else {
        res.status(405).end(); // Method Not Allowed
    }
    return res.status(200).json({ message: "Row updated" });
}
