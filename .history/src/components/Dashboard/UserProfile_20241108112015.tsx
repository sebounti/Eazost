"use client"

import { useState, useRef, useEffect } from 'react'
import { Camera, Image as Settings } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {UsersInfoSchema} from '@/validation/UsersInfoSchema'



export default function UserProfile() {
  const [profileImage, setProfileImage] = useState(""/images/icons-profil.png")
  const profileInputRef = useRef<HTMLInputElement>(null);


// Fonction pour déclencher l'input de fichier
  const triggerFileInput = () => {
	console.log("Bouton 'Changer la photo de profil' cliqué"); // Nouveau log
	profileInputRef.current?.click();
  };

// Fonction pour gérer le changement d'image
const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'upload_preset');

    // Upload vers Cloudinary
    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, {
      method: 'POST',
      body: formData,
    });
    const uploadData = await uploadResponse.json();
    const imageUrl = uploadData.secure_url;

    setProfileImage(imageUrl); // Met à jour l'image sur le frontend

    // Sauvegarde de l'URL de l'image dans la base de données
    await saveProfileImageToDatabase(imageUrl);
  };

  // Fonction pour enregistrer l'URL de la photo de profil dans la base de données
  const saveProfileImageToDatabase = async (imageUrl: string) => {
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_image_url: imageUrl }),
      });

      if (!response.ok) {
        console.error("Erreur lors de l'enregistrement de l'image :", response.statusText);
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'image :", error);
    }
  };


	const [userName, setUserName] = useState(""); // État pour stocker le nom complet

	useEffect(() => {
		async function fetchUserData(): Promise<void> {
			try {
			  const response = await fetch('/api/UsersInfo');
			  if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Network response was not ok');
			  }

			  const data = await response.json();
			  console.log("Données reçues de l'API :", data);

			  // Validation des données avec un objet unique
			  const parsedData = UsersInfoSchema.safeParse(data);
			  if (!parsedData.success) {
				console.error('Erreur de validation des données utilisateur :', parsedData.error.errors);
				setUserName("Erreur de validation des données");
				return;
			  }

			  // Combinez prénom et nom
			  const fullName = `${parsedData.data.last_name || ""} ${parsedData.data.first_name || ""}`.trim();
			  setUserName(fullName);

			} catch (error) {
			  console.error("Erreur lors de la récupération des données utilisateur :", error);
			  setUserName("Erreur lors du chargement");
			}
		  }
		fetchUserData();
	  }, []);


  return (

    <div className="w-full max-h-screen">
          <div className="relative flex justify-center">
            <div className="inline-block p-1 bg-white rounded-full">
              <Avatar className="rounded-full h-55 w-55 ">
                <AvatarImage src={profileImage || "@/assets/"} alt="Profil image" className="object-cover w-40 h-40 rounded-full" />
                <AvatarFallback className="rounded-full">MA</AvatarFallback>
              </Avatar>
            </div>
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 rounded-full"
              onClick={triggerFileInput}
			  aria-label='Changer la photo de profil'
            >
            </Button>
            <Input
              type="file"
              ref={profileInputRef}
              className="hidden"
              onChange={handleImageChange}
              accept="image/*"
            />
        </div>
      <div className="max-w-4xl px-4 py-6 mx-auto">
        <h1 className="my-2 text-4xl font-bold text-center">
		{userName || "Chargement..."} {/* Affiche le nom complet ou "Chargement..." */}
		</h1>
        <p className="mb-2 text-lg text-center text-black ">Propriétaire de logements</p>
		</div>
    </div>
  )
}
