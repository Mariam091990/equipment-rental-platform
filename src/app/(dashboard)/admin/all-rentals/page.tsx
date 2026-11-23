
"use client";

import { useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    CreditCard,
    Search,
    Package,
    Users,
    RefreshCw,
    Loader2,
    MapPin,
    Phone,
    Mail,
    Hash,
} from "lucide-react";
import { getAllRentals } from "@/lib/action/booking";

interface IRental {
    _id: string;
    equipmentId?: string;
    equipmentName?: string;
    equipmentImage?: string;

    userEmail?: string;
    customerPhone?: string;
    deliveryAddress?: string;

    startDate?: string | Date;
    endDate?: string | Date;
    rentalDuration?: number;
    rentalPeriods?: number;
    quantity?: number;
    bookingNotes?: string;

    totalAmount?: number;
    currency?: string;

    paymentStatus?: string;
    status?: string;
    bookingStatus?: string;

    createdAt?: string | Date;
    paidAt?: string | Date;
    stripeSessionId?: string;
}

function formatDate(value?: string | Date) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function formatDateTime(value?: string | Date) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function StatusBadge({ status }: { status: string }) {
    const normalized = status.toLowerCase();

    const styles =
        normalized === "paid" || normalized === "confirmed"
            ? "bg-emerald-50 text-emerald-700"
            : normalized === "pending"
                ? "bg-amber-50 text-amber-700"
                : normalized === "failed" || normalized === "cancelled"
                    ? "bg-red-50 text-red-700"
                    : "bg-slate-100 text-slate-600";

    return (
        <span
            className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles}`}
        >
            {status || "Unknown"}
        </span>
    );
}

export default function AdminAllRentalsPage() {
    const [rentals, setRentals] = useState<IRental[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [paymentFilter, setPaymentFilter] = useState("all");
    const [selectedRental, setSelectedRental] =
        useState<IRental | null>(null);

    const fetchRentals = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await getAllRentals();

            setRentals(result.rentals || []);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load rentals."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let active = true;

        async function loadRentals() {
            try {
                setLoading(true);
                setError("");

                const result = await getAllRentals();

                if (active) {
                    setRentals(result.rentals || []);
                }
            } catch (err) {
                if (active) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Failed to load rentals."
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        }

        loadRentals();

        return () => {
            active = false;
        };
    }, []);

    const getPaymentStatus = (rental: IRental) =>
        rental.paymentStatus || rental.status || "Unknown";

    const filteredRentals = useMemo(() => {
        return rentals.filter((rental) => {
            const search = searchTerm.toLowerCase();

            const matchesSearch =
                (rental.equipmentName || "").toLowerCase().includes(search) ||
                (rental.userEmail || "").toLowerCase().includes(search) ||
                (rental.customerPhone || "").toLowerCase().includes(search) ||
                rental._id.toLowerCase().includes(search);

            const paymentStatus = getPaymentStatus(rental).toLowerCase();

            const matchesPayment =
                paymentFilter === "all" ||
                paymentStatus === paymentFilter;

            return matchesSearch && matchesPayment;
        });
    }, [rentals, searchTerm, paymentFilter]);

    const paidCount = rentals.filter(
        (rental) => getPaymentStatus(rental).toLowerCase() === "paid"
    ).length;

    const pendingCount = rentals.filter(
        (rental) => getPaymentStatus(rental).toLowerCase() === "pending"
    ).length;

    const totalRevenue = rentals
        .filter(
            (rental) => getPaymentStatus(rental).toLowerCase() === "paid"
        )
        .reduce(
            (total, rental) => total + (Number(rental.totalAmount) || 0),
            0
        );

    const currency = rentals.find(
        (rental) => rental.currency
    )?.currency || "USD";

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Page heading */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm font-medium text-slate-500">
                            Administration / Rentals
                        </p>

                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                            All Rentals
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Monitor customer bookings, rental information and payments.
                        </p>
                    </div>

                    <button
                        onClick={fetchRentals}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
                    >
                        <RefreshCw
                            size={16}
                            className={loading ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>
                </div>

                {/* Summary cards */}
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard
                        title="Total Bookings"
                        value={rentals.length}
                        icon={<Package size={21} />}
                    />

                    <SummaryCard
                        title="Paid Bookings"
                        value={paidCount}
                        icon={<CreditCard size={21} />}
                    />

                    <SummaryCard
                        title="Pending Payments"
                        value={pendingCount}
                        icon={<CalendarDays size={21} />}
                    />

                    <SummaryCard
                        title="Paid Revenue"
                        value={`${currency} ${totalRevenue.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}`}
                        icon={<Users size={21} />}
                    />
                </div>

                {/* Rentals table */}
                <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                    <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Customer Booking Records
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {filteredRentals.length} booking(s) found
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative">
                                <Search
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    placeholder="Search customer, equipment, ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-slate-500 sm:w-72"
                                />
                            </div>

                            <select
                                value={paymentFilter}
                                onChange={(e) => setPaymentFilter(e.target.value)}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                            >
                                <option value="all">All Payments</option>
                                <option value="paid">Paid</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex min-h-64 flex-col items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
                            <p className="mt-3 text-sm text-slate-500">
                                Loading customer bookings...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="p-10 text-center">
                            <p className="font-semibold text-red-600">{error}</p>
                            <button
                                onClick={fetchRentals}
                                className="mt-4 rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
                            >
                                Try again
                            </button>
                        </div>
                    ) : filteredRentals.length === 0 ? (
                        <div className="p-12 text-center">
                            <Package className="mx-auto h-10 w-10 text-slate-300" />
                            <p className="mt-3 font-semibold text-slate-700">
                                No bookings found
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                Try changing your search or filter.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-275 text-left text-sm">
                                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                                    <tr>
                                        <th className="px-5 py-4">Customer</th>
                                        <th className="px-5 py-4">Equipment</th>
                                        <th className="px-5 py-4">Rental Period</th>
                                        <th className="px-5 py-4">Quantity</th>
                                        <th className="px-5 py-4">Total Amount</th>
                                        <th className="px-5 py-4">Payment</th>
                                        <th className="px-5 py-4">Booking</th>
                                        <th className="px-5 py-4">Booking Date</th>
                                        <th className="px-5 py-4">Details</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {filteredRentals.map((rental) => (
                                        <tr
                                            key={rental._id}
                                            className="transition hover:bg-slate-50"
                                        >
                                            <td className="px-5 py-4">
                                                <p className="font-semibold text-slate-800">
                                                    {rental.userEmail || "Not available"}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {rental.customerPhone || "No phone"}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="font-semibold text-slate-800">
                                                    {rental.equipmentName || "Equipment"}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-400">
                                                    ID: {rental.equipmentId?.toString() || "—"}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="whitespace-nowrap text-slate-700">
                                                    {formatDate(rental.startDate)}
                                                </p>
                                                <p className="mt-1 whitespace-nowrap text-xs text-slate-500">
                                                    to {formatDate(rental.endDate)}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4 text-slate-700">
                                                {rental.quantity ?? 1}
                                            </td>

                                            <td className="px-5 py-4 font-semibold text-slate-800">
                                                {rental.totalAmount != null
                                                    ? `${rental.currency || "USD"} ${Number(
                                                        rental.totalAmount
                                                    ).toLocaleString()}`
                                                    : "—"}
                                            </td>

                                            <td className="px-5 py-4">
                                                <StatusBadge status={getPaymentStatus(rental)} />
                                            </td>

                                            <td className="px-5 py-4">
                                                <StatusBadge
                                                    status={rental.bookingStatus || "Pending"}
                                                />
                                            </td>

                                            <td className="px-5 py-4 whitespace-nowrap text-slate-600">
                                                {formatDate(rental.createdAt)}
                                            </td>

                                            <td className="px-5 py-4">
                                                <button
                                                    onClick={() => setSelectedRental(rental)}
                                                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                                                >
                                                    View details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* Booking details modal */}
                {selectedRental && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                        onClick={() => setSelectedRental(null)}
                    >
                        <div
                            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 p-5">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">
                                        Booking Information
                                    </h2>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Booking ID: {selectedRental._id}
                                    </p>
                                </div>

                                <button
                                    onClick={() => setSelectedRental(null)}
                                    className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100"
                                >
                                    Close
                                </button>
                            </div>

                            <div className="space-y-6 p-5">

                                <DetailSection title="Customer Information">
                                    <DetailItem
                                        icon={<Mail size={16} />}
                                        label="Email"
                                        value={selectedRental.userEmail}
                                    />
                                    <DetailItem
                                        icon={<Phone size={16} />}
                                        label="Phone"
                                        value={selectedRental.customerPhone}
                                    />
                                    <DetailItem
                                        icon={<MapPin size={16} />}
                                        label="Delivery Address"
                                        value={selectedRental.deliveryAddress}
                                    />
                                </DetailSection>

                                <DetailSection title="Equipment Information">
                                    <DetailItem
                                        icon={<Package size={16} />}
                                        label="Equipment"
                                        value={selectedRental.equipmentName}
                                    />
                                    <DetailItem
                                        icon={<Hash size={16} />}
                                        label="Equipment ID"
                                        value={selectedRental.equipmentId?.toString()}
                                    />
                                    <DetailItem
                                        label="Quantity"
                                        value={String(selectedRental.quantity ?? 1)}
                                    />
                                </DetailSection>

                                <DetailSection title="Rental Information">
                                    <DetailItem
                                        label="Start Date"
                                        value={formatDate(selectedRental.startDate)}
                                    />
                                    <DetailItem
                                        label="End Date"
                                        value={formatDate(selectedRental.endDate)}
                                    />
                                    <DetailItem
                                        label="Rental Duration"
                                        value={
                                            selectedRental.rentalDuration != null
                                                ? String(selectedRental.rentalDuration)
                                                : "—"
                                        }
                                    />
                                    <DetailItem
                                        label="Rental Periods"
                                        value={
                                            selectedRental.rentalPeriods != null
                                                ? String(selectedRental.rentalPeriods)
                                                : "—"
                                        }
                                    />
                                    <DetailItem
                                        label="Booking Notes"
                                        value={selectedRental.bookingNotes}
                                    />
                                </DetailSection>

                                <DetailSection title="Payment Information">
                                    <DetailItem
                                        label="Total Amount"
                                        value={
                                            selectedRental.totalAmount != null
                                                ? `${selectedRental.currency || "USD"} ${Number(
                                                    selectedRental.totalAmount
                                                ).toLocaleString()}`
                                                : "—"
                                        }
                                    />
                                    <DetailItem
                                        label="Payment Status"
                                        value={getPaymentStatus(selectedRental)}
                                    />
                                    <DetailItem
                                        label="Booking Status"
                                        value={selectedRental.bookingStatus || "Pending"}
                                    />
                                    <DetailItem
                                        label="Booking Created"
                                        value={formatDateTime(selectedRental.createdAt)}
                                    />
                                    <DetailItem
                                        label="Payment Date"
                                        value={formatDateTime(selectedRental.paidAt)}
                                    />
                                    <DetailItem
                                        label="Stripe Session ID"
                                        value={selectedRental.stripeSessionId}
                                    />
                                </DetailSection>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

function SummaryCard({
    title,
    value,
    icon,
}: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <div className="rounded-lg bg-slate-100 p-2.5 text-slate-700">
                    {icon}
                </div>
            </div>

            <p className="mt-4 warp-break-words text-2xl font-bold text-slate-900">
                {value}
            </p>
        </div>
    );
}

function DetailSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section>
            <h3 className="mb-3 border-b border-slate-100 pb-2 text-sm font-bold uppercase tracking-wide text-slate-500">
                {title}
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {children}
            </div>
        </section>
    );
}

function DetailItem({
    label,
    value,
    icon,
}: {
    label: string;
    value?: string;
    icon?: React.ReactNode;
}) {
    return (
        <div className="min-w-0">
            <p className="flex items-center gap-2 text-xs text-slate-400">
                {icon}
                {label}
            </p>

            <p className="mt-1 warp-break-words text-sm font-medium text-slate-800">
                {value || "Not available"}
            </p>
        </div>
    );
}
