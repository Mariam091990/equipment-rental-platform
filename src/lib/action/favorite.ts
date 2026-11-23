
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface IFavoritePayload {
    equipmentId: string;
    equipmentName: string;
    description: string;
    category: string;
    location: string;
    rentalPrice: number;
    rentalType: string;
    availableQuantity: number;
    equipmentImage: string;
    brand?: string;
    model?: string;
    status: string;
    createdAt: string;
}

interface IFavoriteResponse {
    success: boolean;
    message?: string;
    count?: number;
    favorites?: IFavoritePayload[];
}

// Add equipment to favorites
export async function addFavorite(payload: IFavoritePayload) {
    try {
        const { data, error } = await authClient.token();

        if (error || !data?.token) {
            throw new Error("Please sign in again.");
        }

        const response = await fetch(`${API_URL}/favorites`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${data.token}`,
            },
            body: JSON.stringify(payload),
            cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to add favorite.");
        }

        return result;
    } catch (error) {
        console.error("Add favorite error:", error);
        throw error;
    }
}

// Get logged-in customer's favorites
export async function getFavorites() {
    try {
        const { data, error } = await authClient.token();

        if (error || !data?.token) {
            throw new Error("Please sign in again.");
        }

        const response = await fetch(`${API_URL}/favorites`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${data.token}`,
            },
            cache: "no-store",
        });

        const result: IFavoriteResponse = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to fetch favorites.");
        }

        return result;
    } catch (error) {
        console.error("Fetch favorites error:", error);
        throw error;
    }
}

// Remove equipment from favorites
export async function removeFavorite(favoriteId: string) {
    try {
        const { data, error } = await authClient.token();

        if (error || !data?.token) {
            throw new Error("Please sign in again.");
        }

        const response = await fetch(`${API_URL}/favorites/${favoriteId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${data.token}`,
            },
            cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to remove favorite.");
        }

        return result;
    } catch (error) {
        console.error("Remove favorite error:", error);
        throw error;
    }
}
