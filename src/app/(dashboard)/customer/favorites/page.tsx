
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Trash2, RefreshCw } from "lucide-react";
import { getFavorites, removeFavorite } from "@/lib/action/favorite";

interface IFavorite {
    _id?: string;
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
    favoritedAt?: string;
   
}

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<IFavorite[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [message, setMessage] = useState("");

    const fetchFavorites = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const result = await getFavorites();

            if (result.success) {
                setFavorites(result.favorites || []);
            } else {
                throw new Error(result.message || "Failed to load favorites.");
            }
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong while loading favorites."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let active = true;

        const loadFavorites = async () => {
            try {
                setError("");
                const result = await getFavorites();

                if (!active) return;

                if (result.success) {
                    setFavorites(result.favorites || []);
                } else {
                    setError(result.message || "Failed to load favorites.");
                }
            } catch (error) {
                if (!active) return;

                setError(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong while loading favorites."
                );
            } finally {
                if (active) setLoading(false);
            }
        };

        loadFavorites();

        return () => {
            active = false;
        };
    }, []);

    const handleRemoveFavorite = async (favoriteId: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to remove this equipment from your favorites?"
        );

        if (!confirmed) return;

        try {
            setRemovingId(favoriteId);
            setMessage("");
            setError("");

            const result = await removeFavorite(favoriteId);

            if (result.success) {
                setFavorites((previous) =>
                    previous.filter((favorite) => favorite._id !== favoriteId)
                );
                setMessage("Favorite removed successfully.");
            } else {
                throw new Error(result.message || "Failed to remove favorite.");
            }
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to remove favorite."
            );
        } finally {
            setRemovingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                    <p className="mt-4 text-gray-500">Loading your favorites...</p>
                </div>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="flex items-center gap-3">
                            <Heart className="h-7 w-7 fill-red-500 text-red-500" />
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                My Favorites
                            </h1>
                        </div>

                        <p className="mt-2 text-sm text-gray-500">
                            Manage the equipment you have saved for later.
                        </p>
                    </div>

                    <div className="rounded-lg bg-white px-5 py-3 shadow-sm">
                        <p className="text-sm text-gray-500">Saved Equipment</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {favorites.length}
                        </p>
                    </div>
                </div>

                {/* Success message */}
                {message && (
                    <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {message}
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <span>{error}</span>
                        <button
                            onClick={fetchFavorites}
                            className="inline-flex items-center gap-2 font-semibold hover:underline"
                        >
                            <RefreshCw size={15} />
                            Try again
                        </button>
                    </div>
                )}

                {/* Empty state */}
                {!error && favorites.length === 0 && (
                    <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
                        <Heart className="mx-auto h-14 w-14 text-gray-300" />

                        <h2 className="mt-5 text-xl font-semibold text-gray-800">
                            No Favorites Yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                            You have not saved any equipment yet. Explore our equipment
                            collection and add your favorites.
                        </p>

                        <Link
                            href="/AllEquipment"
                            className="mt-6 inline-flex rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Browse Equipment
                        </Link>
                    </div>
                )}

                {/* Favorites grid */}
                {favorites.length > 0 && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {favorites.map((favorite) => (
                            <div
                                key={favorite._id}
                                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                {/* Equipment image */}
                                <div className="relative h-52 w-full bg-gray-100">
                                    {favorite.equipmentImage ? (
                                        <Image
                                            src={favorite.equipmentImage}
                                            alt={favorite.equipmentName}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-gray-400">
                                            No image available
                                        </div>
                                    )}

                                    <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700 shadow">
                                        {favorite.category}
                                    </span>

                                    <span className="absolute right-3 top-3 rounded-full bg-white p-2 shadow">
                                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                                    </span>
                                </div>

                                {/* Equipment details */}
                                <div className="p-5">
                                    <h2 className="truncate text-lg font-bold text-gray-900">
                                        {favorite.equipmentName}
                                    </h2>

                                    {(favorite.brand || favorite.model) && (
                                        <p className="mt-1 text-sm text-gray-500">
                                            {[favorite.brand, favorite.model]
                                                .filter(Boolean)
                                                .join(" • ")}
                                        </p>
                                    )}

                                    <p className="mt-3 line-clamp-2 min-h-10 text-sm text-gray-600">
                                        {favorite.description}
                                    </p>

                                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                                        <MapPin size={16} />
                                        <span className="truncate">{favorite.location}</span>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Rental Price</p>
                                            <p className="text-lg font-bold text-blue-600">
                                                ${favorite.rentalPrice}
                                                <span className="text-xs font-normal text-gray-500">
                                                    {" "}/ {favorite.rentalType}
                                                </span>
                                            </p>
                                        </div>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${favorite.availableQuantity > 0
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {favorite.availableQuantity > 0
                                                ? "Available"
                                                : "Unavailable"}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-5 flex gap-3">
                                        <Link
                                            href={`/equipment/${favorite.equipmentId}`}
                                            className="flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                                        >
                                            View Details
                                        </Link>

                                        <button
                                            onClick={() => favorite._id && handleRemoveFavorite(favorite._id)}
                                            disabled={!favorite._id || removingId === favorite._id}
                                            aria-label="Remove from favorites"
                                            className="flex items-center justify-center rounded-lg border border-red-200 px-4 py-2.5 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {removingId === favorite._id ? (
                                                <span className="text-xs">Removing...</span>
                                            ) : (
                                                <Trash2 size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
