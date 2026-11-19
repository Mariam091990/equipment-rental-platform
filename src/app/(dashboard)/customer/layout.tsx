
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type CustomerLayoutProps = {
    children: React.ReactNode;
};

export const instant = false;

export default async function CustomerLayout({
    children,
}: CustomerLayoutProps) {

    // Get the currently logged-in user
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // Check whether the user is logged in
    if (!session) {
        redirect("/signIn");
    }

    // Get the user's role
    const role = session.user.role?.toLowerCase();

    // Allow customers and admins
    if (role !== "customer" && role !== "admin") {
        if (role === "owner") {
            redirect("/owner/dashboard");
        }

        redirect("/signIn");
    }

    return <>{children}</>;
}
