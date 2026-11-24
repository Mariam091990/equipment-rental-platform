
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardWelcome from "@/components/shared/DashboardWelcome";

export const instant = false;

export default async function CustomerDashboard() {
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
                role="customer"
                name={user.name || "Customer"}
                email={user.email}
                image={user.image || ""}
            />

            {/* Customer dashboard sections will go here */}
        </div>
    );
}
