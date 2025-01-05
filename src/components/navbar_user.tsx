import { FaHome, FaUserCircle } from 'react-icons/fa';  // Import de l'icône FaHome de Font Awesome
import "../app/globals.css"; // Import du fichier de styles globaux
import Link from 'next/link';

export default function Header() {



  return (
    <header className="bg-[#FFDAB4] p-3 flex justify-between items-center flex-wrap text-[#123B4D]">
      {/* Conteneur principal pour aligner tout à gauche */}
      <div className="flex items-center space-x-4 ">
        {/* Icône et titre alignés à gauche */}
        <div className="flex items-center space-x-2 cursor-pointer">
          {/* Icône de la maison */}
          <FaHome className="text-2xl text-[#eab308] hover:text-white" />
			{/* link to home page */}
          <h1 className="text-2xl pl-2">Travel Buddy</h1>
		</div>
	  </div>
	  <div id='navbar' className='flex justify-between items-center flex-wrap'>
		  	{/* Conteneur liens de navigation */}
		<div className='flex justify-center items-center space-x-6'>
					<Link href="owner/generatecode" className="flex-auto text-[#074057] cursor-pointer hover:text-white whitespace-nowrap">Acess Code
					</Link>
					<Link href="wner/generatecode" className="flex-auto text-[#074057] cursor-pointer hover:text-white whitespace-nowrap">Accommodation
					</Link>
					<Link href="owner/messages" className="flex auto text-[#074057] cursor-pointer hover:text-white whitespace-nowrap">Guide
					</Link>
					<Link href="owner/management" className="flex auto text-[#074057] cursor-pointer hover:text-white whitespace-nowrap">Favoris
					</Link>
					<Link href="/management" className="flex auto text-[#074057] cursor-pointer hover:text-white whitespace-nowrap">Settings
					</Link>
		</div>
	  </div>
	  <div className='flex justify-center items-center space-x-4'>
		{/* Conteneur liens dde compte utilisateur */}
		<Link href="/profile" className="text-[#074057] whitespace-nowrap">Profile
		</Link>
		<FaUserCircle className=" text-2xl text-[#123B4D] cursor-pointer hover:text-white" />
	  </div>
   </header>
  );
}
