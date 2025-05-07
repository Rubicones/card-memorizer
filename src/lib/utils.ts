import { Dictionaries } from "@/app/page";
import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
export const updateDictionaries = (newDictionaries: Dictionaries) => {
    return axios.post(
        "/api/post_dictionaries",
        {
            dictionaries: newDictionaries,
        },
        {
            headers: {
                Authorization: `Bearer ${
                    JSON.parse(
                        localStorage.getItem(
                            "sb-eecgcvumtskvsmesfbem-auth-token"
                        ) as string
                    ).access_token
                }`,
            },
        }
    );
};
