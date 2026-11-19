
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type OwnerLayoutProps = {
    children: React.ReactNode;
};
export const instant = false;

export default async function OwnerLayout({
    children,
}: OwnerLayoutProps) {
    
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/signIn");
    }

    const role = session.user.role?.toLowerCase();

    // Only owners and admins can access
    if (role !== "owner" && role !== "admin") {
        if (role === "customer") {
            redirect("/customer/dashboard");
        }

        redirect("/signIn");
    }

    return <>{children}</>;
}
