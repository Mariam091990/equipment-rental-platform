
import Link from "next/link";
import {
    Search,
    ClipboardList,
    CreditCard,
    Truck,
    ArrowRight,
    CheckCircle2,
} from "lucide-react";

const steps = [
    {
        number: "01",
        title: "Explore Equipment",
        description:
            "Browse our wide range of equipment and find the right tools or machinery for your project.",
        icon: Search,
    },
    {
        number: "02",
        title: "Choose & Book",
        description:
            "Select your preferred equipment, choose your rental dates, and provide the required booking details.",
        icon: ClipboardList,
    },
    {
        number: "03",
        title: "Make Secure Payment",
        description:
            "Review your rental details and complete your booking through our secure online payment system.",
        icon: CreditCard,
    },
    {
        number: "04",
        title: "Get Your Equipment",
        description:
            "Once your booking is confirmed, coordinate with the equipment owner and get ready for your project.",
        icon: Truck,
    },
];

export default function HowItWorks() {
    return (
        <section className="overflow-hidden bg-slate-50 py-20 lg:py-24">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">

                {/* Section Heading */}
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                        <CheckCircle2 size={17} />
                        Simple Rental Process
                    </span>

                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        How It Works
                        <span className="text-blue-600">.</span>
                    </h2>

                    <p className="mt-4 text-base leading-7 text-slate-600">
                        Renting equipment has never been easier. Follow these
                        four simple steps to get the equipment you need.
                    </p>
                </div>

                {/* Steps */}
                <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Connecting Line */}
                    <div className="absolute left-[12%] right-[12%] top-10 hidden border-t-2 border-dashed border-blue-200 lg:block" />

                    {steps.map((step) => {
                        const Icon = step.icon;

                        return (
                            <div key={step.number} className="relative text-center">
                                {/* Icon */}
                                <div className="relative z-10 mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-blue-600 text-white shadow-lg shadow-blue-100">
                                    <Icon size={30} strokeWidth={1.8} />
                                </div>

                                {/* Step Number */}
                                <span className="mb-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold tracking-wider text-blue-700">
                                    STEP {step.number}
                                </span>

                                <h3 className="mb-3 text-lg font-bold text-slate-900">
                                    {step.title}
                                </h3>

                                <p className="mx-auto max-w-xs text-sm leading-7 text-slate-600">
                                    {step.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 rounded-3xl bg-slate-900 px-7 py-10 text-center sm:px-12">
                    <h3 className="text-2xl font-bold text-white sm:text-3xl">
                        Ready to Start Your Next Project?
                    </h3>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300">
                        Find the right equipment, simplify your rental process,
                        and move your project forward.
                    </p>

                    <Link
                        href="/AllEquipment"
                        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700"
                    >
                        Explore Equipment
                        <ArrowRight size={17} />
                    </Link>
                </div>

            </div>
        </section>
    );
}

