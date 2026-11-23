
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    ArrowRight,
    ShieldCheck,
    Truck,
    Wrench,
    CheckCircle2,
} from "lucide-react";

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.18,
        },
    },
};

const itemVariants = {
    hidden: {
        opacity: 0,
        y: 25,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: "easeOut" as const,
        },
    },
};

export default function Banner() {
    return (
        <section className="relative isolate overflow-hidden bg-[#f5f7fa]">
            {/* Background decoration */}
            <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl" />
            <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-sky-100/70 blur-3xl" />

            <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-10 lg:px-10 lg:py-24">

                {/* Left content */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative z-10"
                >
                    {/* Small badge */}
                    <motion.div variants={itemVariants}>
                        <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />
                            Equipment Rental Made Simple
                        </span>
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        variants={itemVariants}
                        className="mt-7 max-w-2xl text-4xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
                    >
                        The Right Equipment.
                        <span className="mt-2 block text-blue-600">
                            The Right Solution.
                        </span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        variants={itemVariants}
                        className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg"
                    >
                        Get the equipment you need without the cost of ownership.
                        Explore reliable machinery, tools, and essential equipment
                        for your construction, business, and everyday projects.
                    </motion.p>

                    {/* CTA buttons */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-8 flex flex-col gap-4 sm:flex-row"
                    >
                        <Link
                            href="/AllEquipment"
                            className="group inline-flex items-center justify-center gap-3 rounded-xl bg-blue-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl"
                        >
                            Explore Equipment
                            <ArrowRight
                                size={18}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </Link>

                        <Link
                            href="/AllEquipment"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-7 py-4 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                        >
                            Browse Rentals
                        </Link>
                    </motion.div>

                    {/* Trust points */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-10 flex flex-wrap gap-x-7 gap-y-4 border-t border-slate-200 pt-7"
                    >
                        <TrustPoint text="Easy Booking" />
                        <TrustPoint text="Reliable Equipment" />
                        <TrustPoint text="Secure Payments" />
                    </motion.div>
                </motion.div>

                {/* Right image */}
                <motion.div
                    initial={{ opacity: 0, x: 45, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="relative mx-auto w-full max-w-2xl lg:ml-auto"
                >
                    {/* Main image */}
                    <div className="relative aspect-4/3 overflow-hidden rounded-3xl shadow-2xl shadow-slate-900/15">
                        <Image
                            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=85"
                            alt="Construction equipment and machinery at a worksite"
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover transition-transform duration-700 hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent" />

                        <div className="absolute bottom-6 left-6 right-6">
                            <p className="text-sm font-medium text-blue-200">
                                BUILT FOR YOUR NEXT PROJECT
                            </p>
                            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                                Work smarter. Build better.
                            </h2>
                        </div>
                    </div>

                    {/* Floating feature card */}
                    <motion.div
                        animate={{ y: [0, -9, 0] }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute -left-3 top-8 flex items-center gap-3 rounded-2xl border border-white/80 bg-white p-4 shadow-xl sm:-left-8 sm:top-12"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <ShieldCheck size={24} />
                        </div>

                        <div>
                            <p className="text-sm font-bold text-slate-900">
                                Secure Rentals
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                                Book with confidence
                            </p>
                        </div>
                    </motion.div>

                    {/* Bottom feature card */}
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{
                            duration: 4.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5,
                        }}
                        className="absolute -bottom-5 right-3 flex items-center gap-3 rounded-2xl border border-white/80 bg-white p-4 shadow-xl sm:-right-5 sm:bottom-8"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <Truck size={23} />
                        </div>

                        <div>
                            <p className="text-sm font-bold text-slate-900">
                                Flexible Rentals
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                                Equipment when you need it
                            </p>
                        </div>
                    </motion.div>

                    {/* Decorative icon */}
                    <div className="absolute -right-4 -top-5 hidden h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg sm:flex">
                        <Wrench size={27} />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function TrustPoint({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <CheckCircle2 size={17} className="shrink-0 text-blue-600" />
            {text}
        </div>
    );
}
