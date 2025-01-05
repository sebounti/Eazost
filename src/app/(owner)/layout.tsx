import type { Metadata } from "next";
import { Poppins, Nunito } from "next/font/google";
import Header_owner from "@/components/Header_owner";
import Footer from "@/components/Footer";
import { AppSidebar } from "@/components/app-sidebar";
import {
	Sidebar,
	SidebarProvider,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarTrigger,
  } from "@/components/ui/sidebar";
import Dashboard_menu from "@/components/owner_components/Dashboard_menu";
import UserProfile from "@/components/Dashboard/UserProfile";
import "@/app/globals.css";
import { cookies } from "next/headers";




const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'] });
const nunito = Nunito({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata: Metadata = {
  title: "EaZost",
  description: "EaZost, votre plateforme de gestion de vos locations de vacances",
};

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <div className={`h-full bg-slate-50 ${poppins.className} ${nunito.className}`}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <div className="flex flex-row flex-1 w-full">
          <AppSidebar />
          <div className="flex-1">
            <main className="p-4 bg-slate-50">
              <div className="flex flex-col items-center">
                <div className="w-full max-w-full mx-4">
                </div>
                <div className="w-full mx-4">
                </div>
              </div>
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
      <Footer className="mt-auto" />
    </div>
  );
}
