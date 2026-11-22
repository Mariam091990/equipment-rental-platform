
"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
    Menu,
    Package,
    ArrowRight,
    LogOut,
    LayoutDashboard,
} from "lucide-react";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";



const navLinks = [
    { name: "Home", href: "/" },
    { name: "All Equipment", href: "/AllEquipment" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "How It Works", href: "/how-it-works" },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);

    const router = useRouter();

    // Get the current authentication session
    const { data: session, isPending } = authClient.useSession();

const role = session?.user?.role?.toLowerCase();

const dashboardHref =
    role === "admin"
        ? "/admin/dashboard"
        : role === "owner"
            ? "/owner/dashboard"
            : "/customer/dashboard";


    const isLoggedIn = !!session?.user;

    // Handle logout
    const handleLogout = async () => {
        await authClient.signOut();

        setOpen(false);
        router.push("/");
        router.refresh();
    };


    const linkStyle =
        "text-sm font-medium text-stone-600 transition-colors hover:text-stone-950";

    const primaryButton =
        "inline-flex items-center justify-center rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700";

    const outlineButton =
        "inline-flex items-center justify-center rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-100";

    return (
        <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-[#FAF9F6]/95 backdrop-blur-md">

            <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-white">
                        <Package size={23} />
                    </div>

                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-stone-900">
                            Equipment Rental<span className="text-stone-500">.</span>
                        </h1>

                        <p className="text-[10px] font-medium uppercase tracking-[2px] text-stone-500">
                            Equipment Rental Platform~~
                        </p>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                {/* <div className="hidden items-center gap-7 lg:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={linkStyle}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div> */}
                {/* Desktop Navigation */}
                <div className="hidden items-center gap-7 lg:flex">
                    {navLinks.map((link) => (
                        <Tooltip key={link.name}>
                            <TooltipTrigger
                                render={
                                    <Link href={link.href} className={linkStyle}>
                                        {link.name}
                                    </Link>
                                }
                            />
                            <TooltipContent
                                side="bottom"
                                className="border-stone-700 bg-stone-900 text-white"
                            >
                                {link.name === "Home" && "Return to homepage"}
                                {link.name === "All Equipment" && "Browse available equipment"}
                                {link.name === "About Us" && "Learn more about us"}
                                {link.name === "Contact Us" && "Get in touch with us"}
                                {link.name === "How It Works" && "Learn how equipment rental works"}
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>

                {/* Desktop Authentication */}
                <div className="hidden items-center gap-3 lg:flex">
                    {!isPending && isLoggedIn && session?.user?.name && (
                        <span className="text-sm font-medium text-stone-700">
                            Welcome, {session.user.name}
                        </span>
                    )}
                    {isLoggedIn ? (
                        <>
                            <Tooltip>
                                <TooltipTrigger
                                    render={
                                        <Link
                                            href={dashboardHref}
                                            className={outlineButton}
                                        >
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            Dashboard
                                        </Link>
                                    }
                                />
                                <TooltipContent className="bg-stone-900 text-white">
                                    Manage your account and rentals
                                </TooltipContent>
                            </Tooltip>
                            {/* <Link href="/dashboard" className={outlineButton}>
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                Dashboard
                            </Link> */}

                            {/* <button
                                onClick={handleLogout}
                                className={primaryButton}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </button> */}
                            <Tooltip>
                                <TooltipTrigger
                                    render={
                                        <button
                                            onClick={handleLogout}
                                            className={primaryButton}
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Logout
                                        </button>
                                    }
                                />
                                <TooltipContent className="bg-stone-900 text-white">
                                    Sign out of your account
                                </TooltipContent>
                            </Tooltip>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/signIn"
                                className="px-3 py-2 text-sm font-medium text-stone-700 transition-colors hover:text-stone-950"
                            >
                                Login
                            </Link>

                            <Link href="/signUp" className={primaryButton}>
                                Register Now
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </>
                    )}

                </div>

                {/* Mobile Navigation */}
                <Sheet open={open} onOpenChange={setOpen}>


                    <SheetTrigger
                        aria-label="Open navigation menu"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-stone-300 text-stone-800 transition-colors hover:bg-stone-100 lg:hidden"
                    >
                        <Menu className="h-5 w-5" />
                    </SheetTrigger>

                    <SheetContent
                        side="right"
                        className="w-75 border-stone-200 bg-[#FAF9F6] sm:w-75"
                    >
                        <div className="mt-8 flex flex-col gap-6">

                            {/* Mobile Logo */}
                            <Link
                                href="/"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-2"
                            >
                                <Package className="h-7 w-7 text-stone-900" />

                                <span className="text-xl font-bold text-stone-900">
                                    Equipment Rental.
                                </span>
                            </Link>

                            <div className="h-px bg-stone-200" />

                            {/* Mobile Links */}
                            <div className="flex flex-col gap-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className="rounded-lg px-3 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-200/70 hover:text-stone-950"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>

                            <div className="h-px bg-stone-200" />

                            {/* Mobile Authentication */}
                            {isLoggedIn ? (
                                <div className="flex flex-col gap-3">

                                    <Link
                                        href={dashboardHref}
                                        onClick={() => setOpen(false)}
                                        className={outlineButton}
                                    >
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        Dashboard
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className={primaryButton}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Logout
                                    </button>

                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">

                                    <Link
                                        href="/signIn"
                                        onClick={() => setOpen(false)}
                                        className={outlineButton}
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        href="/signUp"
                                        onClick={() => setOpen(false)}
                                        className={primaryButton}
                                    >
                                        Register Now
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>

                                </div>
                            )}

                        </div>
                    </SheetContent>
                </Sheet>

            </nav>
        </header>
    );
}
