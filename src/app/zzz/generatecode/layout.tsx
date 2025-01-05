import type { Metadata } from "next";
import { Poppins, Nunito } from "next/font/google";
import Header_owner from "@/components/Header_owner";
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";


const poppins = Poppins({subsets: ['latin'],weight: ['400', '700'],});
const nunito = Nunito({subsets: ['latin'],weight: ['400', '700'],});

export const metadata: Metadata = {
  title: "Travel Buddy app",
  description: "Travel buddy a web application designed to enhance the experience of travelers after they have booked their accommodation through platforms like Airbnb or other vacation rental services. Our aim is to simplify and improve every step of the traveler's journey.",
};

export default function OwnerLayout({
  children,
}: Readonly<{
  children: React.ReactNode
  ;}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
	  <div className="flex flex-col min-h-screen">
		<Header_owner />
		{/* Section principale */}
		<main className="flex-grow justify-center p-4 sm:p-6 lg:p-8"> {/* Le contenu occupe tout l'espace restant */}
			<div className="flex">
			<Menu />
			{children}
			</div>
        </main>
		<Footer />
		</div>
      </body>
    </html>
  );
}
