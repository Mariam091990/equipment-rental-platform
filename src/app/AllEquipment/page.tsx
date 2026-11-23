
"use client";
import { authClient } from "@/lib/auth-client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Search,
    SlidersHorizontal,
    MapPin,
    Package,
    RefreshCw,
    Heart,
    X,
    CalendarDays,
    CreditCard,
    Phone,
    // UserRound,
    FileText,
} from "lucide-react";
import { createBooking } from "@/lib/action/booking";
// import { TCommonApiResponse } from "@/types";
// import { toast } from "@/components/ui/toast";

interface IEquipment {
    _id: string;
    equipmentName: string;
    description: string;
    category: string;
    location: string;
    rentalPrice: number;
    rentalType: string;
    availableQuantity: number;
    equipmentImage: string;
    brand?: string;
    model?: string;
    status: string;
    createdAt: string;
    startDate: string;
    endDate: string

    owner?: {
        userId?: string;
        name?: string;
        email?: string;
    };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AllEquipmentPage() {


    const { data: session } = authClient.useSession();

    const customerName = session?.user?.name || "";
    const customerEmail = session?.user?.email || "";



    const [equipmentList, setEquipmentList] = useState<IEquipment[]>([]);
    const [categories, setCategories] = useState<string[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Search
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
    const [favoriteLoading, setFavoriteLoading] = useState<string | null>(null);

    // Filters
    const [category, setCategory] = useState("all");
    const [rentalType, setRentalType] = useState("all");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [availableOnly, setAvailableOnly] = useState(false);

    // Sorting
    const [sortBy, setSortBy] = useState("recent");

    // Booking modal
    const [selectedEquipment, setSelectedEquipment] =
        useState<IEquipment | null>(null);

    const [rentalStartDate, setRentalStartDate] = useState("");
    const [rentalEndDate, setRentalEndDate] = useState("");
    const [bookingQuantity, setBookingQuantity] = useState(1);
    const [customerPhone, setCustomerPhone] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [bookingNotes, setBookingNotes] = useState("");
    const [bookingError, setBookingError] = useState("");


    const fetchEquipment = useCallback(async () => {
        const params = new URLSearchParams();

        if (search.trim()) params.set("search", search.trim());
        if (category !== "all") params.set("category", category);
        if (rentalType !== "all") params.set("rentalType", rentalType);
        if (minPrice !== "") params.set("minPrice", minPrice);
        if (maxPrice !== "") params.set("maxPrice", maxPrice);
        if (availableOnly) params.set("availableOnly", "true");

        params.set("sortBy", sortBy);

        const response = await fetch(
            `${API_URL}/equipment?${params.toString()}`,
            { cache: "no-store" }
        );

        const data = await response.json();

        console.log("equipment", data);

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch equipment.");
        }

        if (!Array.isArray(data.equipment)) {
            console.error("Unexpected API response:", data);

            throw new Error(
                data.message || "Equipment data is missing from the API response."
            );
        }




        return data.equipment as IEquipment[];
    }, [
        search,
        category,
        rentalType,
        minPrice,
        maxPrice,
        availableOnly,
        sortBy,
    ]);



    useEffect(() => {
        let ignore = false;

        fetchEquipment()
            .then((data) => {
                if (!ignore) {
                    setEquipmentList(data);

                    setCategories((previousCategories) => {
                        if (previousCategories.length > 0) {
                            return previousCategories;
                        }

                        return Array.from(
                            new Set(
                                data.map((item) => item.category).filter(Boolean)
                            )
                        ).sort();
                    });

                    setError("");
                }
            })
            .catch((err) => {
                if (!ignore) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Something went wrong while fetching equipment."
                    );
                }
            })
            .finally(() => {
                if (!ignore) {
                    setLoading(false);
                }
            });

        return () => {
            ignore = true;
        };
    }, [fetchEquipment]);


    const handleRefresh = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await fetchEquipment();
            setEquipmentList(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };



    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSearch(searchInput);
    };

    const clearFilters = () => {
        setSearchInput("");
        setSearch("");
        setCategory("all");
        setRentalType("all");
        setMinPrice("");
        setMaxPrice("");
        setAvailableOnly(false);
        setSortBy("recent");
    };

    const formatPrice = (price: number) =>
        `৳${Number(price).toLocaleString("en-BD")}`;



    const getTodayDate = () => {
        return new Date().toISOString().split("T")[0];
    };

    const getRentalDuration = () => {
        if (!rentalStartDate || !rentalEndDate) return 0;

        const start = new Date(`${rentalStartDate}T00:00:00`);
        const end = new Date(`${rentalEndDate}T00:00:00`);

        const difference = Math.floor(
            (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Include both the start and end dates
        return difference >= 0 ? difference + 1 : 0;
    };

    const getRentalPeriods = () => {
        const days = getRentalDuration();

        if (!days || !selectedEquipment) return 0;

        switch (selectedEquipment.rentalType) {
            case "Daily":
                return days;

            case "Weekly":
                return Math.ceil(days / 7);

            case "Monthly":
                return Math.ceil(days / 30);

            default:
                return 0;
        }
    };

    const getTotalBookingAmount = () => {
        if (!selectedEquipment) return 0;

        return (
            selectedEquipment.rentalPrice *
            getRentalPeriods() *
            bookingQuantity
        );
    };

    const openBookingModal = (item: IEquipment) => {
        setSelectedEquipment(item);
        setRentalStartDate("");
        setRentalEndDate("");
        setBookingQuantity(1);
        setCustomerPhone("");
        setDeliveryAddress("");
        setBookingNotes("");
        setBookingError("");
    };

    const closeBookingModal = () => {
        setSelectedEquipment(null);
        setBookingError("");
    };



    const handleAddFavorite = async (item: IEquipment) => {
        try {
            setFavoriteLoading(item._id);

            const { data, error } = await authClient.token();

            if (error || !data?.token) {
                throw new Error("Please sign in as a customer to add favorites.");
            }

            const response = await fetch(`${API_URL}/favorites`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${data.token}`,
                },
                body: JSON.stringify({
                    equipmentId: item._id,
                    equipmentName: item.equipmentName,
                    description: item.description,
                    category: item.category,
                    location: item.location,
                    rentalPrice: item.rentalPrice,
                    rentalType: item.rentalType,
                    availableQuantity: item.availableQuantity,
                    equipmentImage: item.equipmentImage,
                    brand: item.brand,
                    model: item.model,
                    status: item.status,
                    createdAt: item.createdAt,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to add favorite.");
            }

            setFavoriteIds((previous) => {
                const updated = new Set(previous);
                updated.add(item._id);
                return updated;
            });

            alert("Equipment added to favorites successfully!");

        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setFavoriteLoading(null);
        }
    };





    // const handleBookingSubmit = async (item: IEquipment) => {
    //     try {
    //         const res = await createBooking({
    //             equipmentId: item._id,
    //             userEmail: customerEmail || "",
    //         });

    //         if (res.success && res.url) {
    //             console.log("Stripe Checkout URL:", res.url);

    //             // Redirect customer to Stripe Checkout
    //             window.location.href = res.url;
    //         }
    //     } catch (error) {
    //         console.error("Error creating booking", error);
    //     }
    // };


    const handleBookingSubmit = async (item: IEquipment) => {
        try {
            setBookingError("");

            if (!rentalStartDate || !rentalEndDate) {
                setBookingError("Please select your rental dates.");
                return;
            }

            if (!customerPhone.trim() || !deliveryAddress.trim()) {
                setBookingError("Please provide your phone number and delivery address.");
                return;
            }

            const res = await createBooking({
                equipmentId: item._id,
                equipmentName: item.equipmentName,
                userEmail: customerEmail,
                startDate: rentalStartDate,
                endDate: rentalEndDate,
                rentalDuration: getRentalDuration(),
                rentalPeriods: getRentalPeriods(),
                quantity: bookingQuantity,
                customerPhone,
                deliveryAddress,
                bookingNotes,
            });

            if (res.success && res.url) {
                window.location.href = res.url;
            } else {
                setBookingError("Unable to create your booking. Please try again.");
            }
        } catch (error) {
            console.error("Error creating booking", error);

            setBookingError(
                error instanceof Error ? error.message : "Something went wrong."
            );
        }
    };

    return (
        <main className="min-h-screen bg-[#FAF8F5]">


            {/* Page Banner */}
            <section className="bg-[#292524] px-5 py-12 text-white sm:py-16">
                <div className="mx-auto max-w-7xl">
                    <div className="max-w-3xl">
                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-stone-400">
                            RentalHub Collection
                        </p>

                        <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
                            Find the Right Equipment
                        </h1>

                        <p className="mt-4 max-w-xl text-sm leading-7 text-stone-300 sm:text-base">
                            Explore quality equipment for your projects and events.
                            Compare rental options and find what you need.
                        </p>
                    </div>

                    {/* Search inside Hero */}
                    <form
                        onSubmit={handleSearch}
                        className="mt-8 flex w-full max-w-2xl items-center overflow-hidden rounded-xl bg-white shadow-lg"
                    >
                        <Search className="ml-4 shrink-0 text-stone-400" size={20} />

                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search equipment name or location..."
                            className="w-full px-3 py-4 text-sm text-stone-700 outline-none"
                        />

                        <button
                            type="submit"
                            className="m-1.5 rounded-lg bg-[#292524] px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
                        >
                            Search
                        </button>
                    </form>
                    <div>
                        <Link
                            href="/"
                            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-stone-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
                        >
                            Home
                        </Link>
                    </div>
                </div>
            </section>



            {/* Main Content */}
            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

                {/* Filter Panel */}
                <div className="mb-10 rounded-2xl border border-[#E7E5E4] bg-white p-5 shadow-sm sm:p-6">

                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="flex items-center gap-2 text-lg font-bold text-[#292524]">
                                <SlidersHorizontal size={19} />
                                Refine Your Search
                            </h2>

                            <p className="mt-1 text-sm text-stone-500">
                                Find equipment that matches your requirements.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="text-sm font-semibold text-stone-700 underline underline-offset-4 transition hover:text-black"
                        >
                            Clear All Filters
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                        {/* Category */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-stone-700">
                                Category
                            </label>

                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full rounded-lg border border-stone-200 bg-[#FAF9F6] px-3 py-3 text-sm text-stone-700 outline-none focus:border-stone-500"
                            >
                                <option value="all">All Categories</option>

                                {categories.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Rental Type */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-stone-700">
                                Rental Type
                            </label>

                            <select
                                value={rentalType}
                                onChange={(e) => setRentalType(e.target.value)}
                                className="w-full rounded-lg border border-stone-200 bg-[#FAF9F6] px-3 py-3 text-sm text-stone-700 outline-none focus:border-stone-500"
                            >
                                <option value="all">All Rental Types</option>
                                <option value="Daily">Daily</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                            </select>
                        </div>

                        {/* Minimum Price */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-stone-700">
                                Minimum Price
                            </label>

                            <input
                                type="number"
                                min="0"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                placeholder="৳ Minimum"
                                className="w-full rounded-lg border border-stone-200 bg-[#FAF9F6] px-3 py-3 text-sm outline-none focus:border-stone-500"
                            />
                        </div>

                        {/* Maximum Price */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-stone-700">
                                Maximum Price
                            </label>

                            <input
                                type="number"
                                min="0"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                placeholder="৳ Maximum"
                                className="w-full rounded-lg border border-stone-200 bg-[#FAF9F6] px-3 py-3 text-sm outline-none focus:border-stone-500"
                            />
                        </div>
                    </div>

                    {/* Availability Filter */}
                    <div className="mt-5 flex items-center border-t border-stone-100 pt-4">
                        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-stone-700">
                            <input
                                type="checkbox"
                                checked={availableOnly}
                                onChange={(e) => setAvailableOnly(e.target.checked)}
                                className="h-4 w-4 accent-stone-800"
                            />
                            Show available equipment only
                        </label>
                    </div>
                </div>

                {/* Equipment Results */}
                <div>

                    {/* Results Heading and Sorting */}
                    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">
                                Explore Our Collection
                            </p>

                            <h2 className="mt-1 text-2xl font-bold text-[#292524] sm:text-3xl">
                                Available Equipment
                            </h2>

                            <p className="mt-2 text-sm text-stone-500">
                                {loading
                                    ? "Loading equipment..."
                                    : `Showing ${equipmentList.length} equipment`}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">

                            <label
                                htmlFor="sort"
                                className="shrink-0 text-sm font-medium text-stone-600"
                            >
                                Sort by:
                            </label>

                            <select
                                id="sort"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-stone-500 sm:w-48"
                            >
                                <option value="recent">Recently Added</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>

                            <button
                                type="button"
                                onClick={handleRefresh}
                                disabled={loading}
                                title="Refresh equipment"
                                className="rounded-lg border border-stone-200 bg-white p-2.5 text-stone-600 transition hover:bg-stone-100 disabled:opacity-50"
                            >
                                <RefreshCw
                                    size={17}
                                    className={loading ? "animate-spin" : ""}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading ? (

                        <div className="flex min-h-80 items-center justify-center rounded-2xl border border-stone-200 bg-white">
                            <div className="text-center">
                                <RefreshCw
                                    size={30}
                                    className="mx-auto animate-spin text-stone-700"
                                />

                                <p className="mt-3 text-sm text-stone-500">
                                    Finding available equipment...
                                </p>
                            </div>
                        </div>

                    ) : error ? (

                        /* Error State */
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

                            <p className="font-semibold text-red-700">
                                Unable to load equipment
                            </p>

                            <p className="mt-2 text-sm text-red-600">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={handleRefresh}
                                className="mt-4 rounded-lg bg-[#292524] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700"
                            >
                                Try Again
                            </button>
                        </div>

                    ) : equipmentList.length === 0 ? (

                        /* Empty State */
                        <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white px-5 text-center">

                            <div className="rounded-full bg-stone-100 p-5">
                                <Package size={35} className="text-stone-400" />
                            </div>

                            <h3 className="mt-4 text-lg font-semibold text-stone-800">
                                No Equipment Found
                            </h3>

                            <p className="mt-2 max-w-sm text-sm leading-6 text-stone-500">
                                No equipment matches your current search or filters.
                                Try changing your search criteria.
                            </p>

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="mt-5 rounded-lg bg-[#292524] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700"
                            >
                                Clear Filters
                            </button>
                        </div>

                    ) : (

                        /* Equipment Cards */
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">

                            {equipmentList.map((item) => (

                                <article
                                    key={item._id}
                                    className="group overflow-hidden rounded-2xl border border-[#E7E5E4] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                                >

                                    {/* Equipment Image */}
                                    <div className="relative h-52 overflow-hidden bg-stone-100">

                                        {item.equipmentImage ? (
                                            <Image
                                                src={item.equipmentImage}
                                                alt={item.equipmentName}
                                                loading="lazy"
                                                fill
                                                unoptimized
                                                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                                className="object-cover transition duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center">
                                                <Package
                                                    size={45}
                                                    className="text-stone-300"
                                                />
                                            </div>
                                        )}

                                        {/* Availability Badge */}
                                        <span
                                            className={`absolute right-3 top-3 rounded-full px-3 py-1.5 text-xs font-semibold text-white ${item.availableQuantity > 0
                                                ? "bg-emerald-600"
                                                : "bg-red-600"
                                                }`}
                                        >
                                            {item.availableQuantity > 0
                                                ? "Available"
                                                : "Unavailable"}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleAddFavorite(item)}
                                            disabled={favoriteLoading === item._id || favoriteIds.has(item._id)}
                                            aria-label="Add to favorites"
                                            className="absolute left-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110 disabled:cursor-not-allowed"
                                        >
                                            <Heart
                                                size={20}
                                                className={
                                                    favoriteIds.has(item._id)
                                                        ? "fill-red-500 text-red-500"
                                                        : "text-stone-600"
                                                }
                                            />
                                        </button>

                                    </div>

                                    {/* Equipment Information */}
                                    <div className="p-5">

                                        <div className="flex items-start justify-between gap-3">
                                            <h2 className="truncate text-lg font-bold text-[#292524]">
                                                {item.equipmentName}
                                            </h2>
                                        </div>

                                        <span className="mt-2 inline-block rounded-md bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
                                            {item.category}
                                        </span>

                                        {/* Location */}
                                        <div className="mt-4 flex items-center gap-2 text-sm text-stone-500">
                                            <MapPin
                                                size={15}
                                                className="shrink-0 text-stone-700"
                                            />
                                            <span className="truncate">
                                                {item.location}
                                            </span>
                                        </div>


                                        {/* Equipment Owner */}
                                        <div className="mt-4 flex items-center gap-3 rounded-xl border border-stone-100 bg-stone-50 p-3">
                                            {/* <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                                               <UserRound size={19} />
                                            </div>  */}

                                            <div className="min-w-0">
                                                <p className="text-xs text-stone-500">
                                                    Equipment Owner
                                                </p>

                                                <p className="truncate text-sm font-semibold text-stone-800">
                                                    {item.owner?.name || "Equipment Owner"}
                                                </p>
                                            </div>
                                        </div>


                                        {/* Rental Type */}
                                        <div className="mt-4 flex items-center justify-between text-sm">
                                            <span className="text-stone-500">
                                                Rental Type
                                            </span>

                                            <span className="font-medium text-stone-700">
                                                {item.rentalType}
                                            </span>
                                        </div>

                                        {/* Available Quantity */}
                                        <div className="mt-2 flex items-center justify-between text-sm">
                                            <span className="text-stone-500">
                                                Available Quantity
                                            </span>

                                            <span className="font-medium text-stone-700">
                                                {item.availableQuantity}
                                            </span>
                                        </div>

                                        {/* Price */}
                                        <div className="mt-5 border-t border-stone-100 pt-4">

                                            <div className="mb-4">
                                                <p className="text-xl font-bold text-[#292524]">
                                                    {formatPrice(item.rentalPrice)}
                                                </p>

                                                <p className="mt-1 text-xs text-stone-400">
                                                    Per {item.rentalType.toLowerCase()}
                                                </p>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="grid grid-cols-2 gap-2">

                                                <Link
                                                    href={`/equipment/${item._id}`}
                                                    className="flex items-center justify-center rounded-lg border border-stone-300 px-2 py-2.5 text-xs font-semibold text-stone-800 transition hover:bg-stone-100 sm:text-sm"
                                                >
                                                    View Details
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => openBookingModal(item)}
                                                    disabled={item.availableQuantity <= 0}
                                                    className="rounded-lg bg-[#292524] px-2 py-2.5 text-xs font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-400 sm:text-sm"
                                                >
                                                    Book Now
                                                </button>

                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}

                        </div>
                    )}
                </div>
            </section>



            {/* Booking Modal */}
            {selectedEquipment && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
                    onClick={closeBookingModal}
                >
                    <div
                        className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between bg-stone-900 px-6 py-5 text-white">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest text-orange-300">
                                    RentalHub Booking
                                </p>
                                <h2 className="mt-1 text-xl font-bold">
                                    Book Equipment
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={closeBookingModal}
                                className="rounded-full p-2 transition hover:bg-stone-700"
                                aria-label="Close booking modal"
                            >
                                <X size={21} />
                            </button>
                        </div>

                        <div className="max-h-[75vh] space-y-6 overflow-y-auto p-6">
                            {/* Selected Equipment */}
                            <div className="flex gap-4 rounded-xl border border-stone-200 bg-stone-50 p-3">
                                <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-lg bg-stone-200">
                                    {selectedEquipment.equipmentImage && (
                                        <Image
                                            src={selectedEquipment.equipmentImage}
                                            alt={selectedEquipment.equipmentName}
                                            fill
                                            unoptimized
                                            className="object-cover"
                                        />
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h3 className="font-bold text-stone-900">
                                        {selectedEquipment.equipmentName}
                                    </h3>
                                    <h3 className="font-bold text-stone-900">
                                        EquipmentId:{selectedEquipment._id}
                                    </h3>

                                    <p className="mt-1 text-xs text-stone-500">
                                        {selectedEquipment.category}
                                    </p>

                                    <p className="mt-1 flex items-center gap-1 text-xs text-stone-500">
                                        <MapPin size={13} />
                                        {selectedEquipment.location}
                                    </p>

                                    <p className="mt-2 font-bold text-orange-700">
                                        {formatPrice(selectedEquipment.rentalPrice)}
                                        <span className="ml-1 text-xs font-normal text-stone-500">
                                            / {selectedEquipment.rentalType.toLowerCase()}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Rental Dates */}
                            <div>
                                <h3 className="mb-3 flex items-center gap-2 font-semibold text-stone-900">
                                    <CalendarDays size={18} className="text-orange-700" />
                                    Rental Duration
                                </h3>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-stone-700">
                                            Start Date
                                        </label>

                                        <input
                                            type="date"
                                            // min={today}
                                            min={getTodayDate()}
                                            value={rentalStartDate}
                                            onChange={(e) => {
                                                setRentalStartDate(e.target.value);

                                                if (
                                                    rentalEndDate &&
                                                    e.target.value > rentalEndDate
                                                ) {
                                                    setRentalEndDate("");
                                                }
                                            }}
                                            className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-orange-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-stone-700">
                                            End Date
                                        </label>

                                        <input
                                            type="date"
                                            // min={rentalStartDate || today}
                                            min={rentalStartDate || getTodayDate()}
                                            value={rentalEndDate}
                                            onChange={(e) => setRentalEndDate(e.target.value)}
                                            className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-orange-500"
                                        />
                                    </div>
                                </div>

                                {getRentalDuration() > 0 && (
                                    <p className="mt-2 text-xs text-stone-500">
                                        Rental duration: {getRentalDuration()} day(s)
                                        {" · "}
                                        {getRentalPeriods()} {selectedEquipment.rentalType.toLowerCase()} period(s)
                                    </p>
                                )}
                            </div>

                            {/* Quantity */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-stone-700">
                                    Required Quantity
                                </label>

                                <input
                                    type="number"
                                    min={1}
                                    max={selectedEquipment.availableQuantity}
                                    value={bookingQuantity}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);

                                        setBookingQuantity(
                                            Math.min(
                                                selectedEquipment.availableQuantity,
                                                Math.max(1, value || 1)
                                            )
                                        );
                                    }}
                                    className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-orange-500"
                                />

                                <p className="mt-1 text-xs text-stone-500">
                                    {selectedEquipment.availableQuantity} unit(s) currently available
                                </p>
                            </div>

                            {/* Customer Information */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-stone-900">
                                    Customer Information
                                </h3>

                                {/* Customer Name */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-stone-700">
                                        Customer Name
                                    </label>

                                    <input
                                        type="text"
                                        value={customerName}
                                        readOnly
                                        placeholder="Customer name"
                                        className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm text-stone-700 outline-none"
                                    />
                                </div>

                                {/* Customer Email */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-stone-700">
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        value={customerEmail}
                                        readOnly
                                        placeholder="Customer email"
                                        className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm text-stone-700 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-stone-700">
                                        <Phone size={15} />
                                        Contact Number
                                    </label>

                                    <input
                                        type="tel"
                                        value={customerPhone}
                                        onChange={(e) => setCustomerPhone(e.target.value)}
                                        placeholder="Enter your contact number"
                                        className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-stone-700">
                                        <MapPin size={15} />
                                        Delivery Address
                                    </label>

                                    <textarea
                                        rows={2}
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        placeholder="Enter your complete delivery address"
                                        className="w-full resize-none rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-stone-700">
                                        <FileText size={15} />
                                        Additional Notes (Optional)
                                    </label>

                                    <textarea
                                        rows={2}
                                        value={bookingNotes}
                                        onChange={(e) => setBookingNotes(e.target.value)}
                                        placeholder="Any additional instructions..."
                                        className="w-full resize-none rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-orange-500"
                                    />
                                </div>
                            </div>

                            {/* Booking Summary */}
                            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                                <h3 className="mb-3 font-semibold text-stone-900">
                                    Booking Summary
                                </h3>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-stone-600">
                                        <span>Rental price</span>
                                        <span>
                                            {formatPrice(selectedEquipment.rentalPrice)}
                                            / {selectedEquipment.rentalType.toLowerCase()}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-stone-600">
                                        <span>Rental periods</span>
                                        <span>{getRentalPeriods()}</span>
                                    </div>

                                    <div className="flex justify-between text-stone-600">
                                        <span>Quantity</span>
                                        <span>{bookingQuantity}</span>
                                    </div>

                                    <div className="border-t border-stone-200 pt-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-stone-900">
                                                Estimated Total
                                            </span>

                                            <span className="text-xl font-bold text-orange-700">
                                                {formatPrice(getTotalBookingAmount())}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Status */}
                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                                <div className="flex items-start gap-3">
                                    <CreditCard
                                        size={20}
                                        className="mt-0.5 shrink-0 text-amber-700"
                                    />

                                </div>
                            </div>

                            {bookingError && (
                                <p className="text-sm text-red-600">{bookingError}</p>
                            )}

                            {/* Payment Button */}
                            <div>
                                {session ? (<button onClick={() => handleBookingSubmit(selectedEquipment)}

                                    type="button"

                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-stone-700 px-5 py-3 font-semibold text-white"
                                >
                                    <CreditCard size={18} />
                                    Pay{formatPrice(getTotalBookingAmount())} Now
                                </button>) :
                                    (<Link href="/"><button
                                        type="button"

                                        className="flex w-full  items-center justify-center gap-2 rounded-lg bg-stone-400 px-5 py-3 font-semibold text-white"
                                    >
                                        <CreditCard size={18} />
                                        Please Login to Book
                                    </button></Link>)
                                }
                            </div>
                            <button
                                type="button"
                                onClick={closeBookingModal}
                                className="w-full rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </main>
    );
}
