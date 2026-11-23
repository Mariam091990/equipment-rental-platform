
import Link from "next/link";
import {
    Mail,
    MapPin,
    ArrowUpRight,
    Package,
    ShieldCheck,
    Clock,
} from "lucide-react";

import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
} from "react-icons/fa";

const currentYear = new Date().getFullYear();

const footerLinks = {
    platform: [
        { label: "Home", href: "/" },
        { label: "Browse Equipment", href: "/AllEquipment" },
        { label: "My Rentals", href: "/customer/my-rentals" },
        { label: "My Favorites", href: "/customer/favorites" },
    ],
    services: [
        { label: "Equipment Rental", href: "/AllEquipment" },
        { label: "Browse Categories", href: "/AllEquipment" },
        { label: "Customer Dashboard", href: "/customer/my-rentals" },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-[#101827] text-white">
            {/* Main footer */}
            <div className="mx-auto max-w-7xl px-5 pb-12 pt-16 sm:px-8 lg:px-10">

                <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">

                    {/* Brand information */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
                                <Package size={24} className="text-white" />
                            </div>

                            <span className="text-2xl font-bold tracking-tight">
                                Equip<span className="text-blue-400">Rent</span>
                            </span>
                        </Link>

                        <p className="mt-5 max-w-xs text-sm leading-7 text-slate-400">
                            Your trusted destination for reliable equipment rentals.
                            Find the right equipment, book with confidence, and get
                            your projects moving.
                        </p>

                        {/* Social links */}
                        <div className="mt-6 flex items-center gap-3">
                            <SocialLink
                                href="https://www.facebook.com/"
                                label="Facebook"
                                icon={<FaFacebookF size={17} />}
                            />

                            <SocialLink
                                href="https://www.instagram.com/"
                                label="Instagram"
                                icon={<FaInstagram size={17} />}
                            />

                            <SocialLink
                                href="https://www.linkedin.com/"
                                label="LinkedIn"
                                icon={<FaLinkedinIn size={17} />}
                            />
                        </div>
                    </div>

                    {/* Platform links */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                            Platform
                        </h3>

                        <ul className="mt-6 space-y-4">
                            {footerLinks.platform.map((link) => (
                                <li key={link.label}>
                                    <FooterLink href={link.href}>
                                        {link.label}
                                    </FooterLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                            Our Services
                        </h3>

                        <ul className="mt-6 space-y-4">
                            {footerLinks.services.map((link) => (
                                <li key={link.label}>
                                    <FooterLink href={link.href}>
                                        {link.label}
                                    </FooterLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                            Get in Touch
                        </h3>

                        <p className="mt-6 text-sm leading-7 text-slate-400">
                            Have questions about equipment rentals? We&aposre here to help.
                        </p>

                        <div className="mt-5 space-y-4">
                            <ContactItem
                                icon={<Mail size={17} />}
                                text="Contact our support team"
                            />

                            <ContactItem
                                icon={<MapPin size={17} />}
                                text="Bangladesh"
                            />
                        </div>
                    </div>
                </div>

                {/* Trust section */}
                <div className="mt-14 grid grid-cols-1 gap-5 border-y border-slate-700/70 py-7 sm:grid-cols-3">

                    <TrustItem
                        icon={<ShieldCheck size={21} />}
                        title="Secure Booking"
                        description="A secure rental booking experience"
                    />

                    <TrustItem
                        icon={<Package size={21} />}
                        title="Quality Equipment"
                        description="Equipment for different project needs"
                    />

                    <TrustItem
                        icon={<Clock size={21} />}
                        title="Flexible Rentals"
                        description="Rental periods to suit your needs"
                    />
                </div>

                {/* Bottom footer */}
                <div className="flex flex-col items-center justify-between gap-4 pt-8 text-center sm:flex-row sm:text-left">
                    <p className="text-sm text-slate-400">
                        © {currentYear} EquipRent. All rights reserved.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
                        <Link
                            href="/"
                            className="transition hover:text-white"
                        >
                            Privacy Policy
                        </Link>

                        <Link
                            href="/"
                            className="transition hover:text-white"
                        >
                            Terms & Conditions
                        </Link>

                        <Link
                            href="/AllEquipment"
                            className="inline-flex items-center gap-1 font-medium text-blue-400 transition hover:text-blue-300"
                        >
                            Explore Equipment
                            <ArrowUpRight size={15} />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// Reusable footer link
function FooterLink({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className="text-sm text-slate-400 transition duration-200 hover:translate-x-1 hover:text-blue-400"
        >
            {children}
        </Link>
    );
}

// Social media link
function SocialLink({
    href,
    label,
    icon,
}: {
    href: string;
    label: string;
    icon: React.ReactNode;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition hover:border-blue-500 hover:bg-blue-600 hover:text-white"
        >
            {icon}
        </a>
    );
}

// Contact information
function ContactItem({
    icon,
    text,
}: {
    icon: React.ReactNode;
    text: string;
}) {
    return (
        <div className="flex items-center gap-3 text-sm text-slate-400">
            <span className="text-blue-400">{icon}</span>
            <span>{text}</span>
        </div>
    );
}

// Trust information
function TrustItem({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-blue-400">
                {icon}
            </div>

            <div>
                <h4 className="text-sm font-semibold text-white">
                    {title}
                </h4>
                <p className="mt-1 text-xs text-slate-400">
                    {description}
                </p>
            </div>
        </div>
    );
}
