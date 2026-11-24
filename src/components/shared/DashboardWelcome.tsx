
import {
    ArrowRight,
    ShieldCheck,
    UserRound,
    Store,
} from "lucide-react";
import Image from "next/image";

interface DashboardWelcomeProps {
    role: "admin" | "customer" | "owner";
    name?: string;
    email?: string;
    image?: string
}

const dashboardContent = {
    admin: {
        title: "Welcome to Admin Dashboard",
        description:
            "Manage your entire equipment rental platform from one place. Monitor users, oversee equipment listings, track rental activities, and maintain a smooth experience for everyone.",
        subtitle:
            "Stay informed, manage platform activities, and keep everything running efficiently.",
        icon: ShieldCheck,
        label: "Platform Management",
    },
    customer: {
        title: "Welcome to Your Dashboard",
        description:
            "Your rental journey starts here! Explore your rental history, manage your favorite equipment, track booking and payment statuses, and keep your profile up to date.",
        subtitle:
            "Everything you need to manage your equipment rentals, all in one place.",
        icon: UserRound,
        label: "Your Rental Space",
    },
    owner: {
        title: "Welcome to Your Owner Dashboard",
        description:
            "Take control of your rental business with ease. Add and manage equipment listings, monitor rental requests, track customer bookings, and organize your inventory.",
        subtitle:
            "Manage your equipment, grow your rental business, and connect with customers.",
        icon: Store,
        label: "Business Management",
    },
};

export default function DashboardWelcome({
    role,
    name,
    email,
    image
}: DashboardWelcomeProps) {
    const content = dashboardContent[role];
    const Icon = content.icon;

    return (
        <section className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            {/* Decorative background */}
            <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-[#FAF9F6]" />
            <div className="pointer-events-none absolute -right-4 -top-8 h-32 w-32 rounded-full border border-stone-200/70" />

            <div className="relative z-10">
                {/* Label */}
                <div className="mb-5 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF9F6] text-stone-700">
                        <Icon size={19} />
                    </div>

                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500">
                        {content.label}
                    </span>
                </div>

                {/* Heading */}
                {(name || email) && (
                    <div className="mt-4 flex items-center gap-3">
                        {image ? (
                            <Image
                                src={image}
                                alt={name || "User"}
                                className="h-11 w-11 rounded-full border border-stone-200 object-cover"
                                height={50}
                                width={50}
                            />
                        ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-100 font-semibold text-stone-700">
                                {name?.charAt(0).toUpperCase() || "U"}
                            </div>
                        )}

                        <div>
                            <p className="text-sm font-semibold text-stone-800">
                                {name}
                            </p>
                            <p className="text-xs text-stone-500">
                                {email}
                            </p>
                        </div>
                    </div>
                )}
                <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
                    {content.title}
                </h1>

                {name && (
                    <p className="mt-2 text-sm font-medium text-stone-600">
                        Hello, {name}!
                    </p>
                )}

                {/* Description */}
                <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-500 sm:text-base">
                    {content.description}
                </p>

                {/* Supporting text */}
                <div className="mt-6 flex items-start gap-2 border-t border-stone-100 pt-5">
                    <ArrowRight
                        size={16}
                        className="mt-0.5 shrink-0 text-stone-600"
                    />
                    <p className="text-sm text-stone-600">
                        {content.subtitle}
                    </p>
                </div>
            </div>
        </section>
    );
}
