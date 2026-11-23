
"use client";

import { FormEvent, useState } from "react";
import {
    Mail,
   
    Clock,
    Send,
    MessageCircle,
    CheckCircle2,
} from "lucide-react";

const SUPPORT_EMAIL = "admin_panel@gmail.com";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const name = String(formData.get("name") || "");
        const email = String(formData.get("email") || "");
        const subject = String(formData.get("subject") || "");
        const message = String(formData.get("message") || "");

        const mailtoLink =
            `mailto:${SUPPORT_EMAIL}` +
            `?subject=${encodeURIComponent(subject)}` +
            `&body=${encodeURIComponent(
                `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
            )}`;

        window.location.href = mailtoLink;
        setSubmitted(true);
        event.currentTarget.reset();
    };

    return (
        <main className="min-h-screen bg-[#faf9f6] text-stone-800">
            {/* Hero */}
            <section className="bg-[#172b28] px-6 py-20 text-center text-white md:py-24">
                <span className="inline-block rounded-full border border-orange-300/30 bg-orange-400/10 px-4 py-2 text-sm font-medium text-orange-200">
                    We&apos;d Love to Hear From You
                </span>

                <h1 className="mt-6 text-4xl font-bold md:text-5xl">
                    Get in <span className="text-orange-400">Touch</span>
                </h1>

                <p className="mx-auto mt-5 max-w-2xl leading-8 text-stone-300">
                    Have a question about equipment rentals, payments, or your account?
                    Send us a message and we&apos;ll be happy to help.
                </p>
            </section>

            {/* Contact Content */}
            <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-5">
                {/* Contact Information */}
                <div className="lg:col-span-2">
                    <span className="text-sm font-bold uppercase tracking-widest text-orange-600">
                        Contact Information
                    </span>

                    <h2 className="mt-3 text-3xl font-bold">
                        Let&apos;s start a conversation.
                    </h2>

                    <p className="mt-4 leading-8 text-stone-600">
                        Our team is here to help you with your equipment rental experience.
                        Reach out using the contact details or send us a message.
                    </p>

                    <div className="mt-9 space-y-5">
                        <div className="flex items-start gap-4 rounded-2xl border border-stone-200 bg-white p-5">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                                <Mail size={22} />
                            </div>
                            <div>
                                <h3 className="font-semibold">Email Us</h3>
                                <p className="mt-1 break-all text-sm text-stone-500">
                                    {SUPPORT_EMAIL}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 rounded-2xl border border-stone-200 bg-white p-5">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                                <MessageCircle size={22} />
                            </div>
                            <div>
                                <h3 className="font-semibold">Customer Support</h3>
                                <p className="mt-1 text-sm leading-6 text-stone-500">
                                    Questions about bookings, payments, or equipment listings?
                                    We&apos;re here to help.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 rounded-2xl border border-stone-200 bg-white p-5">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                                <Clock size={22} />
                            </div>
                            <div>
                                <h3 className="font-semibold">Working Hours</h3>
                                <p className="mt-1 text-sm text-stone-500">
                                    Sunday – Thursday
                                </p>
                                <p className="text-sm text-stone-500">
                                    9:00 AM – 6:00 PM
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm md:p-10 lg:col-span-3">
                    <h2 className="text-2xl font-bold">Send Us a Message</h2>
                    <p className="mt-2 text-sm text-stone-500">
                        Fill out the form below and we&apos;ll get back to you.
                    </p>

                    {submitted && (
                        <div className="mt-6 flex items-center gap-3 rounded-xl bg-green-50 p-4 text-sm text-green-700">
                            <CheckCircle2 size={20} />
                            Your email application should open with your message. Please
                            send the email to complete your inquiry.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-semibold"
                                >
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter your name"
                                    required
                                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-semibold"
                                >
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="subject"
                                className="mb-2 block text-sm font-semibold"
                            >
                                Subject
                            </label>
                            <input
                                id="subject"
                                name="subject"
                                type="text"
                                placeholder="What is your inquiry about?"
                                required
                                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="message"
                                className="mb-2 block text-sm font-semibold"
                            >
                                Your Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows={6}
                                placeholder="Write your message here..."
                                required
                                className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                            />
                        </div>

                        <button
                            type="submit"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 font-semibold text-white transition hover:bg-orange-600 sm:w-auto"
                        >
                            Send Message <Send size={18} />
                        </button>
                    </form>
                </div>
            </section>

            {/* Bottom Note */}
            <section className="px-6 pb-16">
                <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 rounded-2xl bg-[#172b28] px-8 py-10 text-center text-white md:flex-row md:justify-between md:text-left">
                    <div>
                        <h2 className="text-xl font-bold">
                            Need equipment for your next project?
                        </h2>
                        <p className="mt-2 text-sm text-stone-300">
                            Explore available equipment and find the right rental solution.
                        </p>
                    </div>

                    <a
                        href="/AllEquipment"
                        className="shrink-0 rounded-xl bg-orange-500 px-6 py-3 font-semibold transition hover:bg-orange-600"
                    >
                        Browse Equipment
                    </a>
                </div>
            </section>
        </main>
    );
}
