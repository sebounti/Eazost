'use client';

import { useState } from "react";
import LogementCard from "@/components/card/LogementCard";
import { Accommodation } from "@/types";
import { accommodationSchema } from "@/validation/PropertySchema";

export default function LogementsPage() {
  const [logements, setLogements] = useState<Accommodation[]>([
    // Initialisation des logements avec les données par défaut
  ]);

  const ajouterLogement = async (formData: FormData) => {
	const logementData = {
	  users_id: parseInt(formData.get("users_id") as string),
	  type: formData.get("type") as string,
	  name: formData.get("name") as string,
	  address_line1: formData.get("address_line1") as string,
	  address_line2: formData.get("address_line2") as string,
	  city: formData.get("city") as string,
	  zipcode: formData.get("zipcode") as string,
	  country: formData.get("country") as string,
	  description: formData.get("description") as string,
	};

	// Valider les données
	const validation = accommodationSchema.safeParse(logementData);
	if (!validation.success) {
	  console.error("Erreur de validation", validation.error);
	  return;
	}

	try {
	  // Envoi des données validées à l'API pour ajout dans la base de données
	  const response = await fetch("/api/property", {
		method: "POST",
		headers: {
		  "Content-Type": "application/json",
		},
		body: JSON.stringify(validation.data),
	  });

	  if (!response.ok) {
		throw new Error("Erreur lors de l'ajout du logement");
	  }

	  const nouveauLogement = await response.json();

	  // Mise à jour de l'état local avec le logement ajouté
	  setLogements([...logements, nouveauLogement]);
	} catch (error) {
	  console.error(error);
	}
  };

  return (
    <div className="container p-4 mx-auto">
      <h1 className="text-5xl font-extrabold tracking-tight p-2">Gestion des Logements</h1>
      <p className="mb-8 text-muted-foreground p-2">Gérez vos propriétés, codes d&apos;accès, Carte info logement  et commandes en un seul endroit</p>

      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        ajouterLogement(formData);
      }}>
        {/* Add your form fields here */}
        <button type="submit" className="bg">Ajouter Logement</button>
      </form>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {logements.map((logement) => (
          <LogementCard
            key={logement.accommodation_id}
            logement={logement}
            onEditLogement={(formData) => {
              // Appeler la fonction pour modifier un logement
              console.log("Modifier logement", formData);
            }}
            onAddInfoCard={(logementId, formData) => {
              // Appeler la fonction pour ajouter une carte
              console.log("Ajouter carte", logementId, formData);
            }}
            onEditInfoCard={(logementId, cardId, formData) => {
              // Appeler la fonction pour modifier une carte
              console.log("Modifier carte", logementId, cardId, formData);
            }}
            onAddProduct={(logementId, formData) => {
              // Appeler la fonction pour ajouter un produit
              console.log("Ajouter produit", logementId, formData);
            }}
            onEditProduct={(logementId, productId, formData) => {
              // Appeler la fonction pour modifier un produit
              console.log("Modifier produit", logementId, productId, formData);
            }}
            onGenerateAccessCode={(logementId, startDateTime, endDateTime, email) => {
              // Gérer le code d'accès
              console.log("Générer code d'accès", logementId, startDateTime, endDateTime, email);
            }}
            onDeleteAccessCode={(logementId, code) => {
              // Supprimer un code d'accès
              console.log("Supprimer code d'accès", logementId, code);
            }}
            onAddOrder={() => { /* Ajouter une commande */ }}
            onEditOrder={() => {
              // Modifier une commande
            }}
          />
        ))}
      </div>
    </div>
  );
}
