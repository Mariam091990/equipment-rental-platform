
import {
    Star,
    Quote,
    MessageCircle,
} from "lucide-react";

const reviews = [
    {
        id: 1,
        name: "James Anderson",
        role: "Construction Contractor",
        rating: 5,
        comment:
            "Excellent rental experience! The equipment was in great condition, and the booking process was quick and easy. I will definitely use this platform again.",
        initials: "JA",
    },
    {
        id: 2,
        name: "Sarah Williams",
        role: "Small Business Owner",
        rating: 5,
        comment:
            "I found exactly the equipment I needed at a reasonable price. The rental process was smooth, and everything was delivered on time.",
        initials: "SW",
    },
    {
        id: 3,
        name: "Michael Brown",
        role: "Independent Builder",
        rating: 4,
        comment:
            "A very convenient platform for finding reliable equipment. The available options and flexible rental periods made my project much easier.",
        initials: "MB",
    },
    {
        id: 4,
        name: "Emily Davis",
        role: "Agriculture Business Owner",
        rating: 5,
        comment:
            "Great service and an easy-to-use platform. I especially liked how simple it was to compare equipment and complete my booking.",
        initials: "ED",
    },
];

export default function CustomerReviews() {
    return (
        <section className="bg-slate-50 py-20 lg:py-24">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">

                {/* Section Heading */}
                <div className="mx-auto mb-14 max-w-2xl text-center">
                    <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                        <MessageCircle size={16} />
                        Customer Feedback
                    </span>

                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        What Our Customers Say
                    </h2>

                    <p className="mt-4 text-base leading-7 text-slate-600">
                        Discover what customers think about their experience
                        with our equipment rental platform.
                    </p>
                </div>

                {/* Reviews Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="group relative rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                        >
                            <Quote
                                size={34}
                                className="mb-5 text-blue-100"
                                fill="currentColor"
                            />

                            {/* Rating */}
                            <div className="mb-5 flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <Star
                                        key={index}
                                        size={17}
                                        className={
                                            index < review.rating
                                                ? "fill-amber-400 text-amber-400"
                                                : "fill-slate-200 text-slate-200"
                                        }
                                    />
                                ))}
                                <span className="ml-2 text-sm font-semibold text-slate-700">
                                    {review.rating}.0
                                </span>
                            </div>

                            {/* Review Comment */}
                            <p className="min-h-36 text-sm leading-7 text-slate-600">
                                &ldquo;{review.comment}&rdquo;
                            </p>

                            {/* Customer Information */}
                            <div className="mt-7 flex items-center gap-3 border-t border-slate-100 pt-5">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                                    {review.initials}
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">
                                        {review.name}
                                    </h3>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {review.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Note */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-slate-500">
                        Your experience matters to us. Thank you for choosing
                        our equipment rental platform!
                    </p>
                </div>

            </div>
        </section>
    );
}
