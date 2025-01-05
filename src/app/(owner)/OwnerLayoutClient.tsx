"use client";

import { useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useAuthStore } from '@/stores/authStore';
import { useUserinfoStore } from "@/stores/userinfoStore";
import Header_owner from "@/components/Header_owner";
import Footer from "@/components/Footer";
import Dashboard_menu from "@/components/owner_components/Dashboard_menu";
import UserProfile from "@/components/Dashboard/UserProfile";

type OwnerLayoutClientProps = {
  children: React.ReactNode;
  poppins: any;
  nunito: any;
};

export default function OwnerLayoutClient({ children, poppins, nunito }: OwnerLayoutClientProps) {
  const { token, isAuthenticated, initializeStore } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  if (!isAuthenticated || !token) {
    return null;
  }

  return (
    <div className={`h-full bg-slate-50 ${poppins.className} ${nunito.className}`}>
      <Header_owner />
      <div className="flex flex-row flex-1 w-full">
        <main className="flex-1 p-4 bg-slate-50">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-full mx-4">
              <UserProfile />
            </div>
            <div className="w-full mx-4">
              <Dashboard_menu />
            </div>
          </div>
          {children}
        </main>
      </div>
      <Footer className="mt-auto" />
    </div>
  );
}
