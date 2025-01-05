import { useState } from 'react';
import Image from 'next/image';
import { FaCloudUploadAlt } from 'react-icons/fa';

export default function UploadImage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

const handleUpload = async (file: File) => {
  try {
    // Obtenir la signature depuis l'API Next.js
    const response = await fetch('/api/cloudinary-signature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'obtention de la signature Cloudinary");
    }

    const { timestamp, signature } = await response.json();

    // Configuration pour l'upload de l'image
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '');
    console.log("API Key:", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
    formData.append('timestamp', timestamp.toString());
    console.log("Timestamp:", timestamp);
    formData.append('signature', signature);
    console.log("Signature:", signature);

    // Envoi de l'image à Cloudinary
    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, {
      method: 'POST',
      body: formData,
    });

    // Vérifie si l'upload a réussi
    if (!uploadResponse.ok) {
      const errorResponse = await uploadResponse.json();
      console.error("Erreur lors de l'upload Cloudinary :", errorResponse);
      throw new Error(errorResponse.error.message);
    }

    // Stocke l'URL de l'image
    const data = await uploadResponse.json();
    setImageUrl(data.secure_url);
  } catch (error) {
    console.error("Erreur lors de l'upload :", error);
  }
};

  return (
    <div className="flex flex-col items-center space-y-4">
      <label className="relative inline-flex items-center justify-center px-3 py-2 font-medium text-white transition border border-transparent rounded-md cursor-pointer tex1t-sm bg-amber-200 hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
        <FaCloudUploadAlt className="w-6 h-6" />
        <span className="sr-only">Choisir un fichier</span>
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files?.[0]) handleUpload(e.target.files[0]);
          }}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </label>
      {imageUrl && (
        <div className="mt-4">
          <h3 className="text-lg font-medium">Image Uploadée :</h3>
          <Image src={imageUrl} alt="Image uploadée" width={200} height={200} className="rounded-lg shadow-md" />
        </div>
      )}
    </div>
  );
}
