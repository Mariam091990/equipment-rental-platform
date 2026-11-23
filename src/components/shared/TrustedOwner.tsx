
import {
    ShieldCheck,
    Package,
    Users,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface ITrustedOwner {
    ownerId: string;
    ownerName: string;
    equipmentCount: number;
    categories: string[];
}

async function getTrustedOwners(): Promise<ITrustedOwner[]> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/trusted-owners`,
            { cache: "no-store" }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch owners.");
        }

        const data = await response.json();
        return data.owners || [];
    } catch (error) {
        console.error("Trusted owners error:", error);
        return [];
    }
}

export default async function TrustedOwners() {
    const owners = await getTrustedOwners();

    return (
        <section className="bg-white py-20 lg:py-24">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
                <div className="mx-auto mb-14 max-w-2xl text-center">
                    <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                        <ShieldCheck size={17} />
                        Reliable Equipment Partners
                    </span>

                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Trusted Equipment Owners
                    </h2>

                    <p className="mt-4 leading-7 text-slate-600">
                        Meet the equipment owners offering quality machinery
                        and tools to support your projects.
                    </p>
                </div>

                {owners.length === 0 ? (
                    <div className="rounded-2xl bg-slate-50 py-12 text-center">
                        <Users className="mx-auto mb-3 text-slate-400" size={35} />
                        <p className="font-medium text-slate-700">
                            No equipment owners available yet.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {owners.map((owner) => (
                            <div
                                key={owner.ownerId}
                                className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-xl font-bold text-blue-700">
                                        {owner.ownerName?.charAt(0).toUpperCase() || "O"}
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="truncate text-lg font-bold text-slate-900">
                                            {owner.ownerName}
                                        </h3>
                                        <div className="mt-1 flex items-center gap-1.5 text-sm text-blue-700">
                                            <ShieldCheck size={15} />
                                            <span>Equipment Partner</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="my-6 border-t border-slate-100" />

                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Package size={18} className="text-blue-600" />
                                        Approved listings
                                    </div>

                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
                                        {owner.equipmentCount}
                                    </span>
                                </div>

                                <div className="mt-5">
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Equipment Categories
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {owner.categories.slice(0, 3).map((category) => (
                                            <span
                                                key={category}
                                                className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"
                                            >
                                                {category}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <Link
                                    href="/AllEquipment"
                                    className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5 text-sm font-semibold text-blue-700 transition-colors group-hover:text-blue-900"
                                >
                                    Explore Equipment
                                    <ArrowRight size={17} />
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
