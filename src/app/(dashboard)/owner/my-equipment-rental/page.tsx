
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    RefreshCw,
    Search,
    Package,
    UserRound,
    MapPin,
    Phone,
    CreditCard,
    ClipboardList,
    Inbox,
    AlertCircle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

interface IRental {
    _id: string;
    equipmentId: string;
    equipmentName: string;
    owner: {
        userId: string;
        email: string;
        name: string;
    };
    customer: {
        email: string;
        phone?: string;
        deliveryAddress?: string;
    };
    userEmail: string;
    startDate: string;
    endDate: string;
    rentalDuration: number;
    rentalPeriods: number;
    quantity: number;
    totalAmount: number;
    currency: string;
    status: string;
    bookingStatus: string;
    createdAt: string;
    paidAt?: string;
}

type PaymentFilter = "All" | "paid" | "unpaid";
type BookingFilter = "All" | "Confirmed" | "Pending" | "Cancelled";

export default function MyEquipmentRentalPage() {
    const [rentals, setRentals] = useState<IRental[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [paymentFilter, setPaymentFilter] =
        useState<PaymentFilter>("All");
    const [bookingFilter, setBookingFilter] =
        useState<BookingFilter>("All");

    const fetchMyRentals = useCallback(async () => {
        const { data, error } = await authClient.token();

        if (error || !data?.token) {
            throw new Error("Please sign in again.");
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/owner/my-equipment-rentals`,
            {
                headers: {
                    Authorization: `Bearer ${data.token}`,
                },
                cache: "no-store",
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Failed to fetch rental records."
            );
        }

        return result.rentals || [];
    }, []);

    const loadRentals = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchMyRentals();
            setRentals(data);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }, [fetchMyRentals]);

    useEffect(() => {
        let ignore = false;

        fetchMyRentals()
            .then((data) => {
                if (!ignore) {
                    setRentals(data);
                }
            })
            .catch((error) => {
                if (!ignore) {
                    toast.error(
                        error instanceof Error
                            ? error.message
                            : "Failed to load rentals."
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
    }, [fetchMyRentals]);

    const filteredRentals = useMemo(() => {
        return rentals.filter((rental) => {
            const search = searchTerm.toLowerCase();

            const matchesSearch =
                rental.equipmentName?.toLowerCase().includes(search) ||
                rental.customer?.email?.toLowerCase().includes(search) ||
                rental.customer?.phone?.toLowerCase().includes(search) ||
                rental.customer?.deliveryAddress?.toLowerCase().includes(search);

            const matchesPayment =
                paymentFilter === "All" ||
                (paymentFilter === "paid" &&
                    rental.status?.toLowerCase() === "paid") ||
                (paymentFilter === "unpaid" &&
                    rental.status?.toLowerCase() !== "paid");

            const matchesBooking =
                bookingFilter === "All" ||
                rental.bookingStatus?.toLowerCase() ===
                bookingFilter.toLowerCase();

            return matchesSearch && matchesPayment && matchesBooking;
        });
    }, [rentals, searchTerm, paymentFilter, bookingFilter]);

    const formatDate = (date: string) => {
        if (!date) return "N/A";

        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).format(new Date(date));
    };

    const formatAmount = (amount: number, currency: string) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency || "USD",
        }).format(amount || 0);
    };

    const getPaymentStyle = (status: string) => {
        switch (status?.toLowerCase()) {
            case "paid":
                return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "pending":
                return "bg-amber-50 text-amber-700 border-amber-100";
            case "failed":
                return "bg-red-50 text-red-700 border-red-100";
            default:
                return "bg-stone-100 text-stone-600 border-stone-200";
        }
    };

    const getBookingStyle = (status: string) => {
        switch (status?.toLowerCase()) {
            case "confirmed":
                return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "pending":
                return "bg-amber-50 text-amber-700 border-amber-100";
            case "cancelled":
                return "bg-red-50 text-red-700 border-red-100";
            case "completed":
                return "bg-blue-50 text-blue-700 border-blue-100";
            default:
                return "bg-stone-100 text-stone-600 border-stone-200";
        }
    };

    const paidCount = rentals.filter(
        (rental) => rental.status?.toLowerCase() === "paid"
    ).length;

    const totalRevenue = rentals
        .filter((rental) => rental.status?.toLowerCase() === "paid")
        .reduce((total, rental) => total + rental.totalAmount, 0);

    return (
        <main className="min-h-screen bg-[#FAF9F6] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-7">

                {/* Page Heading */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-500">
                            <Package size={16} />
                            Owner Dashboard
                            <span>/</span>
                            My Equipment Rental
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
                            My Equipment Rental
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
                            Manage customer bookings, monitor rental payments, and
                            keep track of equipment rental activities.
                        </p>
                    </div>

                    <button
                        onClick={loadRentals}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw
                            size={16}
                            className={loading ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="rounded-xl bg-stone-100 p-3 text-stone-700">
                                <ClipboardList size={21} />
                            </div>
                            <span className="text-xs font-medium text-stone-400">
                                All bookings
                            </span>
                        </div>
                        <p className="mt-5 text-3xl font-bold text-stone-900">
                            {rentals.length}
                        </p>
                        <p className="mt-1 text-sm text-stone-500">
                            Total equipment rentals
                        </p>
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                                <CreditCard size={21} />
                            </div>
                            <span className="text-xs font-medium text-stone-400">
                                Successful payments
                            </span>
                        </div>
                        <p className="mt-5 text-3xl font-bold text-stone-900">
                            {paidCount}
                        </p>
                        <p className="mt-1 text-sm text-stone-500">
                            Paid bookings
                        </p>
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center justify-between">
                            <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
                                <CreditCard size={21} />
                            </div>
                            <span className="text-xs font-medium text-stone-400">
                                Paid bookings only
                            </span>
                        </div>
                        <p className="mt-5 text-3xl font-bold text-stone-900">
                            {formatAmount(
                                totalRevenue,
                                rentals.find((r) => r.status?.toLowerCase() === "paid")
                                    ?.currency || "USD"
                            )}
                        </p>
                        <p className="mt-1 text-sm text-stone-500">
                            Total booking amount
                        </p>
                    </div>
                </div>

                {/* Rental Table Card */}
                <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">

                    {/* Table Header */}
                    <div className="border-b border-stone-200 p-5 sm:p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-stone-900">
                                    Rental Records
                                </h2>
                                <p className="mt-1 text-sm text-stone-500">
                                    View all customer rentals for your equipment.
                                </p>
                            </div>

                            <div className="relative w-full lg:max-w-xs">
                                <Search
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                                />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search customer or equipment..."
                                    className="w-full rounded-xl border border-stone-200 bg-[#FAF9F6] py-2.5 pl-10 pr-4 text-sm text-stone-700 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
                                />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                            <select
                                value={paymentFilter}
                                onChange={(e) =>
                                    setPaymentFilter(e.target.value as PaymentFilter)
                                }
                                className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-stone-400"
                            >
                                <option value="All">All Payment Status</option>
                                <option value="paid">Paid</option>
                                <option value="unpaid">Unpaid / Pending</option>
                            </select>

                            <select
                                value={bookingFilter}
                                onChange={(e) =>
                                    setBookingFilter(e.target.value as BookingFilter)
                                }
                                className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-stone-400"
                            >
                                <option value="All">All Booking Status</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Pending">Pending</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {/* Loading */}
                    {loading ? (
                        <div className="flex min-h-72 flex-col items-center justify-center gap-3">
                            <RefreshCw size={28} className="animate-spin text-stone-500" />
                            <p className="text-sm text-stone-500">
                                Loading rental records...
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Empty State */}
                            {filteredRentals.length === 0 ? (
                                <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
                                    <div className="mb-4 rounded-2xl bg-stone-100 p-5 text-stone-500">
                                        {rentals.length === 0 ? (
                                            <Inbox size={30} />
                                        ) : (
                                            <Search size={30} />
                                        )}
                                    </div>

                                    <h3 className="text-lg font-semibold text-stone-800">
                                        {rentals.length === 0
                                            ? "No rental records yet"
                                            : "No matching rentals"}
                                    </h3>

                                    <p className="mt-2 max-w-sm text-sm leading-6 text-stone-500">
                                        {rentals.length === 0
                                            ? "When customers book your equipment, their rental information will appear here."
                                            : "Try changing your search term or filters."}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Responsive Table */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-312.5 border-collapse text-left">
                                            <thead>
                                                <tr className="bg-[#FAF9F6] text-xs font-semibold uppercase tracking-wider text-stone-500">
                                                    <th className="px-5 py-4">Customer Information</th>
                                                    <th className="px-5 py-4">Equipment Information</th>
                                                    <th className="px-5 py-4">Rental Duration</th>
                                                    <th className="px-5 py-4">Required Quantity</th>
                                                    <th className="px-5 py-4">Booking Amount</th>
                                                    <th className="px-5 py-4">Payment Status</th>
                                                    <th className="px-5 py-4">Booking Status</th>
                                                </tr>
                                            </thead>

                                            <tbody className="divide-y divide-stone-100">
                                                {filteredRentals.map((rental) => (
                                                    <tr
                                                        key={rental._id}
                                                        className="transition hover:bg-[#FAF9F6]/70"
                                                    >
                                                        {/* Customer */}
                                                        <td className="px-5 py-5">
                                                            <div className="flex items-start gap-3">
                                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-600">
                                                                    <UserRound size={19} />
                                                                </div>

                                                                <div className="max-w-47.5">
                                                                    <p className="break-all text-sm font-semibold text-stone-800">
                                                                        {rental.customer?.email ||
                                                                            rental.userEmail ||
                                                                            "Unknown customer"}
                                                                    </p>

                                                                    {rental.customer?.phone && (
                                                                        <p className="mt-1 flex items-center gap-1 text-xs text-stone-500">
                                                                            <Phone size={12} />
                                                                            {rental.customer.phone}
                                                                        </p>
                                                                    )}

                                                                    {rental.customer?.deliveryAddress && (
                                                                        <p className="mt-1 flex items-center gap-1 text-xs text-stone-500">
                                                                            <MapPin size={12} />
                                                                            {rental.customer.deliveryAddress}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Equipment */}
                                                        <td className="px-5 py-5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-600">
                                                                    <Package size={19} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-semibold text-stone-800">
                                                                        {rental.equipmentName}
                                                                    </p>
                                                                    <p className="mt-1 text-xs text-stone-400">
                                                                        ID: {rental.equipmentId}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Duration */}
                                                        <td className="px-5 py-5">
                                                            <div className="flex items-start gap-2">
                                                                <CalendarDays
                                                                    size={16}
                                                                    className="mt-0.5 shrink-0 text-stone-400"
                                                                />
                                                                <div>
                                                                    <p className="whitespace-nowrap text-sm font-medium text-stone-700">
                                                                        {formatDate(rental.startDate)}
                                                                    </p>
                                                                    <p className="mt-1 whitespace-nowrap text-xs text-stone-400">
                                                                        to {formatDate(rental.endDate)}
                                                                    </p>
                                                                    <p className="mt-1 text-xs text-stone-500">
                                                                        {rental.rentalDuration} days
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Quantity */}
                                                        <td className="px-5 py-5">
                                                            <span className="rounded-lg bg-stone-100 px-3 py-1.5 text-sm font-semibold text-stone-700">
                                                                {rental.quantity}
                                                            </span>
                                                        </td>

                                                        {/* Amount */}
                                                        <td className="px-5 py-5">
                                                            <p className="whitespace-nowrap text-sm font-bold text-stone-900">
                                                                {formatAmount(
                                                                    rental.totalAmount,
                                                                    rental.currency
                                                                )}
                                                            </p>
                                                        </td>

                                                        {/* Payment Status */}
                                                        <td className="px-5 py-5">
                                                            <span
                                                                className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${getPaymentStyle(
                                                                    rental.status
                                                                )}`}
                                                            >
                                                                {rental.status || "Unknown"}
                                                            </span>
                                                        </td>

                                                        {/* Booking Status */}
                                                        <td className="px-5 py-5">
                                                            <span
                                                                className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold ${getBookingStyle(
                                                                    rental.bookingStatus
                                                                )}`}
                                                            >
                                                                {rental.bookingStatus || "Unknown"}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Table Footer */}
                                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 px-5 py-4">
                                        <p className="text-xs text-stone-500">
                                            Showing{" "}
                                            <span className="font-semibold text-stone-700">
                                                {filteredRentals.length}
                                            </span>{" "}
                                            of{" "}
                                            <span className="font-semibold text-stone-700">
                                                {rentals.length}
                                            </span>{" "}
                                            rental records
                                        </p>

                                        <p className="text-xs text-stone-400">
                                            Sorted by latest booking
                                        </p>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </section>

                {/* Small Note */}
                <div className="flex items-start gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3">
                    <AlertCircle
                        size={17}
                        className="mt-0.5 shrink-0 text-stone-500"
                    />
                    <p className="text-xs leading-5 text-stone-500">
                        Rental records are displayed based on bookings made for your
                        equipment. Payment and booking statuses reflect the latest
                        information received from the server.
                    </p>
                </div>
            </div>
        </main>
    );
}
