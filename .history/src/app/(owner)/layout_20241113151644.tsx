import type { Metadata } from "next";
import { Poppins, Nunito } from "next/font/google";
import Header_owner from "@/components/Header_owner";
import Footer from "@/components/Footer";
import Sidebar_retracting from "@/components/Sidebar_retracting";
import Dashboard_menu from "@/components/owner_components/Dashboard_menu";
import UserProfile from "@/components/Dashboard/UserProfile";

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'] });
const nunito = Nunito({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata: Metadata = {
  title: "Travel Buddy app",
  description: "Travel buddy a web application designed to enhance the experience of travelers after they have booked their accommodation through platforms like Airbnb or other vacation rental services. Our aim is to simplify and improve every step of the traveler's journey.",
};

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`h-full bg-slate-50 ${poppins.className} ${nunito.className}`}>
      <Header_owner />
      <div className="flex flex-row flex-1 w-full">
        <Sidebar_retracting />
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
