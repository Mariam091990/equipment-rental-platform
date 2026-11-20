
"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { Eye, Package, RefreshCw } from "lucide-react";
import { IEquipment } from "@/types";


export default function MyEquipmentPage() {
    const [equipmentList, setEquipmentList] = useState<IEquipment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // const fetchMyEquipment = useCallback(async () => {
    //     try {


    //         const { data, error } = await authClient.token();

    //         if (error || !data?.token) {
    //             throw new Error("Please sign in again.");
    //         }

    //         const response = await fetch(
    //             `${process.env.NEXT_PUBLIC_API_URL}/owner/equipment`,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${data.token}`,
    //                 },
    //                 cache: "no-store",
    //             }
    //         );

    //         const result = await response.json();

    //         if (!response.ok) {
    //             throw new Error(result.message || "Failed to fetch equipment.");
    //         }

    //         setEquipmentList(result.equipment || []);
    //     } catch (error) {
    //         toast.error(
    //             error instanceof Error
    //                 ? error.message
    //                 : "Something went wrong."
    //         );
    //     } finally {
    //         setLoading(false);
    //     }
    // }, []);

    const fetchMyEquipment = useCallback(async (): Promise<IEquipment[]> => {
        const { data, error } = await authClient.token();

        if (error || !data?.token) {
            throw new Error("Please sign in again.");
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/owner/equipment`,
            {
                headers: {
                    Authorization: `Bearer ${data.token}`,
                },
                cache: "no-store",
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to fetch equipment.");
        }

        return result.equipment || [];
    }, []);

    useEffect(() => {
        let ignore = false;

        fetchMyEquipment()
            .then((equipment) => {
                if (!ignore) {
                    setEquipmentList(equipment);
                }
            })
            .catch((error) => {
                if (!ignore) {
                    toast.error(
                        error instanceof Error
                            ? error.message
                            : "Something went wrong."
                    );
                }
            })
            .finally(() => {
                if (!ignore) {
                    setLoading(false);
                }
            });

        return () => {
            ignore = true;
        };
    }, [fetchMyEquipment]);


    return (
        <div className="min-h-screen bg-[#FAF9F6] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Heading */}
                <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-stone-900">
                            My Equipment
                        </h1>
                        <p className="mt-1 text-sm text-stone-500">
                            Manage all the equipment you have listed for rent.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
    onClick={() => {
        setLoading(true);

        fetchMyEquipment()
            .then((equipment) => {
                setEquipmentList(equipment);
            })
            .catch((error) => {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong."
                );
            })
            .finally(() => {
                setLoading(false);
            });
    }}
    disabled={loading}
>
    <RefreshCw size={16} />
    Refresh
</button>

                        <Link
                            href="/owner/add-equipment"
                            className="flex items-center gap-2 rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-stone-700"
                        >
                            <Package size={16} />
                            Add Equipment
                        </Link>
                    </div>
                </div>

                {/* Equipment count */}
                <div className="mb-6 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-stone-500">Total Listed Equipment</p>
                    <p className="mt-2 text-3xl font-bold text-stone-900">
                        {equipmentList.length}
                    </p>
                </div>

                {/* Equipment table */}
                <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
                    <div className="border-b border-stone-200 px-5 py-4">
                        <h2 className="font-semibold text-stone-900">
                            Equipment List
                        </h2>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-16">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-300 border-t-stone-900" />
                        </div>
                    ) : equipmentList.length === 0 ? (
                        <div className="px-5 py-16 text-center">
                            <Package
                                size={42}
                                className="mx-auto mb-3 text-stone-400"
                            />
                            <h3 className="font-semibold text-stone-800">
                                No equipment found
                            </h3>
                            <p className="mt-1 text-sm text-stone-500">
                                You have not added any equipment yet.
                            </p>
                            <Link
                                href="/owner/add-equipment"
                                className="mt-5 inline-block rounded-lg bg-stone-900 px-5 py-2.5 text-sm text-white hover:bg-stone-700"
                            >
                                Add Your First Equipment
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-212 text-left text-sm">
                                <thead className="bg-stone-50 text-xs uppercase text-stone-500">
                                    <tr>
                                        <th className="px-5 py-4">Equipment</th>
                                        <th className="px-5 py-4">Category</th>
                                        <th className="px-5 py-4">Rental Price</th>
                                        <th className="px-5 py-4">Quantity</th>
                                        <th className="px-5 py-4">Status</th>
                                        <th className="px-5 py-4">Date Added</th>
                                        <th className="px-5 py-4">Details</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-stone-100">
                                    {equipmentList.map((item) => (
                                        <tr
                                            key={item._id}
                                            className="transition hover:bg-stone-50"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Image
                                                        src={item.equipmentImage}
                                                        alt={item.equipmentName}
                                                        width={55}
                                                        height={55}
                                                        unoptimized
                                                        className="h-14 w-14 rounded-lg border border-stone-200 object-cover"
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-stone-900">
                                                            {item.equipmentName}
                                                        </p>
                                                        <p className="mt-1 text-xs text-stone-500">
                                                            {item.brand} · {item.model}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-stone-600">
                                                {item.category}
                                            </td>

                                            <td className="px-5 py-4 font-medium text-stone-800">
                                                ৳{item.rentalPrice.toLocaleString("en-BD")}
                                                <span className="block text-xs font-normal text-stone-500">
                                                    / {item.rentalType}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-stone-600">
                                                {item.availableQuantity}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${item.status === "Approved"
                                                        ? "bg-green-100 text-green-700"
                                                        : item.status === "Rejected"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-amber-100 text-amber-700"
                                                        }`}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-stone-500">
                                                {new Date(item.createdAt).toLocaleDateString("en-GB")}
                                            </td>

                                            <td className="px-5 py-4">
                                                <Link
                                                    href={`/equipment/${item._id}`}
                                                    title="View equipment details"
                                                    className="inline-flex items-center gap-1 rounded-lg border border-stone-300 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100"
                                                >
                                                    <Eye size={14} />
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
