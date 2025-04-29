import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const login = req.query.login as string;

    const { data } = await supabase
        .from("memento_data") // your Supabase table
        .select("*")
        .eq("login", login);
    //   if (req.method === 'POST') {
    //     // Handle POST request
    //   } else if (req.method === 'GET') {
    //     // Handle GET request
    //   } else {
    //     res.status(405).end(); // Method Not Allowed
    //   }
    return res
        .status(200)
        .json({ message: "Good morning", data: data![0].dictionaries });
}
