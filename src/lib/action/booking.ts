

export async function createBooking(payload: {
    equipmentId: string,
    userEmail: string

}) {

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/create-checkout-session`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            cache: "no-store",
            signal: AbortSignal.timeout(20000),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error creating booking");
        }

        return data;

    } catch (error) {
        console.error("Error creating booking:", error);
        throw error;
    }

}