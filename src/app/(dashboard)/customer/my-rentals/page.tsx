
"use client";

import { useEffect, useState } from "react";
import { getMyRentals } from "@/lib/action/booking";
import Image from "next/image";

interface IBooking {
    _id: string;
    equipmentName: string;
    equipmentImage: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    totalAmount: number;
    currency: string;
    status: string;
    bookingStatus: string;
}

export default function MyRentalsPage() {
    const [rentals, setRentals] = useState<IBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const fetchRentals = async () => {
            try {
                const result = await getMyRentals();

                if (isMounted) {
                    setRentals(result.rentals || []);
                }
            } catch (error) {
                if (isMounted) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : "Failed to fetch your rentals."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchRentals();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return <div className="p-6">Loading your rentals...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-stone-900">
                My Rentals
            </h1>

            <p className="mt-2 text-stone-500">
                Manage your current and previous equipment rentals.
            </p>

            {rentals.length === 0 ? (
                <div className="mt-8 rounded-lg border border-stone-200 p-8 text-center">
                    <p className="text-stone-600">
                        You haven&apos;t booked any equipment yet.
                    </p>
                </div>
            ) : (
                <div className="mt-8 overflow-x-auto rounded-lg border border-stone-200">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-stone-100 text-stone-700">
                            <tr>
                                {/* <th className="whitespace-nowrap p-4">Photo</th> */}
                                <th className="whitespace-nowrap p-4">Equipment</th>
                                <th className="whitespace-nowrap p-4">Start Date</th>
                                <th className="whitespace-nowrap p-4">End Date</th>
                                <th className="whitespace-nowrap p-4">Booking Date</th>
                                <th className="whitespace-nowrap p-4">Total Amount</th>
                                <th className="whitespace-nowrap p-4">Payment Status</th>
                                <th className="whitespace-nowrap p-4">Booking Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {rentals.map((rental) => (
                                <tr key={rental._id} className="border-t border-stone-200">
                                    {/* <td className="p-4">
                                        <Image
                                            src={rental.equipmentImage}
                                            alt={rental.equipmentName}
                                            width={2}
                                            height={2}
                                            className="h-14 w-14 rounded-lg object-cover"
                                        />
                                    </td> */}
                                    <td className="whitespace-nowrap p-4 font-medium">
                                        {rental.equipmentName}
                                    </td>

                                    <td className="whitespace-nowrap p-4">
                                        {new Date(rental.startDate).toLocaleDateString()}
                                    </td>

                                    <td className="whitespace-nowrap p-4">
                                        {new Date(rental.endDate).toLocaleDateString()}
                                    </td>

                                    <td className="whitespace-nowrap p-4">
                                        {new Date(rental.createdAt).toLocaleDateString()}
                                    </td>

                                    <td className="whitespace-nowrap p-4">
                                        {rental.currency} {Number(rental.totalAmount).toFixed(2)}
                                    </td>

                                    <td className="whitespace-nowrap p-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${rental.status === "paid"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {rental.status}
                                        </span>
                                    </td>

                                    <td className="whitespace-nowrap p-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${rental.bookingStatus === "Confirmed"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {rental.bookingStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
