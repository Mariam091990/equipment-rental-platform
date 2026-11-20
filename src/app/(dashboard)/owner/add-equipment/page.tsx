
"use client";

import { useState, type ChangeEvent} from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Upload, Loader2, PackagePlus } from "lucide-react";
import Image from "next/image";

const categories = [
    "Construction Equipment",
    "Photography Equipment",
    "Vehicles & Transportation",
    "Agriculture Equipment",
    "Electronics",
    "Event Equipment",
];

const initialForm = {
    equipmentName: "",
    description: "",
    category: "",
    location: "",
    rentalPrice: "",
    rentalType: "Daily",
    availableQuantity: "",
    equipmentCondition: "Good",
    brand: "",
    model: "",
    rentalTerms: "",
};

export default function AddEquipmentPage() {
    const [form, setForm] = useState(initialForm);
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5 MB.");
            return;
        }

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const uploadImage = async () => {
        if (!image) throw new Error("Please select an equipment image.");

        const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

        if (!apiKey) throw new Error("ImgBB API key is missing.");

        const imageData = new FormData();
        imageData.append("image", image);

        const response = await fetch(
            `https://api.imgbb.com/1/upload?key=${apiKey}`,
            {
                method: "POST",
                body: imageData,
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error("Image upload failed. Please try again.");
        }

        return result.data.url as string;
    };

    const handleAddEquipment = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!image) {
            toast.error("Please upload an equipment image.");
            return;
        }

        if (
            !Number.isFinite(Number(form.rentalPrice)) ||
            Number(form.rentalPrice) <= 0
        ) {
            toast.error("Enter a valid rental price.");
            return;
        }

        if (
            !Number.isInteger(Number(form.availableQuantity)) ||
            Number(form.availableQuantity) <= 0
        ) {
            toast.error("Available quantity must be a positive whole number.");
            return;
        }

        try {
            setLoading(true);

            // Get the current user's JWT
            const { data, error } = await authClient.token();

            if (error || !data?.token) {
                throw new Error("Your session has expired. Please sign in again.");
            }

            // Upload equipment image to ImgBB
            const equipmentImage = await uploadImage();

            // Send equipment information to Express backend
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/equipment`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${data.token}`,
                    },
                    body: JSON.stringify({
                        ...form,
                        rentalPrice: Number(form.rentalPrice),
                        availableQuantity: Number(form.availableQuantity),
                        equipmentImage,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to add equipment.");
            }

            toast.success("Equipment added successfully! Waiting for admin approval.");

            setForm(initialForm);
            setImage(null);
            setPreview("");

            const fileInput = document.getElementById(
                "equipmentImage"
            ) as HTMLInputElement | null;

            if (fileInput) fileInput.value = "";
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-stone-600 focus:ring-2 focus:ring-stone-200";

    const labelClass = "mb-2 block text-sm font-medium text-stone-700";

    return (
        <div className="min-h-screen bg-[#FAF9F6] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <div className="mb-3 flex items-center gap-3">
                        <div className="rounded-xl bg-stone-900 p-3 text-white">
                            <PackagePlus size={23} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-stone-900">
                                Add New Equipment
                            </h1>
                            <p className="mt-1 text-sm text-stone-500">
                                List your equipment and make it available for rent.
                            </p>
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={handleAddEquipment}
                    className="space-y-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8"
                >
                    {/* Equipment information */}
                    <section>
                        <h2 className="mb-5 border-b border-stone-200 pb-3 text-lg font-semibold text-stone-900">
                            Equipment Information
                        </h2>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <label className={labelClass}>Equipment Name *</label>
                                <input
                                    name="equipmentName"
                                    value={form.equipmentName}
                                    onChange={handleChange}
                                    placeholder="e.g. Excavator"
                                    className={inputClass}
                                    required
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Category *</label>
                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className={inputClass}
                                    required
                                >
                                    <option value="">Select category</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelClass}>Description *</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Describe your equipment..."
                                    className={inputClass}
                                    required
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Brand *</label>
                                <input
                                    name="brand"
                                    value={form.brand}
                                    onChange={handleChange}
                                    placeholder="Equipment brand"
                                    className={inputClass}
                                    required
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Model *</label>
                                <input
                                    name="model"
                                    value={form.model}
                                    onChange={handleChange}
                                    placeholder="Equipment model"
                                    className={inputClass}
                                    required
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Equipment Condition *</label>
                                <select
                                    name="equipmentCondition"
                                    value={form.equipmentCondition}
                                    onChange={handleChange}
                                    className={inputClass}
                                    required
                                >
                                    <option value="New">New</option>
                                    <option value="Like New">Like New</option>
                                    <option value="Good">Good</option>
                                    <option value="Fair">Fair</option>
                                    <option value="Used">Used</option>
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>Location *</label>
                                <input
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    placeholder="City or area"
                                    className={inputClass}
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    {/* Rental information */}
                    <section>
                        <h2 className="mb-5 border-b border-stone-200 pb-3 text-lg font-semibold text-stone-900">
                            Rental Information
                        </h2>

                        <div className="grid gap-5 md:grid-cols-3">
                            <div>
                                <label className={labelClass}>Rental Price *</label>
                                <input
                                    type="number"
                                    name="rentalPrice"
                                    value={form.rentalPrice}
                                    onChange={handleChange}
                                    placeholder="e.g. 1500"
                                    min="0.01"
                                    step="0.01"
                                    className={inputClass}
                                    required
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Rental Type *</label>
                                <select
                                    name="rentalType"
                                    value={form.rentalType}
                                    onChange={handleChange}
                                    className={inputClass}
                                    required
                                >
                                    <option value="Daily">Daily</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="Monthly">Monthly</option>
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>Available Quantity *</label>
                                <input
                                    type="number"
                                    name="availableQuantity"
                                    value={form.availableQuantity}
                                    onChange={handleChange}
                                    placeholder="e.g. 5"
                                    min="1"
                                    step="1"
                                    className={inputClass}
                                    required
                                />
                            </div>

                            <div className="md:col-span-3">
                                <label className={labelClass}>
                                    Rental Terms and Conditions *
                                </label>
                                <textarea
                                    name="rentalTerms"
                                    value={form.rentalTerms}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Write your rental rules, deposit requirements, return policy, etc."
                                    className={inputClass}
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    {/* Image upload */}
                    <section>
                        <h2 className="mb-5 border-b border-stone-200 pb-3 text-lg font-semibold text-stone-900">
                            Equipment Image
                        </h2>

                        <label className={labelClass}>Upload Image *</label>

                        <label
                            htmlFor="equipmentImage"
                            className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 p-5 text-center transition hover:border-stone-500"
                        >
                            {preview ? (
                                <Image
                                    src={preview}
                                    alt="Equipment preview"
                                    className="max-h-56 max-w-full rounded-lg object-contain"
                                    width={200}
                                    height={200}
                                />
                            ) : (
                                <>
                                    <Upload size={30} className="mb-3 text-stone-500" />
                                    <span className="font-medium text-stone-700">
                                        Click to upload equipment image
                                    </span>
                                    <span className="mt-1 text-xs text-stone-500">
                                        PNG, JPG or WEBP (Maximum 5 MB)
                                    </span>
                                </>
                            )}

                            <input
                                id="equipmentImage"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </section>

                    {/* Status information */}
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <p className="text-sm font-semibold text-amber-900">
                            Equipment approval status: Pending
                        </p>
                        <p className="mt-1 text-xs text-amber-800">
                            Your equipment will be available to customers after admin approval.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-stone-900 px-6 py-3 font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <PackagePlus size={18} />
                                Add Equipment
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
