import { useState } from "react";

type Property = {
  id: number;
  name: string;
  address: string;
};

type DropdownProps = {
  properties: Property[];
};

export default function PropertyDropdown({ properties }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<string>("");

  // Fonction pour gérer l'ouverture/fermeture du menu
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Fonction pour sélectionner un logement
  const handleSelect = (property: Property) => {
    setSelectedProperty(property.name);
    setIsOpen(false); // Fermer le menu après la sélection
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Barre de recherche */}
      <div className="flex items-center justify-center border border-gray-300 bg-white rounded-xl shadow-md p-2 m-3">
        <input
          type="text"
          placeholder="Sélectionner un logement..."
          value={selectedProperty}
          readOnly
          className="flex-grow p-2 bg-transparent text-gray-700 focus:outline-none"
        />
        <button
          onClick={toggleDropdown}
          className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {/* Flèche pour ouvrir/fermer le menu */}
          {isOpen ? "▲" : "▼"}
        </button>
      </div>

      {/* Liste déroulante */}
      {isOpen && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-2 max-h-60 overflow-auto">
          {properties.map((property) => (
            <li
              key={property.id}
              className="p-4 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(property)}
            >
              <span className="font-semibold text-gray-800">{property.name}</span>
              <p className="text-gray-500 text-sm">{property.address}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
