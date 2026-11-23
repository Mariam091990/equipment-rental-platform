
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowUpRight,
    HardHat,
    Drill,
    Truck,
    Tractor,
    Factory,
    Container,
} from "lucide-react";

const categories = [
    {
        title: "Construction Equipment",
        description: "Machinery for building and construction projects.",
        image:
            "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=85",
        icon: HardHat,
    },
    {
        title: "Power Tools",
        description: "Professional tools for every type of project.",
        image:
            "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=700&q=85",
        icon: Drill,
    },
    {
        title: "Vehicles & Transportation",
        description: "Reliable vehicles for work and transportation.",
        image:
            "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=700&q=85",
        icon: Truck,
    },
    {
        title: "Agriculture Equipment",
        description: "Equipment to support modern farming operations.",
        image:
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=85",
        icon: Tractor,
    },
    {
        title: "Industrial Machinery",
        description: "Heavy-duty machinery for industrial operations.",
        image:
            "https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=700&q=85",
        icon: Factory,
    },
    {
        title: "Lifting & Handling",
        description: "Equipment for lifting and moving heavy materials.",
        image:
            "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=700&q=85",
        icon: Container,
    },
];

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
        y: 35,
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

export default function EquipmentCategories() {
    return (
        <section className="bg-white px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
            <div className="mx-auto max-w-7xl">

                {/* Section heading */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7 }}
                    className="mx-auto mb-12 max-w-2xl text-center"
                >
                    <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                        Explore Our Collection
                    </span>

                    <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                        Equipment for Every
                        <span className="text-blue-600"> Project</span>
                    </h2>

                    <p className="mt-5 text-base leading-7 text-slate-500 sm:text-lg">
                        From construction machinery to professional tools,
                        discover the equipment you need to get your work done.
                    </p>
                </motion.div>

                {/* Category cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {categories.map((category) => {
                        const Icon = category.icon;

                        return (
                            <motion.div
                                key={category.title}
                                variants={cardVariants}
                                whileHover={{ y: -7 }}
                                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-200/70"
                            >
                                {/* Image */}
                                <div className="relative h-56 overflow-hidden">
                                    <Image
                                        src={category.image}
                                        alt={category.title}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/50 via-transparent to-transparent" />

                                    {/* Category icon */}
                                    <div className="absolute bottom-4 left-5 flex h-12 w-12 items-center justify-center rounded-xl border border-white/30 bg-white/95 text-blue-600 shadow-lg">
                                        <Icon size={23} />
                                    </div>
                                </div>

                                {/* Card content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                                        {category.title}
                                    </h3>

                                    <p className="mt-3 min-h-12 text-sm leading-6 text-slate-500">
                                        {category.description}
                                    </p>

                                    <Link
                                        href="/AllEquipment"
                                        className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition-all hover:gap-3"
                                    >
                                        Explore Equipment
                                        <ArrowUpRight size={17} />
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mt-12 flex flex-col items-center justify-between gap-5 rounded-2xl bg-slate-50 px-6 py-8 sm:flex-row sm:px-10"
                >
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">
                            Looking for something specific?
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                            Browse our complete equipment collection.
                        </p>
                    </div>

                    <Link
                        href="/AllEquipment"
                        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
                    >
                        View All Equipment
                        <ArrowUpRight size={18} />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
