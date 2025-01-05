"use client";

import { useState } from "react";

// components
import Card_form from "@/components/owner_components/Card_form";
import Card_add_file from "@/components/owner_components/Card_add_file";
import Button from "@/components/Button";
import Card_template from "./Card_template";

export default function CreateCard() {
  const [cardData, setCardData] = useState({
    cardtitle: "",
    description: "",
    image: "", // URL de l'image, vide au départ
    status: "",
  });

  const [uploading, setUploading] = useState(false);

  // Fonction pour gérer les changements de valeurs dans chaque composant
  const handleChange = (field: string, value: any) => {
    setCardData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Fonction pour uploader l'image vers Cloudinary avec `fetch`
  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "default_preset"); // Remplace par ton preset Cloudinary

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDNAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      return data.secure_url; // URL sécurisée de l'image uploadée
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      return null;
    }
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async () => {

	console.log("Card Data:", cardData); // Pour vérifier ce que contient cardData

	// Vérifie si tous les champs sont remplis
	if (!cardData.cardtitle || !cardData.description || !cardData.image || !cardData.status) {
		alert("Tous les champs doivent être remplis.");
		return;
	  }

    setUploading(true);



    let imageUrl = cardData.image; // On conserve l'URL si elle existe déjà
    if (cardData.image && typeof cardData.image !== "string") {
      // Si l'image est un fichier (pas encore une URL), on l'upload
      imageUrl = await uploadImageToCloudinary(cardData.image);
    }

    if (imageUrl) {
      const cardPayload = {
        cardtitle: cardData.cardtitle,
        description: cardData.description,
        image: imageUrl, // URL de l'image retournée par Cloudinary
        status: cardData.status,
      };

      try {
        const response = await fetch("/api/card", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cardPayload), // Envoyer toutes les données au serveur
        });

        if (response.ok) {
          console.log("Card created successfully");
          // Gérer le succès, réinitialiser le formulaire ou rediriger
        } else {
          console.error("Failed to create card");
        }
      } catch (error) {
        console.error("Error creating card:", error);
      }
    }

    setUploading(false);
  };

  return (
	<div className="grid grid-cols-2 gap-8 my-4 items-start">
  {/* Colonne pour le formulaire du titre, la description et le bouton */}
  <div className="space-y-4">
    <Card_form
      cardtitle={cardData.cardtitle}
      description={cardData.description}
      onChange={handleChange}
    />
    {/* Bouton pour soumettre sous Card_form */}
    <div className="flex justify-start mt-4">
      <Button onClick={handleSubmit} label={uploading ? "Uploading..." : "Create Card"} />
    </div>
  </div>

  {/* Colonne pour Add Image et le statut */}
  <div className="space-y-4">
    <Card_add_file
      image={cardData.image} // Passe l'URL ou le fichier sélectionné
      status={cardData.status}
      onChange={handleChange}
    />
	<Card_template/>
  </div>
</div>


  );
}
