
import Link from "next/link";
import {
    ArrowRight,
    ShieldCheck,
    Users,
    Truck,
    Target,
    Eye,
    HeartHandshake,
    CheckCircle2,
} from "lucide-react";

const values = [
    {
        icon: ShieldCheck,
        title: "Trust & Transparency",
        description:
            "We believe in transparent pricing, clear rental terms, and reliable equipment information.",
    },
    {
        icon: Users,
        title: "Customer First",
        description:
            "Our platform is designed to make finding and renting equipment simple and convenient.",
    },
    {
        icon: Truck,
        title: "Convenience",
        description:
            "We connect customers with equipment owners and make the rental process easier.",
    },
    {
        icon: HeartHandshake,
        title: "Strong Partnerships",
        description:
            "We help equipment owners reach more customers and grow their rental opportunities.",
    },
];

const benefits = [
    "A wide range of equipment categories",
    "Transparent rental pricing and terms",
    "Easy equipment browsing and booking",
    "Secure online payment through Stripe",
    "Dedicated dashboards for customers and administrators",
    "A convenient platform for equipment owners",
];

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#faf9f6] text-stone-700">
            {/* Hero */}
            <section className="relative overflow-hidden bg-[#172b28] px-6 py-24 text-white md:py-32">
                <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />
                <div className="relative mx-auto max-w-7xl">
                    <span className="mb-5 inline-block rounded-full border border-orange-300/30 bg-orange-400/10 px-4 py-2 text-sm font-medium text-blue-200">
                        About Our Platform
                    </span>

                    <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
                        Making Equipment Rental
                        <span className="text-blue-400"> Simple & Accessible.</span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300 md:text-lg">
                        We connect people and businesses with the equipment they need.
                        Our goal is to make equipment rental easier, more transparent,
                        and more accessible for everyone.
                    </p>

                    <Link
                        href="/AllEquipment"
                        className="mt-9 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-600"
                    >
                        Explore Equipment <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            {/* Mission and Vision */}
            <section className="mx-auto grid max-w-7xl gap-8 px-6 py-20 md:grid-cols-2">
                <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm md:p-10">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                        <Target size={28} />
                    </div>
                    <h2 className="text-2xl font-bold">Our Mission</h2>
                    <p className="mt-4 leading-8 text-stone-600">
                        To simplify equipment rental by providing a convenient platform
                        where customers can discover, compare, and book equipment while
                        helping equipment owners connect with potential renters.
                    </p>
                </div>

                <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm md:p-10">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                        <Eye size={28} />
                    </div>
                    <h2 className="text-2xl font-bold">Our Vision</h2>
                    <p className="mt-4 leading-8 text-stone-600">
                        To become a trusted equipment rental destination where individuals
                        and businesses can access the right tools, machinery, and
                        resources whenever they need them.
                    </p>
                </div>
            </section>

            {/* Our Story */}
            <section className="bg-white px-6 py-20">
                <div className="mx-auto grid max-w-xl items-center gap-12 md:grid-cols-2">
                    <div>
                        <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
                            Who We Are
                        </span>
                        <h2 className="mt-4 text-3xl font-bold md:text-4xl">
                            A smarter way to rent equipment
                        </h2>
                        <p className="mt-6 leading-8 text-stone-600">
                            Finding the right equipment can be challenging, especially when
                            purchasing it is not practical. That is why our platform brings
                            equipment owners and customers together in one convenient place.
                        </p>
                        <p className="mt-4 leading-8 text-stone-600">
                            Whether you need construction machinery, agricultural equipment,
                            vehicles, photography gear, or professional tools, our platform
                            helps you explore available options and arrange rentals with
                            greater convenience.
                        </p>
                    </div>

                    <div className="rounded-3xl bg-[#172b28] p-8 text-white md:p-10">
                        <h3 className="text-2xl font-bold">What Makes Us Different?</h3>
                        <div className="mt-8 space-y-5">
                            {benefits.map((benefit) => (
                                <div key={benefit} className="flex items-start gap-3">
                                    <CheckCircle2
                                        size={21}
                                        className="mt-1 shrink-0 text-blue-400"
                                    />
                                    <p className="text-stone-200">{benefit}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="mx-auto max-w-7xl px-6 py-20">
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
                        What We Believe In
                    </span>
                    <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                        Our Core Values
                    </h2>
                    <p className="mt-4 leading-7 text-stone-600">
                        The principles that guide how we build our platform and serve
                        our customers.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {
                    values.map((value) => {
                        const Icon = value.icon;

                        return (
                            <div
                                key={value.title}
                                className="rounded-2xl border border-stone-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                    <Icon size={24} />
                                </div>
                                <h3 className="text-lg font-bold">{value.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-stone-600">
                                    {value.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 pb-20">
                <div className="mx-auto max-w-7xl rounded-3xl bg-blue-500 px-8 py-14 text-center text-white md:py-16">
                    <h2 className="text-3xl font-bold md:text-4xl">
                        Ready to Find the Right Equipment?
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl leading-7 text-orange-50">
                        Explore equipment listings and find the right solution for your
                        next project.
                    </p>
                    <Link
                        href="/AllEquipment"
                        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-stone-900 transition hover:bg-stone-100"
                    >
                        Browse Equipment <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </main>
    );
}
