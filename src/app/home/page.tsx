"use client"; // Indique que ce composant doit être rendu côté client

import '@/app/globals.css'; // Assurez-vous d'importer le fichier CSS global
import { useState, useEffect } from 'react'; // Importation des hooks d'état et d'effet de React
import Image from 'next/image'; // Importation de la bibliothèque d'images Next.js
import HomeNavbar from '@/components/Home/HomeNavbar';
import TypingTitle from '@/components/Home/TypingTitle';
import PrincingCard from '@/components/Home/PrincingCard';
import Footer from '@/components/Footer';


// Composant HomePage
export default function HomePage() {
  const [isBlurred, setIsBlurred] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsBlurred(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isMounted) {
    return null; // ou un loader
  }

  return (
    <div className='min-h-screen overflow-hidden bg-stone-100'>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="bg-[url('/photo1.webp')] relative bg-cover bg-center bg-fixed h-screen w-full flex flex-col mb-5">
          <HomeNavbar isBlurred={isBlurred}/>
          <div className="flex flex-col items-center justify-end p-5 mt-64 ">
            <TypingTitle  />
            <h1 className="p-5 font-sans font-bold text-neutral-200 text-7xl animate-fade-right animate-delay-200">
              Votre propriété,<br /> Nos services,<br /> L&apos;expérience parfaite.
            </h1>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center p-3 m-5  '>
          <h1 className="p-2 m-4 text-5xl font-semibold sans-font text-slate-800">Découvrez TravelBuddy </h1>
          <h3 className="p-2 m-2 text-3xl font-thin sans-font text-amber-800">Votre assistant de séjour tout-en-un</h3>
          <p className="m-5 text-2xl font-thin tracking-wide text-center text-gray-800">Travel Buddy est une application innovante conçue pour rendre chaque séjour plus agréable et plus simple,
            que vous soyez propriétaire ou voyageur. Pour les propriétaires, elle offre un moyen pratique de gérer leurs locations, avec des options pour planifier les services à l'avance, fournir des instructions sur les équipements,
            et rester en contact avec les vacanciers. Les voyageurs, quant à eux, bénéficient d&apos;une expérience améliorée grâce à la possibilité de réserver des services comme la livraison de nourriture, des kits de nettoyage, ou encore des guides pratiques sur l'utilisation des appareils domestiques.</p>

          <p className="m-5 text-2xl font-thin tracking-wide text-center text-gray-800">Avec Travel Buddy, transformez la gestion des séjours en une tâche simple et efficace,
            en profitant d&lsquo;un accès personnalisé aux informations clés et en optimisant le confort des invités.
            Laissez-nous vous accompagner dans la gestion des détails pour que vous puissiez vous concentrer sur l&apos;essentiel : profiter de chaque moment.</p>
        </div>
        <div id="features" className= "flex flex-col w-full mb-5 mr-5 border shadow-lg bg-amber-500 min-h-96 border-slate-200 md:flex-row md:mr-20">
          <div className="flex-shrink-0 w-full h-full md:w-1/2 ">
            <Image
              src="/smart-home.jpg"
              alt="photo1"
              width={690}
              height={690}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col items-center justify-center w-full p-5 m-5 md:w-1/2">
            <h1 className="p-2 m-4 text-5xl font-semibold sans-font text-slate-800">Accès sécurisé et personnalisé</h1>
            <p className="text-2xl font-thin tracking-wide text-center text-gray-800">
              Chaque voyageur reçoit un code d&apos;accès unique pour découvrir les informations et fonctionnalités de la maison en toute sécurité.
            </p>
          </div>
        </div>

        <div className="flex flex-col w-full mb-5 ml-5 bg-white border shadow-lg animate-slide-in min-h-96 border-slate-200 md:flex-row-reverse md:ml-20 ">
          <div className="flex-shrink-0 w-full h-full md:w-1/2">
            <Image
              src="/course.png"
              alt="photo3"
              width={685} height={650}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col items-center justify-center w-full p-5 m-5 md:w-1/2">
            <h1 className="p-2 m-4 text-5xl font-semibold sans-font text-slate-800">Plateforme d&apos;achat personnalisée</h1>
            <p className="text-2xl font-thin tracking-wide text-center text-gray-800">
              Offrez à vos clients la possibilité d&apos;acheter des services supplémentaires directement via notre plateforme d&apos;achat intégrée.
            </p>
          </div>
        </div>

        <div className="flex flex-col w-full mb-5 mr-5 border shadow-lg bg-amber-500 min-h-96 border-slate-200 md:flex-row md:mr-20">
          <div className="flex-shrink-0 w-full h-full md:w-1/2">
            <Image
              src="/communication.png"
              alt="photo1"
              width={690}
              height={690}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col items-center justify-center w-full p-5 m-5 text-balance md:w-1/2">
            <h1 className="p-2 m-4 text-5xl font-semibold sans-font text-slate-800">Communication simplifiée</h1>
            <p className="text-2xl font-thin tracking-wide text-center text-gray-800">
              Un système de chat intégré permet une communication fluide et instantanée entre vous et vos hotes.
            </p>
          </div>
        </div>

        <div className="flex flex-col w-full mb-5 ml-5 bg-white border shadow-lg min-h-96 border-slate-200 md:flex-row-reverse md:ml-20">
          <div className="flex-shrink-0 w-full h-full md:w-1/2">
            <Image
              src="/photo2.jpg"
              alt="photo3"
              width={685} height={650}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col items-center justify-center w-full p-5 m-5 md:w-1/2">
            <h1 className="p-2 m-4 text-5xl font-semibold sans-font text-slate-800">Guide local interactif</h1>
            <p className="text-2xl font-thin tracking-wide text-center text-gray-800">
              Offrez à vos invités des recommandations personnalisées pour découvrir les meilleurs sites touristiques, restaurants, magasins et activités de votre région.
            </p>
          </div>
        </div>
        <div id="pricing">
          <PrincingCard />
        </div>
        <div id="newsletter" className='flex flex-col items-center justify-center w-full bg-amber-500'>
          <h1 className="p-2 m-4 text-3xl font-thin sans-font text-slate-800">Abonner vous a notre Newletter</h1>
          <p className="mb-5 text-xl font-thin tracking-wide text-center text-gray-800">Recevez les dernières mises à jour sur nos services et offres spéciales directement dans votre boîte de réception.</p>
          <div className="flex flex-row items-center justify-center mb-3">
            <input type="email" placeholder="Adresse e-mail" className="p-2 m-2 border border-slate-200" />
            <button className="p-2 m-2 text-white rounded-lg shadow-xl bg-slate-800">S&apos;abonner</button>
          </div>
        </div>
      </div>
      <div className="w-full mt-auto">
        <Footer className={''} />
      </div>
    </div>
  );
}
