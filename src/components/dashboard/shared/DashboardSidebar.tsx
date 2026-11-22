
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    PackageCheck,
    Heart,
    UserRound,
    Package,
    Home,
} from "lucide-react";
// import { authClient } from "@/lib/auth-client";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { IUser } from "@/types";

import { TUserRole } from "@/types";


const roleBasedSidebarItems = {

    admin: [
        {
            title: "Admin Dashboard",
            url: "/admin/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "All Users",
            url: "/admin/all-users",
            icon: UserRound,

        },
        {
            title: "All Equipment",
            url: "/admin/all-equipment",
            icon: Package,
        },

        {
            title: "All Rentals",
            url: "/admin/all-rentals",
            icon: PackageCheck,
        },

        {
            title: "profile",
            url: "/admin/profile",
            icon: UserRound,

        }
    ],
    owner: [
        {
            title: "Owner Dashboard",
            url: "/owner/dashboard",
            icon: LayoutDashboard,
        },{
            title: "Add Equipment",
            url: "/owner/add-equipment",
            icon: Package,
        },{
            title: "My Equipment",
            url: "/owner/my-equipment",
            icon: Package,  
        },
        {
            title: "My Equipment Rental",
            url: "/owner/my-equipment-rental",
            icon: PackageCheck,
        },
        {
            title: "Profile",
            url: "/owner/profile",
            icon: UserRound,
        }
    ],
    customer: [
        {
            title: "Customer Dashboard",
            url: "/customer/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "My Rentals",
            url: "/customer/my-rentals",
            icon: PackageCheck,
        },
        {
            title: "Favorites",
            url: "/customer/favorites",
            icon: Heart,
        },
        {
            title: "Profile",
            url: "/customer/profile",
            icon: UserRound,
        }

    ],

};

const dashboardLinks = (userRole: string) => {
    const role = userRole.toLowerCase() as TUserRole;
    return roleBasedSidebarItems[role] || [];
};

export function DashboardSidebar({ user }: { user: IUser | null }) {



    const userName = user?.name || "Customer";
    const userImage = user?.image || "";
    const userRole = user?.role || "Customer";

    const pathname = usePathname();

    const roleLinks = dashboardLinks(userRole);


    return (
        <Sidebar variant="sidebar" collapsible="icon">

            {/* Logo */}
            <SidebarHeader className="border-b border-stone-200 p-4">
                <Link href="/" className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-900 text-white">
                        <Package size={20} />
                    </div>

                    <div className="group-data-[collapsible=icon]:hidden">
                        <h2 className="font-bold text-stone-900">
                            Equipment Rental.
                        </h2>
                        <p className="text-[9px] uppercase tracking-widest text-stone-500">
                            User Dashboard
                        </p>
                    </div>
                </Link>
            </SidebarHeader>

            {/* Navigation */}
            <SidebarContent>
                <SidebarGroup>
                    {/* Customer Information */}
                    <SidebarGroup>
                        <SidebarGroupLabel>
                            USER MENU
                        </SidebarGroupLabel>

                        <SidebarGroupContent>
                            <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-3">

                                <Avatar className="h-11 w-11">
                                    <AvatarImage
                                        src={userImage}
                                        alt={userName}
                                    />
                                    <AvatarFallback className="bg-stone-200 text-stone-800 font-semibold">
                                        {userName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                                    <p className="truncate text-sm font-semibold text-stone-900">
                                        {userName}
                                    </p>

                                    <p className="text-xs capitalize text-stone-500">
                                        {userRole}
                                    </p>
                                </div>

                            </div>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {roleLinks.map((item) => {
                                const Icon = item.icon;

                                const isActive =
                                    pathname === item.url ||
                                    (item.url !== "/dashboard" &&
                                        pathname.startsWith(item.url + "/"));

                                return (
                                    <SidebarMenuItem key={item.url}>
                                        <SidebarMenuButton
                                            isActive={isActive}
                                            tooltip={item.title}
                                            render={<Link href={item.url} />}
                                        >
                                            <Icon />
                                            <span>{item.title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter className="border-t border-stone-200">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="Back to Website"
                            render={<Link href="/" />}
                        >
                            <Home />
                            <span>Back to Website</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

        </Sidebar>
    );
}
