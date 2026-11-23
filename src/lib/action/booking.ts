

// export async function createBooking(payload: {
//     equipmentId: string,
//     userEmail: string

// }) {

//     try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/create-checkout-session`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(payload),
//             cache: "no-store",
//             signal: AbortSignal.timeout(20000),
//         });

//         const data = await response.json();

//         if (!response.ok) {
//             throw new Error(data.message || "Error creating booking");
//         }

//         return data;

//     } catch (error) {
//         console.error("Error creating booking:", error);
//         throw error;
//     }

// }


import { authClient } from "@/lib/auth-client";

interface IBookingPayload {
    equipmentId: string;
    equipmentName:string,
    startDate: string;
    endDate: string;
    rentalDuration: number;
    rentalPeriods: number;
    quantity: number;
    customerPhone: string;
    deliveryAddress: string;
    bookingNotes?: string;
    userEmail: string
}

interface IBookingResponse {
    success: boolean;
    message?: string;
    data?: string;
    url?: string;
}

export async function createBooking(payload: IBookingPayload) {
    try {
        // Get the Better Auth JWT
        const { data, error } = await authClient.token();

        if (error || !data?.token) {
            throw new Error("Please sign in again.");
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/payments/create-checkout-session`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${data.token}`,
                },
                body: JSON.stringify(payload),
                cache: "no-store",
                signal: AbortSignal.timeout(20000),
            }
        );

        const result: IBookingResponse = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Error creating booking");
        }

        return result;
    } catch (error) {
        console.error("Error creating booking:", error);
        throw error;
    }
}





export async function getMyRentals() {
    try {
        // Get the Better Auth JWT
        const { data, error } = await authClient.token();

        if (error || !data?.token) {
            throw new Error("Please sign in again.");
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/customer/my-rentals`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${data.token}`,
                },
                cache: "no-store",
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to fetch rentals.");
        }

        return result;

    } catch (error) {
        console.error("Error fetching rentals:", error);
        throw error;
    }
}
