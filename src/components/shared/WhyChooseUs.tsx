
"use client";

import { motion } from "framer-motion";
import {
    Wallet,
    ShieldCheck,
    CalendarClock,
    CreditCard,
    ArrowRight,
    CheckCircle2,
} from "lucide-react";
import Link from "next/link";

const benefits = [
    {
        number: "01",
        title: "Affordable Rental Prices",
        description:
            "Get access to the equipment you need without the high cost of purchasing and maintaining expensive machinery.",
        icon: Wallet,
    },
    {
        number: "02",
        title: "Verified Equipment Owners",
        description:
            "Browse equipment listed by verified owners, helping you make more confident and informed rental decisions.",
        icon: ShieldCheck,
    },
    {
        number: "03",
        title: "Flexible Rental Periods",
        description:
            "Choose rental durations that suit your project timeline and avoid paying for equipment longer than you need.",
        icon: CalendarClock,
    },
    {
        number: "04",
        title: "Secure Online Payments",
        description:
            "Complete your bookings through a secure Stripe-powered checkout experience with confidence.",
        icon: CreditCard,
    },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
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

export default function WhyChooseUs() {
    return (
        <section className="relative overflow-hidden bg-white px-5 py-20 sm:px-8 lg:px-10 lg:py-24">

            {/* Background decoration */}
            <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-blue-50 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-slate-100 blur-3xl" />

            <div className="relative mx-auto max-w-7xl">

                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7 }}
                    className="mx-auto mb-14 max-w-3xl text-center"
                >
                    <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                        <CheckCircle2 size={16} />
                        The EquipRent Advantage
                    </span>

                    <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                        Why Choose
                        <span className="text-blue-600"> Us?</span>
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-500 sm:text-lg">
                        Renting equipment should be simple, affordable, and reliable.
                        We bring everything together to make your rental experience
                        easier from browsing to booking.
                    </p>
                </motion.div>

                {/* Benefits */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {benefits.map((benefit) => {
                        const Icon = benefit.icon;

                        return (
                            <motion.div
                                key={benefit.number}
                                variants={cardVariants}
                                whileHover={{ y: -7 }}
                                className="group relative rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50"
                            >
                                {/* Number */}
                                <div className="absolute right-6 top-6 text-sm font-bold tracking-wider text-slate-200 transition-colors group-hover:text-blue-200">
                                    {benefit.number}
                                </div>

                                {/* Icon */}
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                                    <Icon size={27} strokeWidth={1.8} />
                                </div>

                                {/* Content */}
                                <h3 className="mt-7 text-lg font-bold leading-7 text-slate-900 transition-colors group-hover:text-blue-600">
                                    {benefit.title}
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-slate-500">
                                    {benefit.description}
                                </p>

                                {/* Bottom accent */}
                                <div className="mt-6 h-1 w-10 rounded-full bg-blue-200 transition-all duration-300 group-hover:w-16 group-hover:bg-blue-600" />
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Closing CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="relative mt-14 overflow-hidden rounded-3xl bg-[#101827] px-7 py-10 sm:px-12 sm:py-12"
                >
                    <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />

                    <div className="relative flex flex-col items-center justify-between gap-7 text-center sm:flex-row sm:text-left">
                        <div className="max-w-xl">
                            <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                                Ready to get started?
                            </p>

                            <h3 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-3xl">
                                Find the right equipment for your next project.
                            </h3>

                            <p className="mt-3 text-sm leading-7 text-slate-400">
                                Explore available equipment and make your next rental
                                booking with ease.
                            </p>
                        </div>

                        <Link
                            href="/AllEquipment"
                            className="group inline-flex shrink-0 items-center gap-3 rounded-xl bg-blue-600 px-7 py-4 text-sm font-bold text-white transition hover:bg-blue-500"
                        >
                            Browse Equipment
                            <ArrowRight
                                size={18}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
