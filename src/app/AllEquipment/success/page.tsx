export const instant = false;
import Link from "next/link";
import {
    Check,
    CheckCircle2,
    ArrowRight,
    CalendarDays,
    ClipboardCheck,
    CreditCard,
    Headphones,
    Home,
    PackageCheck,
    ShieldCheck,
} from "lucide-react";

interface SuccessPageProps {
    searchParams: Promise<{
        bookingId?: string;
        session_id?: string;
    }>;
}

export default async function PaymentSuccessPage({
    searchParams,
}: SuccessPageProps) {
    const { bookingId } = await searchParams;

    return (
        <main className="min-h-screen bg-[#FAF9F6] px-4 py-12 sm:px-6 lg:py-16">
            <div className="mx-auto max-w-3xl">

                {/* Brand */}
                <Link
                    href="/"
                    className="mb-10 flex items-center justify-center gap-2 text-xl font-bold tracking-tight text-[#292524]"
                >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#292524] text-white">
                        <PackageCheck size={20} />
                    </span>
                    EquipRent
                </Link>

                {/* Success Card */}
                <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-[0_12px_50px_rgba(0,0,0,0.04)]">

                    {/* Success Header */}
                    <div className="px-6 pb-8 pt-10 text-center sm:px-12 sm:pt-14">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                                <Check size={32} className="text-emerald-700" strokeWidth={3} />
                            </div>
                        </div>

                        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                            <CheckCircle2 size={14} />
                            Payment completed
                        </span>

                        <h1 className="mb-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                            Booking Confirmed!
                        </h1>

                        <p className="mx-auto max-w-md text-sm leading-7 text-stone-500 sm:text-base">
                            Your payment was successful. Your equipment rental booking has
                            been submitted successfully. You can view your booking details
                            from your customer dashboard.
                        </p>
                    </div>

                    {/* Booking Reference */}
                    <div className="mx-6 rounded-2xl border border-stone-200 bg-[#FAF9F6] p-5 sm:mx-12 sm:p-6">
                        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-stone-700">
                            <ClipboardCheck size={18} />
                            Booking Information
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="mb-1 text-xs text-stone-500">
                                    Booking Reference
                                </p>
                                <p className="break-all text-sm font-semibold text-stone-900">
                                    {bookingId || "Available in My Rentals"}
                                </p>
                            </div>

                            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                                <CheckCircle2 size={13} />
                                Paid
                            </span>
                        </div>

                        <div className="my-5 border-t border-dashed border-stone-300" />

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="flex items-start gap-3">
                                <div className="rounded-lg bg-white p-2.5 text-stone-600">
                                    <CreditCard size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-stone-500">Payment Method</p>
                                    <p className="mt-1 text-sm font-medium text-stone-800">
                                        Stripe Secure Payment
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="rounded-lg bg-white p-2.5 text-stone-600">
                                    <ShieldCheck size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-stone-500">Payment Status</p>
                                    <p className="mt-1 text-sm font-medium text-emerald-700">
                                        Successful
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="px-6 py-8 sm:px-12">
                        <h2 className="mb-5 text-lg font-semibold text-stone-900">
                            What happens next?
                        </h2>

                        <div className="space-y-5">
                            <div className="flex gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-700">
                                    <CalendarDays size={19} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-stone-800">
                                        Check your rental details
                                    </h3>
                                    <p className="mt-1 text-sm leading-6 text-stone-500">
                                        Visit My Rentals to review your rental dates and booking
                                        information.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-700">
                                    <PackageCheck size={19} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-stone-800">
                                        Coordinate with the equipment owner
                                    </h3>
                                    <p className="mt-1 text-sm leading-6 text-stone-500">
                                        Follow the rental instructions and coordinate the
                                        equipment collection or delivery.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-700">
                                    <Headphones size={19} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-stone-800">
                                        Need assistance?
                                    </h3>
                                    <p className="mt-1 text-sm leading-6 text-stone-500">
                                        Contact our support team if you have questions about
                                        your booking.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="/customer/my-rentals"
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#292524] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-700"
                            >
                                View My Rentals
                                <ArrowRight size={17} />
                            </Link>

                            <Link
                                href="/AllEquipment"
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-6 py-3.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                            >
                                <Home size={17} />
                                Browse Equipment
                            </Link>
                        </div>
                    </div>
                </section>

                <p className="mt-7 text-center text-xs leading-6 text-stone-400">
                    Thank you for choosing EquipRent. We appreciate your trust!
                </p>
            </div>
        </main>
    );
}
