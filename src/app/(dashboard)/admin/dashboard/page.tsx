
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardWelcome from "@/components/shared/DashboardWelcome";

export const instant = false;

export default async function AdminDashboard() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/signIn");
    }

    const user = session.user;

    return (
        <div className="space-y-6">
            <DashboardWelcome
                role="admin"
                name={user.name || "Admin"}
                email={user.email}
                image={user.image || ""}
            />

            
        </div>
    );
}
