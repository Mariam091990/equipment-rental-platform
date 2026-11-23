
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft,
    Heart,
    MapPin,
    Package,
    ShieldCheck,
    Truck,
    Loader2,
    CalendarDays,
    Check,
    Tag,
} from "lucide-react";
import { addFavorite } from "@/lib/action/favorite";

interface IEquipment {
    _id: string;
    equipmentName: string;
    description: string;
    category: string;
    location: string;
    rentalPrice: number;
    rentalType: string;
    availableQuantity: number;
    equipmentCondition: string;
    brand: string;
    model: string;
    equipmentImage: string;
    rentalTerms: string;
    status: string;
    createdAt: string;
}

export default function EquipmentDetailsClient({
    id,
}: {
    id: string;
}) {
    const [equipment, setEquipment] = useState<IEquipment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [addingFavorite, setAddingFavorite] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        let active = true;

        async function fetchEquipment() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/equipment/${id}`,
                    { cache: "no-store" }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || "Unable to load equipment."
                    );
                }

                if (active) {
                    setEquipment(result.equipment);
                }
            } catch (err) {
                if (active) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Something went wrong."
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        }

        fetchEquipment();

        return () => {
            active = false;
        };
    }, [id]);

    async function handleAddFavorite() {
        if (!equipment) return;

        try {
            setAddingFavorite(true);
            setMessage("");

            const result = await addFavorite({
                equipmentId: equipment._id,
                equipmentName: equipment.equipmentName,
                description: equipment.description,
                category: equipment.category,
                location: equipment.location,
                rentalPrice: equipment.rentalPrice,
                rentalType: equipment.rentalType,
                availableQuantity: equipment.availableQuantity,
                equipmentImage: equipment.equipmentImage,
                brand: equipment.brand,
                model: equipment.model,
                status: equipment.status,
                createdAt: equipment.createdAt,
            });

            setIsFavorite(true);
            setMessage(result.message || "Saved to your favorites.");
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Unable to save favorite.";

            if (errorMessage.toLowerCase().includes("already")) {
                setIsFavorite(true);
                setMessage("This equipment is already in your favorites.");
            } else {
                setMessage(errorMessage);
            }
        } finally {
            setAddingFavorite(false);
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-[65vh] items-center justify-center bg-[#f7f8fa]">
                <div className="text-center">
                    <Loader2 className="mx-auto h-9 w-9 animate-spin text-slate-700" />
                    <p className="mt-4 text-sm text-slate-500">
                        Loading equipment...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !equipment) {
        return (
            <main className="flex min-h-[65vh] flex-col items-center justify-center bg-[#f7f8fa] px-5 text-center">
                <Package size={48} className="text-slate-300" />
                <h1 className="mt-5 text-2xl font-bold text-slate-900">
                    Equipment unavailable
                </h1>
                <p className="mt-2 max-w-md text-sm text-slate-500">
                    {error || "We couldn't find this equipment."}
                </p>
                <Link
                    href="/AllEquipment"
                    className="mt-6 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700"
                >
                    Browse equipment
                </Link>
            </main>
        );
    }

    const available = equipment.availableQuantity > 0;

    return (
        <main className="min-h-screen bg-[#f7f8fa] pb-16 text-slate-900">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <div className="mb-7 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                    <Link href="/" className="hover:text-slate-900">
                        Home
                    </Link>
                    <span>/</span>
                    <Link href="/AllEquipment" className="hover:text-slate-900">
                        Equipment
                    </Link>
                    <span>/</span>
                    <span className="font-medium text-slate-800">
                        {equipment.equipmentName}
                    </span>
                </div>

                {/* Product heading */}
                <div className="mb-8">
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                        <span className="rounded-md bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                            {equipment.category}
                        </span>
                        <span
                            className={`flex items-center gap-1.5 text-xs font-semibold ${available ? "text-emerald-700" : "text-red-600"
                                }`}
                        >
                            <span
                                className={`h-2 w-2 rounded-full ${available ? "bg-emerald-500" : "bg-red-500"
                                    }`}
                            />
                            {available ? "Available for rent" : "Currently unavailable"}
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                        {equipment.equipmentName}
                    </h1>

                    <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                        <MapPin size={16} />
                        {equipment.location}
                    </p>
                </div>

                {/* Main two-column layout */}
                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.4fr_0.8fr]">

                    {/* Left column */}
                    <div className="space-y-7">

                        {/* Product image */}
                        <div className="relative flex aspect-4/3 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-10">
                            {equipment.equipmentImage ? (
                                <Image
                                    src={equipment.equipmentImage}
                                    alt={equipment.equipmentName}
                                    fill
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 65vw"
                                    className="object-contain p-5 sm:p-8"
                                />
                            ) : (
                                <div className="text-center text-slate-400">
                                    <Package size={55} className="mx-auto" />
                                    <p className="mt-3 text-sm">No image available</p>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                            <h2 className="text-xl font-bold tracking-tight">
                                Product overview
                            </h2>
                            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
                                {equipment.description || "No description provided."}
                            </p>
                        </section>

                        {/* Specifications */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-slate-100 p-2.5">
                                    <Tag size={19} />
                                </div>
                                <h2 className="text-xl font-bold tracking-tight">
                                    Technical specifications
                                </h2>
                            </div>

                            <div className="mt-6 grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-y-0">
                                <Specification label="Brand" value={equipment.brand} />
                                <Specification label="Model" value={equipment.model} />
                                <Specification
                                    label="Category"
                                    value={equipment.category}
                                />
                                <Specification
                                    label="Condition"
                                    value={equipment.equipmentCondition}
                                />
                                <Specification
                                    label="Rental period"
                                    value={equipment.rentalType}
                                />
                                <Specification
                                    label="Available units"
                                    value={String(equipment.availableQuantity)}
                                />
                            </div>
                        </section>

                        {/* Terms */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                            <h2 className="flex items-center gap-3 text-xl font-bold">
                                <CalendarDays size={21} />
                                Rental terms and conditions
                            </h2>
                            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
                                {equipment.rentalTerms || "No additional rental terms provided."}
                            </p>
                        </section>
                    </div>

                    {/* Right column - Rental summary */}
                    <aside className="lg:sticky lg:top-6">
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                            <div className="border-b border-slate-100 p-6">
                                <p className="text-sm font-medium text-slate-500">
                                    Rental rate
                                </p>

                                <div className="mt-2 flex items-baseline gap-2">
                                    <span className="text-4xl font-bold tracking-tight text-slate-950">
                                        ${equipment.rentalPrice.toLocaleString()}
                                    </span>
                                    <span className="text-sm text-slate-500">
                                        / {equipment.rentalType}
                                    </span>
                                </div>

                                <p className="mt-2 text-xs text-slate-400">
                                    Final rental cost depends on the booking duration and quantity.
                                </p>
                            </div>

                            <div className="space-y-5 p-6">

                                {/* Availability */}
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-emerald-50 p-2.5">
                                        <Package size={19} className="text-emerald-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">
                                            {available ? "In stock" : "Out of stock"}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {equipment.availableQuantity} units available
                                        </p>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-slate-100 p-2.5">
                                        <Truck size={19} className="text-slate-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">
                                            Equipment location
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {equipment.location}
                                        </p>
                                    </div>
                                </div>

                                {/* Listing status */}
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-slate-100 p-2.5">
                                        <ShieldCheck size={19} className="text-slate-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">
                                            Listing status
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {equipment.status}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-5">
                                    <button
                                        onClick={handleAddFavorite}
                                        disabled={addingFavorite || isFavorite}
                                        className={`flex w-full items-center justify-center gap-2 rounded-xl border px-5 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed ${isFavorite
                                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                : "border-slate-300 bg-white text-slate-800 hover:border-slate-500 hover:bg-slate-50"
                                            }`}
                                    >
                                        {addingFavorite ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : isFavorite ? (
                                            <Check size={18} />
                                        ) : (
                                            <Heart size={18} />
                                        )}

                                        {addingFavorite
                                            ? "Saving..."
                                            : isFavorite
                                                ? "Saved to favorites"
                                                : "Add to favorites"}
                                    </button>

                                    {message && (
                                        <p className="mt-3 text-center text-xs text-slate-600">
                                            {message}
                                        </p>
                                    )}

                                    <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                                        Save this listing and return to it whenever you need it.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Link
                            href="/AllEquipment"
                            className="mt-4 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
                        >
                            <ArrowLeft size={16} />
                            Back to all equipment
                        </Link>
                    </aside>
                </div>
            </div>
        </main>
    );
}

function Specification({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="border-b border-slate-100 py-4 first:pt-0 last:border-b-0 sm:px-4 sm:even:border-l sm:even:pl-6">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                {label}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-800">
                {value || "Not specified"}
            </p>
        </div>
    );
}
