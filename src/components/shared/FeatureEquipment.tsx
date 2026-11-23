
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowRight,
    ArrowUpRight,
    MapPin,
    Package,
  
    Loader2,
} from "lucide-react";

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
    status: string;
}

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
        },
    },
};

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 30,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut" as const,
        },
    },
};

export default function FeaturedEquipment() {
    const [equipment, setEquipment] = useState<IEquipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function fetchFeaturedEquipment() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/featured-equipment`,
                    { cache: "no-store" }
                );

                if (!response.ok) {
                    throw new Error("Unable to load featured equipment.");
                }

                const result = await response.json();

                if (!result.success) {
                    throw new Error(
                        result.message || "Failed to load equipment."
                    );
                }

                if (active) {
                    setEquipment(result.equipment || []);
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

        fetchFeaturedEquipment();

        return () => {
            active = false;
        };
    }, []);

    return (
        <section className="bg-slate-50 px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
            <div className="mx-auto max-w-7xl">

                {/* Section heading */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
                >
                    <div className="max-w-2xl">
                        <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                            Handpicked for Your Projects
                        </span>

                        <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                            Featured
                            <span className="text-blue-600"> Equipment</span>
                        </h2>

                        <p className="mt-4 text-base leading-7 text-slate-500 sm:text-lg">
                            Explore our latest approved equipment listings.
                            Find reliable tools and machinery for your next project.
                        </p>
                    </div>

                    <Link
                        href="/AllEquipment"
                        className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-blue-600 transition hover:gap-3"
                    >
                        View All Equipment
                        <ArrowRight size={18} />
                    </Link>
                </motion.div>

                {/* Loading state */}
                {loading && (
                    <div className="flex min-h-64 flex-col items-center justify-center">
                        <Loader2 className="h-9 w-9 animate-spin text-blue-600" />
                        <p className="mt-4 text-sm text-slate-500">
                            Loading featured equipment...
                        </p>
                    </div>
                )}

                {/* Error state */}
                {!loading && error && (
                    <div className="rounded-2xl border border-red-100 bg-white p-10 text-center">
                        <p className="font-semibold text-red-600">{error}</p>
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && equipment.length === 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                        <Package className="mx-auto h-12 w-12 text-slate-300" />

                        <h3 className="mt-4 text-lg font-bold text-slate-800">
                            No Featured Equipment Yet
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Approved equipment listings will appear here.
                        </p>
                    </div>
                )}

                {/* Equipment cards */}
                {!loading && !error && equipment.length > 0 && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {equipment.map((item) => (
                            <motion.article
                                key={item._id}
                                variants={cardVariants}
                                whileHover={{ y: -6 }}
                                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-200/70"
                            >
                                {/* Equipment image */}
                                <Link
                                    href={`/equipment/${item._id}`}
                                    className="relative block h-56 overflow-hidden bg-slate-100"
                                >
                                    {item.equipmentImage ? (
                                        <Image
                                            src={item.equipmentImage}
                                            alt={item.equipmentName}
                                            fill
                                            unoptimized
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-slate-400">
                                            <Package size={45} />
                                        </div>
                                    )}

                                    <span className="absolute left-4 top-4 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                                        Approved
                                    </span>

                                    <span className="absolute bottom-4 left-4 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
                                        {item.category}
                                    </span>
                                </Link>

                                {/* Card content */}
                                <div className="p-5">

                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <h3 className="line-clamp-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                                                {item.equipmentName}
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {item.brand} {item.model}
                                            </p>
                                        </div>

                                        <span className="shrink-0 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                            {item.equipmentCondition}
                                        </span>
                                    </div>

                                    <p className="mt-4 line-clamp-2 min-h-12 text-sm leading-6 text-slate-500">
                                        {item.description}
                                    </p>

                                    {/* Location and availability */}
                                    <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <MapPin size={16} className="shrink-0 text-blue-600" />
                                            <span className="line-clamp-1">
                                                {item.location}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                                            <span className="flex items-center gap-2 text-slate-500">
                                                <Package size={16} className="text-blue-600" />
                                                Available Quantity
                                            </span>

                                            <span className="font-semibold text-slate-800">
                                                {item.availableQuantity}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Price and details button */}
                                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
                                        <div>
                                            <p className="text-xs text-slate-400">
                                                Rental Price
                                            </p>

                                            <p className="mt-1 text-xl font-extrabold text-blue-600">
                                                ${Number(item.rentalPrice).toLocaleString()}
                                                <span className="ml-1 text-xs font-medium text-slate-500">
                                                    / {item.rentalType}
                                                </span>
                                            </p>
                                        </div>

                                        <Link
                                            href={`/equipment/${item._id}`}
                                            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
                                        >
                                            Details
                                            <ArrowUpRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </motion.div>
                )}

                {/* Bottom CTA */}
                {!loading && !error && equipment.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mt-12 text-center"
                    >
                        <Link
                            href="/AllEquipment"
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-bold text-slate-700 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                        >
                            Explore All Equipment
                            <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
