
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type AdminLayoutProps = {
    children: React.ReactNode;
};

export const instant = false;

export default async function AdminLayout({
    children,
}: AdminLayoutProps) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // Check authentication
    if (!session) {
        redirect("/signIn");
    }

    const role = session.user.role?.toLowerCase();

    // Only admins can access the Admin Dashboard
    if (role !== "admin") {
        if (role === "customer") {
            redirect("/customer/dashboard");
        }

        if (role === "owner") {
            redirect("/owner/dashboard");
        }

        redirect("/signIn");
    }

    return <>{children}</>;
}
