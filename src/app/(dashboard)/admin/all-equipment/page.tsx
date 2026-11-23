
"use client";

import { useCallback, useEffect, useState } from "react";
import {
    RefreshCw,
    Package,
    Pencil,
    Trash2,
    CheckCircle,
    XCircle,
    X,
    Save,
    ChevronDown,
    UserRound,
    AlertCircle,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";

interface IEquipment {
    _id: string;
    equipmentName: string;
    description: string;
    category: string;
    location: string;
    rentalPrice: number;
    rentalType: string;
    availableQuantity: number;
    equipmentCondition: string;
    brand: string;
    model: string;
    equipmentImage: string;
    rentalTerms: string;
    status: "Pending" | "Approved" | "Rejected";
    owner?: {
        userId: string;
        name?: string;
        email?: string;
    };
    createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type StatusFilter = "All" | "Pending" | "Approved" | "Rejected";

const initialForm = {
    equipmentName: "",
    description: "",
    category: "",
    location: "",
    rentalPrice: "",
    rentalType: "Daily",
    availableQuantity: "",
    equipmentCondition: "",
    brand: "",
    model: "",
    equipmentImage: "",
    rentalTerms: "",
};

export default function AllEquipmentPage() {
    const [equipmentList, setEquipmentList] = useState<IEquipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

    const [editingEquipment, setEditingEquipment] =
        useState<IEquipment | null>(null);

    const [editForm, setEditForm] = useState(initialForm);
    const [saving, setSaving] = useState(false);
    const [actionId, setActionId] = useState<string | null>(null);

    // Get JWT and make an authenticated API request
    const getToken = async () => {
        const { data, error } = await authClient.token();

        if (error || !data?.token) {
            throw new Error("Please sign in again.");
        }

        return data.token;
    };

    // Fetch all equipment
    const fetchEquipment = useCallback(async () => {
        try {
            if (!API_URL) {
                throw new Error("API URL is not configured.");
            }

            const token = await getToken();

            const response = await fetch(`${API_URL}/admin/equipment`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to fetch equipment."
                );
            }

            setEquipmentList(result.equipment || []);
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

    // Initial fetch
    useEffect(() => {
        queueMicrotask(() => {
            void fetchEquipment();
        });
    }, [fetchEquipment]);

    // Refresh button
    const handleRefresh = () => {
        setLoading(true);
        setError("");
        void fetchEquipment();
    };

    // Format date
    const formatDate = (date: string) => {
        if (!date) return "N/A";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) return "N/A";

        return parsedDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // Update equipment status
    const handleStatusUpdate = async (
        item: IEquipment,
        status: "Approved" | "Rejected"
    ) => {
        const action = status.toLowerCase();

        if (
            !window.confirm(
                `Are you sure you want to ${action} "${item.equipmentName}"?`
            )
        ) {
            return;
        }

        try {
            setActionId(item._id);

            const token = await getToken();

            const response = await fetch(
                `${API_URL}/admin/equipment/${item._id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to update status."
                );
            }

            setEquipmentList((previous) =>
                previous.map((equipment) =>
                    equipment._id === item._id
                        ? { ...equipment, status }
                        : equipment
                )
            );

            alert(result.message || `Equipment ${action} successfully.`);
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );
        } finally {
            setActionId(null);
        }
    };

    // Open edit modal
    const openEditModal = (item: IEquipment) => {
        setEditingEquipment(item);

        setEditForm({
            equipmentName: item.equipmentName || "",
            description: item.description || "",
            category: item.category || "",
            location: item.location || "",
            rentalPrice: String(item.rentalPrice ?? ""),
            rentalType: item.rentalType || "Daily",
            availableQuantity: String(item.availableQuantity ?? ""),
            equipmentCondition: item.equipmentCondition || "",
            brand: item.brand || "",
            model: item.model || "",
            equipmentImage: item.equipmentImage || "",
            rentalTerms: item.rentalTerms || "",
        });
    };

    // Save equipment changes
    const handleEquipmentUpdate = async () => {
        if (!editingEquipment) return;

        try {
            if (
                !editForm.equipmentName.trim() ||
                !editForm.description.trim() ||
                !editForm.category.trim() ||
                !editForm.location.trim() ||
                !editForm.equipmentCondition.trim() ||
                !editForm.brand.trim() ||
                !editForm.model.trim() ||
                !editForm.equipmentImage.trim() ||
                !editForm.rentalTerms.trim() ||
                Number(editForm.rentalPrice) <= 0 ||
                !Number.isInteger(Number(editForm.availableQuantity)) ||
                Number(editForm.availableQuantity) <= 0
            ) {
                throw new Error("Please provide valid equipment information.");
            }

            setSaving(true);

            const token = await getToken();

            const response = await fetch(
                `${API_URL}/admin/equipment/${editingEquipment._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...editForm,
                        rentalPrice: Number(editForm.rentalPrice),
                        availableQuantity: Number(editForm.availableQuantity),
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to update equipment."
                );
            }

            setEquipmentList((previous) =>
                previous.map((item) =>
                    item._id === editingEquipment._id
                        ? {
                            ...item,
                            ...editForm,
                            rentalPrice: Number(editForm.rentalPrice),
                            availableQuantity: Number(
                                editForm.availableQuantity
                            ),
                        }
                        : item
                )
            );

            setEditingEquipment(null);
            alert("Equipment updated successfully!");
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

    // Delete equipment
    const handleDelete = async (item: IEquipment) => {
        if (
            !window.confirm(
                `Are you sure you want to delete "${item.equipmentName}"? This action cannot be undone.`
            )
        ) {
            return;
        }

        try {
            setActionId(item._id);

            const token = await getToken();

            const response = await fetch(
                `${API_URL}/admin/equipment/${item._id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to delete equipment."
                );
            }

            setEquipmentList((previous) =>
                previous.filter((equipment) => equipment._id !== item._id)
            );

            alert("Equipment deleted successfully!");
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );
        } finally {
            setActionId(null);
        }
    };

    // Filter equipment by status
    const filteredEquipment =
        statusFilter === "All"
            ? equipmentList
            : equipmentList.filter(
                (item) => item.status === statusFilter
            );

    // Status badge
    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Approved":
                return "bg-emerald-100 text-emerald-700";
            case "Rejected":
                return "bg-red-100 text-red-700";
            default:
                return "bg-amber-100 text-amber-700";
        }
    };

    const pendingCount = equipmentList.filter(
        (item) => item.status === "Pending"
    ).length;

    const approvedCount = equipmentList.filter(
        (item) => item.status === "Approved"
    ).length;

    const rejectedCount = equipmentList.filter(
        (item) => item.status === "Rejected"
    ).length;

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
                        Admin Management
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-stone-900">
                        All Equipment
                    </h1>

                    <p className="mt-2 text-sm text-stone-500">
                        Review, approve, update, and manage all listed equipment.
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

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                    {
                        label: "Total Equipment",
                        count: equipmentList.length,
                        icon: <Package size={22} />,
                        style: "bg-stone-100 text-stone-700",
                    },
                    {
                        label: "Pending",
                        count: pendingCount,
                        icon: <AlertCircle size={22} />,
                        style: "bg-amber-50 text-amber-700",
                    },
                    {
                        label: "Approved",
                        count: approvedCount,
                        icon: <CheckCircle size={22} />,
                        style: "bg-emerald-50 text-emerald-700",
                    },
                    {
                        label: "Rejected",
                        count: rejectedCount,
                        icon: <XCircle size={22} />,
                        style: "bg-red-50 text-red-700",
                    },
                ].map((card) => (
                    <div
                        key={card.label}
                        className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`rounded-lg p-3 ${card.style}`}>
                                {card.icon}
                            </div>

                            <div>
                                <p className="text-sm text-stone-500">
                                    {card.label}
                                </p>
                                <h2 className="text-2xl font-bold text-stone-900">
                                    {card.count}
                                </h2>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {/* Equipment Table */}
            <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
                <div className="flex flex-col justify-between gap-3 border-b border-stone-200 px-5 py-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="font-semibold text-stone-900">
                            Equipment Listings
                        </h2>
                        <p className="mt-1 text-xs text-stone-500">
                            {filteredEquipment.length} item(s) displayed
                        </p>
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value as StatusFilter)
                        }
                        className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-600"
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
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
                        Unable to load equipment.
                    </div>
                ) : filteredEquipment.length === 0 ? (
                    <div className="py-16 text-center">
                        <Package
                            size={36}
                            className="mx-auto text-stone-300"
                        />
                        <p className="mt-3 font-medium text-stone-700">
                            No equipment found
                        </p>
                        <p className="mt-1 text-sm text-stone-500">
                            There are no equipment listings in this category.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500">
                                <tr>
                                    <th className="px-5 py-4">Equipment</th>
                                    <th className="px-5 py-4">Owner</th>
                                    <th className="px-5 py-4">Category</th>
                                    <th className="px-5 py-4">Price</th>
                                    <th className="px-5 py-4">Quantity</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4">Date Added</th>
                                    <th className="px-5 py-4">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-stone-100">
                                {filteredEquipment.map((item) => (
                                    <tr
                                        key={item._id}
                                        className="transition hover:bg-stone-50"
                                    >
                                        {/* Equipment */}
                                        <td className="min-w-57.5 px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {item.equipmentImage ? (
                                                    <Image
                                                        src={item.equipmentImage}
                                                        alt={item.equipmentName}
                                                        className="h-12 w-12 rounded-lg border border-stone-200 object-cover"
                                                        width={2}
                                                        height={2}
                                                    />
                                                ) : (
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100 text-stone-500">
                                                        <Package size={22} />
                                                    </div>
                                                )}

                                                <div>
                                                    <p className="font-semibold text-stone-900">
                                                        {item.equipmentName}
                                                    </p>
                                                    <p className="mt-1 text-xs text-stone-500">
                                                        {item.brand} {item.model}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Owner */}
                                        <td className="min-w-45 px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <UserRound
                                                    size={16}
                                                    className="shrink-0 text-stone-400"
                                                />
                                                <div>
                                                    <p className="font-medium text-stone-800">
                                                        {item.owner?.name || "N/A"}
                                                    </p>
                                                    <p className="text-xs text-stone-500">
                                                        {item.owner?.email || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className="whitespace-nowrap px-5 py-4 text-stone-600">
                                            {item.category}
                                        </td>

                                        {/* Price */}
                                        <td className="whitespace-nowrap px-5 py-4">
                                            <span className="font-semibold text-stone-900">
                                                ৳{item.rentalPrice}
                                            </span>
                                            <span className="text-xs text-stone-500">
                                                {" "}/ {item.rentalType}
                                            </span>
                                        </td>

                                        {/* Quantity */}
                                        <td className="px-5 py-4 text-stone-600">
                                            {item.availableQuantity}
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            <span
                                                className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                                    item.status
                                                )}`}
                                            >
                                                {item.status || "Pending"}
                                            </span>
                                        </td>

                                        {/* Date */}
                                        <td className="whitespace-nowrap px-5 py-4 text-stone-600">
                                            {formatDate(item.createdAt)}
                                        </td>

                                        {/* Actions */}
                                        <td className="min-w-65 px-5 py-4">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {item.status !== "Approved" && (
                                                    <button
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                item,
                                                                "Approved"
                                                            )
                                                        }
                                                        disabled={
                                                            actionId === item._id
                                                        }
                                                        title="Approve equipment"
                                                        className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                                                    >
                                                        <CheckCircle size={14} />
                                                        Approve
                                                    </button>
                                                )}

                                                {item.status !== "Rejected" && (
                                                    <button
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                item,
                                                                "Rejected"
                                                            )
                                                        }
                                                        disabled={
                                                            actionId === item._id
                                                        }
                                                        title="Reject equipment"
                                                        className="flex items-center gap-1 rounded-lg bg-red-600 px-2.5 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                                                    >
                                                        <XCircle size={14} />
                                                        Reject
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() =>
                                                        openEditModal(item)
                                                    }
                                                    disabled={
                                                        actionId === item._id
                                                    }
                                                    className="flex items-center gap-1 rounded-lg border border-stone-300 px-2.5 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-100 disabled:opacity-50"
                                                >
                                                    <Pencil size={14} />
                                                    Update
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(item)
                                                    }
                                                    disabled={
                                                        actionId === item._id
                                                    }
                                                    className="flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                                >
                                                    <Trash2 size={14} />
                                                    Delete
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

            {/* Update Equipment Modal */}
            {editingEquipment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
                        {/* Modal Header */}
                        <div className="sticky top-0 flex items-center justify-between border-b border-stone-200 bg-white p-5">
                            <div>
                                <h2 className="text-xl font-bold text-stone-900">
                                    Update Equipment
                                </h2>
                                <p className="mt-1 text-sm text-stone-500">
                                    Edit equipment listing information.
                                </p>
                            </div>

                            <button
                                onClick={() => setEditingEquipment(null)}
                                disabled={saving}
                                className="rounded-full p-2 text-stone-500 hover:bg-stone-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
                            {(
                                [
                                    ["equipmentName", "Equipment Name"],
                                    ["category", "Category"],
                                    ["location", "Location"],
                                    ["brand", "Brand"],
                                    ["model", "Model"],
                                    ["equipmentCondition", "Condition"],
                                    ["rentalPrice", "Rental Price"],
                                    ["availableQuantity", "Available Quantity"],
                                    ["equipmentImage", "Equipment Image URL"],
                                ] as const
                            ).map(([field, label]) => (
                                <div key={field}>
                                    <label className="mb-1 block text-sm font-medium text-stone-700">
                                        {label}
                                    </label>
                                    <input
                                        type={
                                            field === "rentalPrice" ||
                                                field === "availableQuantity"
                                                ? "number"
                                                : "text"
                                        }
                                        min={
                                            field === "rentalPrice" ||
                                                field === "availableQuantity"
                                                ? "1"
                                                : undefined
                                        }
                                        value={editForm[field]}
                                        onChange={(e) =>
                                            setEditForm((previous) => ({
                                                ...previous,
                                                [field]: e.target.value,
                                            }))
                                        }
                                        className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-amber-600"
                                    />
                                </div>
                            ))}

                            {/* Rental Type */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-stone-700">
                                    Rental Type
                                </label>
                                <select
                                    value={editForm.rentalType}
                                    onChange={(e) =>
                                        setEditForm((previous) => ({
                                            ...previous,
                                            rentalType: e.target.value,
                                        }))
                                    }
                                    className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-600"
                                >
                                    <option value="Daily">Daily</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="Monthly">Monthly</option>
                                </select>
                            </div>

                            {/* Description */}
                            <div className="sm:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-stone-700">
                                    Description
                                </label>
                                <textarea
                                    rows={3}
                                    value={editForm.description}
                                    onChange={(e) =>
                                        setEditForm((previous) => ({
                                            ...previous,
                                            description: e.target.value,
                                        }))
                                    }
                                    className="w-full resize-none rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-amber-600"
                                />
                            </div>

                            {/* Rental Terms */}
                            <div className="sm:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-stone-700">
                                    Rental Terms
                                </label>
                                <textarea
                                    rows={3}
                                    value={editForm.rentalTerms}
                                    onChange={(e) =>
                                        setEditForm((previous) => ({
                                            ...previous,
                                            rentalTerms: e.target.value,
                                        }))
                                    }
                                    className="w-full resize-none rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-amber-600"
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-stone-200 bg-white p-5">
                            <button
                                onClick={() => setEditingEquipment(null)}
                                disabled={saving}
                                className="rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-100"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleEquipmentUpdate}
                                disabled={saving}
                                className="flex items-center gap-2 rounded-lg bg-amber-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-50"
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
