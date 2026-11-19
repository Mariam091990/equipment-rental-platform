
import {
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
} from "@/components/ui/sidebar";

import { DashboardSidebar } from "@/components/dashboard/shared/DashboardSidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Allow this private route to use blocking dynamic rendering
export const instant = false;

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Get the current session from the server
    const session = await auth.api.getSession({
        headers: await headers(),
    });

      // 1. Authentication check
    if (!session) {
        redirect("/signIn");
    }

      // 2. Get the user's role
    const role = session.user.role?.toLowerCase();

    // 3. Validate role
    if (!["admin", "owner", "customer"].includes(role ?? "")) {
        redirect("/signIn");
    }

    const user = {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? undefined,
        role: role as "admin" | "owner" | "customer",
    };

    return (
        <SidebarProvider>
            <DashboardSidebar user={user} />

            <SidebarInset className="bg-[#FAF9F6]">
                <header className="flex h-16 items-center gap-4 border-b border-stone-200 bg-white px-6">
                    <SidebarTrigger />

                    <div>
                        <h1 className="font-semibold text-stone-900">
                            User Dashboard
                        </h1>
                        <p className="text-xs text-stone-500">
                            Manage your account
                        </p>
                    </div>
                </header>

                <main className="flex-1 p-5 md:p-8">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
