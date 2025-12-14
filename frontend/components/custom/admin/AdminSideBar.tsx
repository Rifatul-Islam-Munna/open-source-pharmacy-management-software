"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  PlusSquare,
  Bell,
  Package,
  Users,
  Settings,
  LogOut,
  NotebookPen,
  SquareStar,
  Bolt,
  Wrench,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { useUser } from "@/hooks/useUser";
import { logOut } from "@/actions/custom-response";

const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "My Store",
    url: "/admin/my-store",
    icon: ShoppingCart,
  },
  {
    title: "Employees",
    url: "/admin/user",
    icon: Users,
  },

  /* {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  }, */
  {
    title: "User Settings",
    url: "/admin/user-settings",
    icon: Settings,
  },
  {
    title: "Seller Dashboard",
    url: "/dashboard",
    icon: Wrench,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, error, refetch } = useUser();
  const handelLogout = async () => {
    await logOut();
    refetch();
    router.push("/auth/login");
  };

  return (
    <Sidebar>
      {/* Header Section */}
      <SidebarHeader className="border-b border-border-gray p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary-blue flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-dark-blue">
                {user?.shopName}
              </h2>
              <p className="text-xs text-dark-text">Pharmacy System</p>
            </div>
          </div>
          <AnimatedThemeToggler />
        </div>
      </SidebarHeader>

      {/* Main Content */}
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-dark-blue font-semibold text-sm px-4 py-4">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 px-2">
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`
                        hover:bg-light-gray hover:text-primary-blue transition-colors
                        px-4 py-3 h-auto
                        ${
                          isActive
                            ? "bg-primary-blue text-white hover:bg-primary-blue hover:text-white"
                            : "text-dark-text"
                        }
                      `}
                    >
                      <a href={item.url} className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Section */}
      <SidebarFooter className="border-t border-border-gray p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="hover:bg-light-gray hover:text-red-500 text-dark-text transition-colors px-4 py-3 h-auto"
              onClick={handelLogout}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
