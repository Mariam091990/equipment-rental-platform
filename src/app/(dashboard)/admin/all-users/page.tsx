
"use client";

import { useCallback, useEffect, useState } from "react";
import {
    RefreshCw,
    Users,
    AlertCircle,
    Pencil,
    X,
    Save,
    UserRound,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";

interface IUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    image?: string;
    phone?: string;
    address?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AllUsersPage() {
    // States
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [roleChanges, setRoleChanges] = useState<
        Record<string, string>
    >({});

    const [editingUser, setEditingUser] = useState<IUser | null>(null);
    const [saving, setSaving] = useState(false);

    const [editForm, setEditForm] = useState({
        name: "",
        image: "",
        phone: "",
        address: "",
    });

    // Fetch all registered users
    const fetchUsers = useCallback(async () => {
        try {
            if (!API_URL) {
                throw new Error("API URL is not configured.");
            }

            // Get Better Auth JWT
            const { data, error: tokenError } = await authClient.token();

            if (tokenError || !data?.token) {
                throw new Error(
                    "Authentication required. Please sign in again."
                );
            }

            // Fetch users from backend
            const response = await fetch(`${API_URL}/users`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${data.token}`,
                },
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to fetch users."
                );
            }

            setUsers(result.users || []);
            setError("");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial data fetching
    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void fetchUsers();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [fetchUsers]);

    // Refresh users
    const handleRefresh = () => {
        setLoading(true);
        setError("");
        void fetchUsers();
    };

    // Format registration date
    const formatDate = (date: string) => {
        if (!date) return "N/A";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "N/A";
        }

        return parsedDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // Update user role
    const handleRoleUpdate = async (user: IUser) => {
        const newRole = (
            roleChanges[user._id] ?? user.role ?? "customer"
        ).toLowerCase();

        if (newRole === user.role?.toLowerCase()) return;

        try {
            const { data, error: tokenError } = await authClient.token();

            if (tokenError || !data?.token) {
                throw new Error("Please sign in again.");
            }

            const response = await fetch(
                `${API_URL}/admin/users/${user._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${data.token}`,
                    },
                    body: JSON.stringify({
                        role: newRole,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to update role."
                );
            }

            // Update local users state
            setUsers((previous) =>
                previous.map((item) =>
                    item._id === user._id
                        ? { ...item, role: newRole }
                        : item
                )
            );

            // Clear selected role
            setRoleChanges((previous) => {
                const updated = { ...previous };
                delete updated[user._id];
                return updated;
            });

            alert("User role updated successfully!");
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );
        }
    };

    // Open Edit User Modal
    const openEditModal = (user: IUser) => {
        setEditingUser(user);

        setEditForm({
            name: user.name || "",
            image: user.image || "",
            phone: user.phone || "",
            address: user.address || "",
        });
    };

    // Update user information
    const handleUserUpdate = async () => {
        if (!editingUser) return;

        try {
            if (!editForm.name.trim()) {
                throw new Error("Name is required.");
            }

            setSaving(true);

            const { data, error: tokenError } = await authClient.token();

            if (tokenError || !data?.token) {
                throw new Error("Please sign in again.");
            }

            const response = await fetch(
                `${API_URL}/admin/users/${editingUser._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${data.token}`,
                    },
                    body: JSON.stringify({
                        name: editForm.name.trim(),
                        image: editForm.image.trim(),
                        phone: editForm.phone.trim(),
                        address: editForm.address.trim(),
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to update user."
                );
            }

            // Update local table data
            setUsers((previous) =>
                previous.map((user) =>
                    user._id === editingUser._id
                        ? { ...user, ...editForm }
                        : user
                )
            );

            setEditingUser(null);

            alert("User information updated successfully!");
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 p-4 md:p-6">

            {/* Page Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
                        Admin Management
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-stone-900">
                        All Users
                    </h1>

                    <p className="mt-2 text-sm text-stone-500">
                        View and manage all registered users.
                    </p>
                </div>

                <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100 disabled:opacity-50"
                >
                    <RefreshCw
                        size={16}
                        className={loading ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {/* Total Users Card */}
            <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-amber-50 p-3 text-amber-700">
                        <Users size={24} />
                    </div>

                    <div>
                        <p className="text-sm text-stone-500">
                            Total Registered Users
                        </p>

                        <h2 className="text-2xl font-bold text-stone-900">
                            {users.length}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            {/* Users Table */}
            <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">

                <div className="border-b border-stone-200 px-5 py-4">
                    <h2 className="font-semibold text-stone-900">
                        Registered Users
                    </h2>
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <RefreshCw
                            size={28}
                            className="animate-spin text-amber-700"
                        />
                    </div>
                ) : error ? (
                    <div className="py-12 text-center text-stone-500">
                        Unable to load users.
                    </div>
                ) : users.length === 0 ? (
                    <div className="py-12 text-center text-stone-500">
                        No registered users found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">

                            {/* Table Header */}
                            <thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500">
                                <tr>
                                    <th className="px-5 py-4">User</th>
                                    <th className="px-5 py-4">Email</th>
                                    <th className="px-5 py-4">Role</th>
                                    <th className="whitespace-nowrap px-5 py-4">
                                        Registration Date
                                    </th>
                                    <th className="px-5 py-4">Actions</th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody className="divide-y divide-stone-100">
                                {users.map((user) => (
                                    <tr
                                        key={user._id}
                                        className="transition hover:bg-stone-50"
                                    >
                                        {/* User Image and Name */}
                                        <td className="whitespace-nowrap px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {user.image ? (
                                                    <Image
                                                        src={user.image}
                                                        alt={user.name || "User"}
                                                        className="h-10 w-10 rounded-full border border-stone-200 object-cover"
                                                        width={100}
                                                        height={100}
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-500">
                                                        <UserRound size={20} />
                                                    </div>
                                                )}

                                                <span className="font-medium text-stone-900">
                                                    {user.name || "N/A"}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="whitespace-nowrap px-5 py-4 text-stone-600">
                                            {user.email}
                                        </td>

                                        {/* Role Dropdown */}
                                        <td className="px-5 py-4">
                                            <select
                                                value={
                                                    roleChanges[user._id] ??
                                                    user.role ??
                                                    "customer"
                                                }
                                                onChange={(e) =>
                                                    setRoleChanges((previous) => ({
                                                        ...previous,
                                                        [user._id]: e.target.value,
                                                    }))
                                                }
                                                className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm capitalize outline-none focus:border-amber-600"
                                            >
                                                <option value="customer">
                                                    Customer
                                                </option>

                                                <option value="owner">
                                                    Owner
                                                </option>

                                                <option value="admin">
                                                    Admin
                                                </option>
                                            </select>
                                        </td>

                                        {/* Registration Date */}
                                        <td className="whitespace-nowrap px-5 py-4 text-stone-600">
                                            {formatDate(user.createdAt)}
                                        </td>

                                        {/* Actions */}
                                        <td className="whitespace-nowrap px-5 py-4">
                                            <div className="flex items-center gap-2">

                                                <button
                                                    onClick={() =>
                                                        handleRoleUpdate(user)
                                                    }
                                                    disabled={
                                                        (
                                                            roleChanges[user._id] ??
                                                            user.role ??
                                                            "customer"
                                                        ).toLowerCase() ===
                                                        (user.role ?? "customer").toLowerCase()
                                                    }
                                                    className="rounded-lg bg-amber-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    Update Role
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        openEditModal(user)
                                                    }
                                                    className="flex items-center gap-1.5 rounded-lg border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-100"
                                                >
                                                    <Pencil size={14} />
                                                    Edit User
                                                </button>

                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                )}
            </div>

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">

                        {/* Modal Header */}
                        <div className="sticky top-0 flex items-center justify-between border-b border-stone-200 bg-white p-5">
                            <div>
                                <h2 className="text-xl font-bold text-stone-900">
                                    Update User
                                </h2>

                                <p className="mt-1 text-sm text-stone-500">
                                    Edit user profile information.
                                </p>
                            </div>

                            <button
                                onClick={() => setEditingUser(null)}
                                disabled={saving}
                                className="rounded-full p-2 text-stone-500 transition hover:bg-stone-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <div className="space-y-4 p-5">

                            {/* Name */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-stone-700">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="Enter full name"
                                    className="w-full rounded-lg border border-stone-300 px-4 py-2.5 outline-none focus:border-amber-600"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-stone-700">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    value={editingUser.email}
                                    readOnly
                                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-2.5 text-stone-500"
                                />

                                <p className="mt-1 text-xs text-stone-400">
                                    Email cannot be changed from this form.
                                </p>
                            </div>

                            {/* Profile Image */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-stone-700">
                                    Profile Image URL
                                </label>

                                <input
                                    type="url"
                                    value={editForm.image}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            image: e.target.value,
                                        })
                                    }
                                    placeholder="Enter image URL"
                                    className="w-full rounded-lg border border-stone-300 px-4 py-2.5 outline-none focus:border-amber-600"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-stone-700">
                                    Contact Number
                                </label>

                                <input
                                    type="text"
                                    value={editForm.phone}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            phone: e.target.value,
                                        })
                                    }
                                    placeholder="Enter contact number"
                                    className="w-full rounded-lg border border-stone-300 px-4 py-2.5 outline-none focus:border-amber-600"
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-stone-700">
                                    Address
                                </label>

                                <textarea
                                    rows={3}
                                    value={editForm.address}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            address: e.target.value,
                                        })
                                    }
                                    placeholder="Enter address"
                                    className="w-full resize-none rounded-lg border border-stone-300 px-4 py-2.5 outline-none focus:border-amber-600"
                                />
                            </div>

                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-stone-200 bg-white p-5">

                            <button
                                onClick={() => setEditingUser(null)}
                                disabled={saving}
                                className="rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleUserUpdate}
                                disabled={
                                    saving || !editForm.name.trim()
                                }
                                className="flex items-center gap-2 rounded-lg bg-amber-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Save size={16} />

                                {saving ? "Saving..." : "Save Changes"}
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
