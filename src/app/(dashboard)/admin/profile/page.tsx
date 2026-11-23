
"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import {
    UserRound,
    Mail,
    ShieldCheck,
    CalendarDays,
  
    Settings,
} from "lucide-react";

export default function AdminProfilePage() {
    const { data: session, isPending } = authClient.useSession();

    const user = session?.user;

    if (isPending) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-300 border-t-stone-800" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="rounded-xl bg-red-50 p-6 text-center text-red-600">
                Please sign in to view your profile.
            </div>
        );
    }

    const initials = user.name
        ?.split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "AD";

    return (
        <div className="mx-auto max-w-5xl space-y-8 p-4 sm:p-6">

            {/* Header */}
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
                    Account Management
                </p>

                <h1 className="mt-2 text-3xl font-bold text-stone-900">
                    My Profile
                </h1>

                <p className="mt-2 text-sm text-stone-500">
                    View your administrator account information.
                </p>
            </div>

            {/* Profile Banner */}
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">

                <div className="h-32 bg-linear-to-r from-stone-800 via-stone-700 to-stone-500" />

                <div className="px-6 pb-7">
                    <div className="-mt-14 flex flex-col items-center gap-5 sm:flex-row sm:items-end">

                        {/* Profile Image */}
                        <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-stone-200 shadow-md">
                            {user.image ? (
                                <Image
                                    src={user.image}
                                    alt={user.name || "Admin"}
                                    fill
                                    unoptimized
                                    sizes="112px"
                                    className="object-cover"
                                />
                            ) : (
                                <span className="text-3xl font-bold text-stone-600">
                                    {initials}
                                </span>
                            )}
                        </div>

                        {/* Name and Role */}
                        <div className="flex-1 pb-1 text-center sm:text-left">
                            <h2 className="text-2xl font-bold text-stone-900">
                                {user.name || "Administrator"}
                            </h2>

                            <p className="mt-1 text-sm text-stone-500">
                                {user.email}
                            </p>
                        </div>

                        {/* Admin Badge */}
                        <div className="pb-1">
                            <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                                <ShieldCheck size={17} />
                                Administrator
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Information */}
            <div className="grid gap-6 md:grid-cols-3">

                {/* Personal Details */}
                <div className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:col-span-2">

                    <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                        <div className="rounded-lg bg-stone-100 p-2">
                            <UserRound size={20} className="text-stone-700" />
                        </div>

                        <div>
                            <h3 className="font-bold text-stone-900">
                                Personal Information
                            </h3>
                            <p className="text-xs text-stone-500">
                                Your registered account details
                            </p>
                        </div>
                    </div>

                    {/* Full Name */}
                    <div className="flex items-start gap-4">
                        <UserRound className="mt-1 text-stone-400" size={19} />
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                                Full Name
                            </p>
                            <p className="mt-1 font-semibold text-stone-800">
                                {user.name || "Not provided"}
                            </p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-4">
                        <Mail className="mt-1 text-stone-400" size={19} />
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                                Email Address
                            </p>
                            <p className="mt-1 break-all font-semibold text-stone-800">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    {/* Account Created */}
                    <div className="flex items-start gap-4">
                        <CalendarDays className="mt-1 text-stone-400" size={19} />
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                                Member Since
                            </p>
                            <p className="mt-1 font-semibold text-stone-800">
                                {user.createdAt
                                    ? new Date(user.createdAt).toLocaleDateString(
                                        "en-BD",
                                        {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        }
                                    )
                                    : "Not available"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Account Overview */}
                <div className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">

                    <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                        <div className="rounded-lg bg-stone-100 p-2">
                            <Settings size={20} className="text-stone-700" />
                        </div>

                        <h3 className="font-bold text-stone-900">
                            Account Overview
                        </h3>
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                            Account Status
                        </p>

                        <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700">
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                            Active
                        </span>
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                            Account Type
                        </p>

                        <p className="mt-2 font-semibold capitalize text-stone-800">
                            {user.role || "Admin"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                            Authentication
                        </p>

                     
                    </div>
                </div>
            </div>

            {/* Footer Information */}
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-5">
                <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 text-stone-600" size={21} />

                    <div>
                        <h3 className="font-semibold text-stone-800">
                            Administrator Account
                        </h3>

                        <p className="mt-1 text-sm leading-relaxed text-stone-500">
                            This account has administrator access to the
                            Equipment Rental Platform. 
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}
