
"use client";

import { useEffect, useState } from "react";
import {
    UserRound,
    Mail,
  
    ShieldCheck,
    CalendarDays,
   
    LoaderCircle,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

interface IOwnerProfile {
    name: string;
    email: string;
    image: string;
    phone: string;
    address: string;
    createdAt: string | null;
    role: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function OwnerProfilePage() {
    const [profile, setProfile] = useState<IOwnerProfile | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        image: "",
        phone: "",
        address: "",
    });

    const [loading, setLoading] = useState(true);
    // const [saving, setSaving] = useState(false);
    //const [editing, setEditing] = useState(false);

    // Load customer profile_____________________________
    useEffect(() => {
        let ignore = false;

        const loadProfile = async () => {
            try {
                const { data, error } = await authClient.token();

                if (error || !data?.token) {
                    throw new Error("Please sign in again.");
                }

                const response = await fetch(`${API_URL}/customer/profile`, {
                    headers: {
                        Authorization: `Bearer ${data.token}`,
                    },
                    cache: "no-store",
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || "Failed to load profile.");
                }

                if (!ignore) {
                    setProfile(result.profile);
                    setFormData({
                        name: result.profile.name || "",
                        image: result.profile.image || "",
                        phone: result.profile.phone || "",
                        address: result.profile.address || "",
                    });
                }
            } catch (error) {
                if (!ignore) {
                    toast.error(
                        error instanceof Error
                            ? error.message
                            : "Something went wrong."
                    );
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        void loadProfile();

        return () => {
            ignore = true;
        };
    }, []);

    // _______________________________________________

   
    const initials =
        profile?.name
            ?.split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "OW";

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-[#FAF9F6]">
                <LoaderCircle className="animate-spin text-stone-700" size={36} />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#FAF9F6] px-4 text-center">
                <UserRound size={42} className="mb-3 text-stone-400" />
                <h2 className="text-xl font-semibold text-stone-900">
                    Profile unavailable
                </h2>
                <p className="mt-2 text-sm text-stone-500">
                    We could not load your profile. Please refresh the page.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF9F6] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                {/* Page heading */}
                <div className="mb-8">
                    <p className="text-sm font-medium text-stone-500">
                        Owner Dashboard / Profile
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
                        My Profile
                    </h1>
                    <p className="mt-2 text-sm text-stone-500 sm:text-base">
                        Manage your personal information and account details.
                    </p>
                </div>

                {/* Profile hero */}
                <div className="relative mb-8 overflow-hidden rounded-2xl bg-stone-700 p-6 text-white shadow-sm sm:p-9">
                    <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/5" />
                    <div className="absolute -bottom-32 right-32 h-64 w-64 rounded-full bg-white/5" />

                    <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white/20 bg-stone-700 text-2xl font-bold">
                            {profile.image ? (
                                <Image
                                    src={profile.image}
                                    alt={profile.name || "Owner"}
                                    width={96}
                                    height={96}
                                    unoptimized
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                initials
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-2xl font-bold">
                                    {profile.name || "customer"}
                                </h2>
                                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-stone-200">
                                    <ShieldCheck size={14} />
                                   Registered Account
                                </span>
                            </div>

                            <p className="mt-2 text-sm text-stone-300">
                                {profile.email}
                            </p>

                            <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium capitalize text-stone-200">
                                <UserRound size={14} />
                                {profile.role} Account
                            </div>
                        </div>

                        {/* 



                    {/* Account summary */}
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-stone-900">
                                Account Overview
                            </h2>
                            <p className="mt-1 text-sm text-stone-500">
                                Your account information at a glance.
                            </p>

                            <div className="mt-6 space-y-5">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-stone-100 p-3 text-stone-700">
                                        <ShieldCheck size={19} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-stone-500">Account Role</p>
                                        <p className="mt-1 text-sm font-semibold capitalize text-stone-900">
                                            {profile.role}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-stone-100 p-3 text-stone-700">
                                        <Mail size={19} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-stone-500">Email Address</p>
                                        <p className="mt-1 truncate text-sm font-semibold text-stone-900">
                                            {profile.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-stone-100 p-3 text-stone-700">
                                        <CalendarDays size={19} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-stone-500">Member Since</p>
                                        <p className="mt-1 text-sm font-semibold text-stone-900">
                                            {profile.createdAt
                                                ? new Date(profile.createdAt).toLocaleDateString(
                                                    "en-GB",
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
                        </div>

                        <div className="rounded-2xl border border-stone-200 bg-[#F1EFEA] p-6">
                            <div className="mb-3 inline-flex rounded-xl bg-white p-3 text-stone-800">
                                <ShieldCheck size={22} />
                            </div>
                            <h3 className="font-bold text-stone-900">
                                Your Account Security
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-stone-600">
                                Your account is protected by secure authentication. Keep your
                                contact information up to date so customers can reach you.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div></div>
    );
}