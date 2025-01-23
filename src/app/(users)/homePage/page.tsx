"use client";

import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { MessageCircleIcon, ShoppingCartIcon, MapPinIcon, Info, UserIcon, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTokens } from '@/hooks/useTokens';
import { TokenDebug } from '@/components/TokenDebug';

const UserHomePage = () => {
  const router = useRouter();
  const session = useAuth();
  const { access, refresh, isLoading } = useTokens();

  console.log('👤 Session:', session);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  console.log('🔒 État des tokens:', {
    accessToken: access,
    refreshToken: refresh
  });

  const accommodation = {
    name: 'Villa bleu',
    city: 'Paris',
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 mt-10">
      <h1 className="text-4xl font-bold mb-4">Bienvenue dans votre espace Eazost </h1>
      <p>Retrouvez ici toutes les informations de votre location</p>
      <div className="space-y-4 items-center justify-center">
        <div className="flex flex-col items-center justify-center mt-10">
          <h2 className="text-3xl font-semibold text-center">{accommodation.name}</h2>
          <p className="text-center text-xl mb-2 ">{accommodation.city}</p>
        </div>
        <div className="grid grid-cols-3 gap-8 gap-y-12 items-center justify-center">
			<div className="flex flex-col items-center justify-center">
                <button
                  className="bg-amber-500 text-white flex items-center justify-center p-4 rounded-xl hover:bg-amber-600 hover:shadow- hover:shadow-gray-500 hover:scale-105 transition-transform duration-300 ease-in-out w-48 h-48 mb-2"
                  onClick={() => router.push(`/homePage/cardinfo`)}
                >
                  <Info className="w-40 h-40" />
                </button>
				<p className='text-white text-center text-lg bg-black rounded-xl shadow-lg px-8 w-48'>Information</p>
			</div>
			<div className="flex flex-col items-center justify-center">
          <button
            className="bg-amber-500 text-white flex items-center justify-center p-4 rounded-xl hover:bg-amber-600 hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out w-48 h-48 mb-2"
            onClick={() => router.push(`/homePage/shop`)}
          >
            <ShoppingCartIcon className="w-40 h-40" />
          </button>
		  <p className='text-white text-center text-lg bg-black rounded-xl shadow-lg px-8 w-48'>Boutique</p>
		  </div>
		  <div className="flex flex-col items-center justify-center">
          <button
            className="bg-amber-500 text-white flex items-center justify-center p-4 rounded-xl hover:bg-amber-600 hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out w-48 h-48 mb-2"
            onClick={() => router.push(`/homePage/contact`)}
          >
            <MessageCircleIcon className="w-40 h-40" />
          </button>
		  <p className='text-white text-center text-lg bg-black rounded-xl shadow-lg px-8 w-48'>Contact</p>
		  </div>
		  <div className="flex flex-col items-center justify-center">
          <button
            className="bg-amber-500 text-white flex items-center justify-center p-4 rounded-xl hover:bg-amber-600 hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out w-48 h-48 mb-2"
            onClick={() => router.push(`/homePage/map`)}
          >
            <MapPinIcon className="w-40 h-40" />
          </button>
		  <p className='text-white text-center text-lg bg-black rounded-xl shadow-lg px-8 w-48'>Carte</p>
		  </div>
		  <div className="flex flex-col items-center justify-center">
          <button
            className="bg-amber-500 text-white flex items-center justify-center p-4 rounded-xl hover:bg-amber-600 hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out w-48 h-48 mb-2"
            onClick={() => router.push(`/homePage/profil`)}
          >
            <UserIcon className="w-40 h-40"/>
          </button>
		  <p className='text-white text-center text-lg bg-black rounded-xl shadow-lg px-8 w-48'>Profil</p>
		  </div>
		  <div className="flex flex-col items-center justify-center">
          <button
            className="bg-amber-500 text-white flex items-center justify-center p-4 rounded-xl hover:bg-amber-600 hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out w-48 h-48 mb-2"
            onClick={() => router.push(`/homePage/order`)}
          >
            <ShoppingBag className="w-40 h-40" />
          </button>
		  <p className='text-white text-center text-lg bg-black rounded-xl shadow-lg px-8 w-48'>Commandes</p>
        </div>
		</div>
      </div>
      {process.env.NODE_ENV === 'development' && <TokenDebug />}
    </div>
  );
};

export default UserHomePage;
