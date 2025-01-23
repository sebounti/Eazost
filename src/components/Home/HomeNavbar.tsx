import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';

export default function HomeNavbar({ isBlurred }: { isBlurred: boolean }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };


    return (
	<nav className={`fixed top-0 w-full z-50 p-4 '`}>
		<div className="flex flex-row items-center justify-between w-full p-4 scroll-smooth">
            <div className="flex items-center">
                {/* Logo pour petits écrans */}
                <Image
                    src="/logo.png"
                    alt="TravelBuddy Logo"
                    className="block shadow-md md:hidden rounded-xl"
                    width={82}
                    height={82}
                />
                {/* Texte pour les écrans moyens et plus grands */}
				<Link href="/login" className="hidden font-sans text-sm font-light tracking-widest md:block text-amber-700 md:text-3xl md:ml-4">
                    Eazost
				</Link>
            </div>
            {/* Bouton hamburger */}
            <button
                onClick={toggleMenu}
                className="md:hidden focus:outline-none"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>
            {/* Menu pour petits écrans */}
			<div className={`${isOpen ? 'fixed top-0 left-0 w-full h-full bg-black flex flex-col items-center justify-center' : 'hidden'} md:flex flex-col md:flex-row md:items-center`}>
				<Link href="/home" className="text-xl tracking-wide text-slate-800 mr-7">Accueil</Link>
			<button onClick={toggleMenu} className="absolute text-white top-4 right-4 md:hidden">
        		<svg className="w-8 h-8 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
            		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        		</svg>
    		</button>
				<Link href="#features" className="text-xl tracking-wide shadow-sm text-amber-700 mr-7">Fonctionnalité</Link>
                <Link href="#pricing" className="text-xl tracking-wide shadow-sm text-amber-700 mr-7">Tarif</Link>
				<Link href="/registration">
				<button className="font-sans tracking-wide rounded-xl bg-amber-700  text-white mr-7 md:p-3 hover:bg-amber-500 animate-pulse animate-infinite animate-duration-[3000ms]">
                Sign up
            	</button>
				</Link>
				<Link href="#newsletter" className="text-xl tracking-wide shadow-sm text-amber-700 mr-7">
  				Contact
				</Link>
            </div>
        </div>
	</nav>
    );
}
