"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/custom/Dashboard/app-sidebar";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const lastPathName = pathName.split("/").pop();
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full bg-light-gray min-h-screen @container">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border-gray bg-white px-4">
          <SidebarTrigger className="text-dark-blue hover:bg-light-gray hover:text-primary-blue" />
          <Separator orientation="vertical" className="h-6 bg-border-gray" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/"
                  className="text-dark-text hover:text-primary-blue"
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/dashboard"
                  className="text-dark-text hover:text-primary-blue"
                >
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-dark-blue font-medium  capitalize">
                  {lastPathName?.split("-").join(" ")}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className=" w-full">{children}</div>
      </main>
    </SidebarProvider>
  );
}
