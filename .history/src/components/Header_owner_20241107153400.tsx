import { FaHome, FaUserCircle } from 'react-icons/fa';  // Import de l'icône FaHome de Font Awesome
import "../app/globals.css"; // Import du fichier de styles globaux
import Link from 'next/link';

export default function Header() {
  return (
    <header className="p-3 flex justify-between items-center flex-wrap text-[#444444]">
      {/* Conteneur principal pour aligner tout à gauche */}
      <div className="flex items-center space-x-4 ">
        {/* Icône et titre alignés à gauche */}
			{/* link to home page */}
          <h1 className="text-4xl text-amber-500 pl-2 ">Eazost</h1>
	  </div>

	<div className='flex justify-end items-center space-x-4'>
		{/* Conteneur liens dde compte utilisateur */}
		<Link href="/profile" className="text-gray-700 whitespace-nowrap">Profile
		</Link>
		<div className="avatar">
			<div className="ring-primary ring-offset-base-100 w-10 rounded-full ring ring-offset-2">
				<img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
			</div>
		</div>
	</div>
   </header>
  );
}
