import "../app/globals.css"; // Import du fichier de styles globaux
import Link from 'next/Link'

export default function Header() {
  return (
    <header className="p-3 flex justify-between items-center flex-wrap text-[#444444]">
      {/* Conteneur principal pour aligner tout à gauche */}
      <div className="flex items-center space-x-4 ">
        {/* Icône et titre alignés à gauche */}
			{/* link to home page */}
          <h1 className="text-4xl text-amber-500 pl-2 ">Eazost</h1>
	  </div>
   </header>
  );
}
