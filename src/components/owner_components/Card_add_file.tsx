'use client';

import { useState } from "react";
import Image from 'next/image';

interface CardAddFileProps {
  image: string; // Accepte un urlde cloudinary
  status: string; // Le statut de la carte
  onChange: (field: string, value: any) => void; // Fonction pour gérer les changements
}

export default function Card_add_file({ image, status, onChange }: CardAddFileProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange("image", e.target.files[0]); // Passe le fichier sélectionné à la fonction onChange
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange("status", e.target.value); // Passe le statut sélectionné à la fonction onChange
  };

  return (
    <div className="p-6  bg-white rounded-xl shadow-lg">
      {/* Thumbnail Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-5 md:text-3xl ">Add Image</h2>
        <div className="border-2 border-dashed border-amber-500 rounded-lg p-4 text-center">
          <input
            type="file"
            accept=".png, .jpg, .jpeg"
            onChange={handleFileChange} // Appel de handleFileChange ici
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="text-amber-500 cursor-pointer"
          >
            Drag &apos;n&apos; drop some files here, or click to select files
          </label>
        </div>
          {typeof image === 'object' && (
            <Image
              src={URL.createObjectURL(image)}
              alt="Selected"
              className="mt-4"
              width={500} // Adjust width as needed
              height={500} // Adjust height as needed
            />
          )}
        <p className="text-gray-500 mt-2">
          Set the product thumbnail image. Only *.png, *.jpg and *.jpeg image
          files are accepted.
        </p>
      </div>

      {/* Status Section */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Select Status</h2>
        <div className="flex items-center mb-2">
          <select
            value={status} // Appel de handleStatusChange ici
            onChange={handleStatusChange}
            className="bg-white border border-gray-300 rounded px-4 py-2 text-gray-700 focus:outline-none focus:border-blue-500"
          >
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
          <span
            className={`ml-4 w-4 h-4 rounded-full ${
              status === "Published" ? "bg-amber-500" : "bg-gray-500"
            }`}
          ></span>
        </div>
        <p className="text-gray-500">Set the card status.</p>
      </div>
    </div>
  );
}
