import "../app/globals.css"; // Import du fichier de styles globaux
import React from 'react';

export default function Header() {
  return (
    <header className="bg-white-300 p-3 flex justify-between items-center text-[#444444]">
      {/* Conteneur principal pour aligner tout à gauche */}
      <div className="flex items-center space-x-4">
        {/* Icône et titre alignés à gauche */}
        <div className="flex items-center space-x-2 cursor-pointer">
          {/* Titre du site */}
          <h1 className="text-sm text-[#f4bc88] pl-2 first-line sm:text-2xl">Travel Buddy</h1>
        </div>
      </div>
    </header>
  );
}
