import type { Metadata } from "next";
import { Poppins, Nunito } from "next/font/google";
import Footer from "@/components/Footer";
import "@/app/globals.css";
import { cookies } from "next/headers";


const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'] });
const nunito = Nunito({ subsets: ['latin'], weight: ['400', '700'] });

// Métadonnées pour le référencement et l'affichage de la page
export const metadata: Metadata = {
  title: "EaZost",
  description: "EaZost, votre plateforme de gestion de vos locations de vacances",
};

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();

  return (
    <div className={`h-full bg-gray-100 ${poppins.className} ${nunito.className}`}>
        <div className="flex flex-row flex-1 w-full">
          <div className="flex-1">
            <main className="p-4 ">
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
      <Footer className="mt-auto" />
    </div>
  );
}
