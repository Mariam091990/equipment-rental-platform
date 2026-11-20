
"use client";

import { authClient } from "@/lib/auth-client";

export default function TestAuthPage() {

    const handleTokenTest = async () => {
        try {
            const { data, error } = await authClient.token();

            if (error) {
                console.error("Token error:", error);
                alert("Failed to retrieve token");
                return;
            }

            console.log("JWT:", data?.token);
            alert("Token retrieved successfully! Check your console.");
        } catch (error) {
            console.error(error);
        }
   



const { data, error } = await authClient.token();

if (error || !data?.token) {
    console.error("Token error:", error);
    return;
}

const response = await fetch("http://localhost:5000/owner-check", {
    headers: {
        Authorization: `Bearer ${data.token}`,
    },
});

const result = await response.json();

console.log("Owner check:", result);
    }

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">
                Better Auth JWT Test
            </h1>

            <button
                onClick={handleTokenTest}
                className="bg-blue-600 text-white px-5 py-3 rounded-lg"
            >
                Test JWT Token
            </button>
        </div>
    );
}
