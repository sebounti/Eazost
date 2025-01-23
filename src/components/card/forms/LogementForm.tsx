//--- Composant LogementForm ---
//--- Composant pour la gestion des logements ---//

"use client";

// React et types
import { useState } from 'react';
import { z } from "zod";
import { Accommodation } from "@/types";

// Composants Next.js
import Image from "next/image";

// Composants UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Composants personnalisés
import CloudinaryFileUploader from "@/components/upload/CloudinaryFileUploder";

// Stores
import { useAccommodationStore } from "@/stores/accommodationStore";



// Schéma de validation des données du formulaire
export const logementSchema = z.object({
	accommodation_id: z.number(),
	name: z.string().min(1, "Le nom est requis"),
	address_line1: z.string().min(1, "L'adresse est requise"),
	address_line2: z.string().optional(),
	city: z.string().min(1, "La ville est requise"),
	zipcode: z.string().min(1, "Le code postal est requis"),
	country: z.string().min(1, "Le pays est requis"),
	description: z.string().min(10, "La description doit faire au moins 10 caractères"),
	photo_url: z.string().url().optional(),
});

//--- Props avec types stricts ---//
interface LogementFormProps {
  logement?: Accommodation;
  onSubmit: (formData: FormData) => Promise<void>;
  onDelete?: () => void | Promise<void>;
  onCancel: () => void;
}

//--- Composant LogementForm ---//
const LogementForm = ({ logement, onSubmit, onDelete, onCancel }: LogementFormProps) => {
  const [imageUrl, setImageUrl] = useState(logement?.photo_url || '');
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteAccommodation = useAccommodationStore(state => state.deleteAccommodation);

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Récupérer les données du formulaire
    const formData = new FormData(e.currentTarget);

    // Ajouter l'URL de l'image au FormData
    formData.set('photo_url', imageUrl);

    await onSubmit(formData);
  };

  // Gestion de l'upload d'image
  const handleImageUpload = (url: string) => {
    setImageUrl(url);
  };

  // Gestion de la suppression du logement
  const handleDelete = async () => {
    if (!logement || !onDelete) return;

    try {
      setIsDeleting(true);

      // Confirmation de suppression
      const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce logement ?");
      if (!confirmed) return;

      await deleteAccommodation(logement.accommodation_id);
      await onDelete();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Une erreur est survenue lors de la suppression du logement");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-slate-50 rounded-xl p-4">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt="Logement"
          width={500}
          height={500}
          className="w-full h-auto rounded-xl object-cover"
        />
      )}
      <div className="space-y-2">
        <CloudinaryFileUploader
		uploadPreset="properties_preset"
		onUploadSuccess={handleImageUpload} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type de logement</Label>
        <Select name="type" defaultValue={logement?.type || ""}>
          <SelectTrigger>
            <SelectValue className='bg-slate-50 rounded-xl focus:border-gray-400' placeholder="Sélectionnez un type" />
          </SelectTrigger>
          <SelectContent className='bg-slate-50 focus:border-gray-400 rounded-xl'>
            <SelectItem value="Appartement">Appartement</SelectItem>
            <SelectItem value="Maison">Maison</SelectItem>
            <SelectItem value="Studio">Studio</SelectItem>
            <SelectItem value="loft">Loft</SelectItem>
            <SelectItem value="Villa">Villa</SelectItem>
         </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nom">Nom</Label>
        <Input
          id="nom"
          name="name"
          className='bg-white rounded-xl focus:border-gray-400'
          defaultValue={logement?.name || ""}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="adresse1">Adresse 1</Label>
        <Input
          id="adresse1"
          name="address_line1"
          className='bg-white rounded-xl focus:border-gray-400'
          defaultValue={logement?.address_line1 || ""}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="adresse2">Adresse 2</Label>
        <Input
          id="adresse2"
          name="address_line2"
          className='bg-white rounded-xl focus:border-gray-400'
          defaultValue={logement?.address_line2 || ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ville">Ville</Label>
        <Input
          id="ville"
          name="city"
          className='bg-white rounded-xl focus:border-gray-400'
          defaultValue={logement?.city || ""}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="codePostal">Code Postal</Label>
        <Input
          id="codePostal"
          name="zipcode"
          className='bg-white  rounded-xl focus:border-gray-400'
          defaultValue={logement?.zipcode || ""}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pays">Pays</Label>
        <Input
          id="pays"
          name="country"
          className='bg-white rounded-xl focus:border-gray-400'
          defaultValue={logement?.country || ""}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          className='bg-white rounded-xl focus:border-gray-400'
          defaultValue={logement?.description || ""}
          required
        />
      </div>

      {/* Boutons de soumission */}
      <div className="flex gap-4">
        <Button
          type="submit"
          variant="default"
          className="flex-1 bg-amber-500 text-slate-800 rounded-xl hover:bg-amber-400 "
        >
          {logement ? "Modifier" : "Ajouter"}
        </Button>

        {/* Supprimer le logement */}
        {logement && onDelete && (
          <Button
            type="button"
            variant="destructive"
            className="flex-1 bg-red-500 text-white rounded-xl hover:bg-red-700"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </Button>
        )}
      </div>
    </form>
  );
};

export default LogementForm;
