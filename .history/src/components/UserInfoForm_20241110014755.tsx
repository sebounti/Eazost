
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { UsersInfoSchema } from '@/validation/UsersInfoSchema';  // Assurez-vous d'importer le schéma correct
import { z } from 'zod';


// import components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ChangePasswordPopup from "@/components/news/ChangePasswordPopup"

export default function UserInfoForm() {
  const [formData, setFormData] = useState({
    users_id: 0,
    city: '',
    zipcode: '',
    country: '',
    phone_number: '',
    date_of_birth: '',
    first_name: '',
    last_name: '',
    address_line1: '',
    address_line2: '',
  });



  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false); // Pour gérer l'état de soumission
  const [isLoading, setIsLoading] = useState(false); // État pour le chargement

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // fonction pour soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // Active l'indicateur de chargement

    try {
		UsersInfoSchema.parse(formData); // Valide les données de formulaire

      const method = isSubmitted ? 'PUT' : 'POST'; // Choisir PUT ou POST en fonction de l'état

      // Envoi des données à l'API
      const response = await fetch('/api/UsersInfo', {
        method,
        headers: {
          'Content-type': 'application/json',
        },
        credentials: 'include',  // S'assure que les cookies sont envoyés avec la requête
        body: JSON.stringify(formData),
      });

      console.log('Réponse de l\'API:', response);  // Afficher la réponse brute de l'API

      if (response.ok) {
        if (!isSubmitted) {
          setIsSubmitted(true); // Passe l'état à "soumis" après une requête POST réussie
        }
        alert('Profil mis à jour avec succès');

		// Rafraîchir la page après une soumission réussie
		window.location.reload();
      } else {
        const errorData = await response.json();
        console.error('Erreur lors de l\'enregistrement :', errorData);
      }
    } catch (err) {
      console.error('Erreur dans handleSubmit:', err);
      if (err instanceof z.ZodError) {
        const formattedErrors = err.errors.reduce((acc: { [key: string]: string }, curr) => {
          acc[curr.path[0] as string] = curr.message;
          return acc;
        }, {});
        setErrors(formattedErrors);
      }
    } finally {
      setIsLoading(false); // Désactive l'indicateur de chargement
    }
  };

  // Utiliser un effet pour vérifier si le profil existe déjà (au chargement de la page)
  useEffect(() => {
    const checkIfProfileExists = async () => {
      try {
        const response = await fetch('/api/UsersInfo'); // GET pour vérifier si le profil existe
		console.log('Réponse brute de l\'API:', response); // Log pour vérifier la réponse brute

		if (response.ok) {
          const data = await response.json();
		  console.log('Données récupérées de l\'API:', data); // Log pour vérifier les données récupérées

          setFormData({
            ...data,
            users_id: Number(data.users_id),  // Assurer que users_id est un number
          });
          setIsSubmitted(true); // Définit l'état à "soumis"
        } else if (response.status === 404) {
			// Si le statut est 404, le profil n'existe pas encore ; ne pas afficher d'erreur
			console.log("Le profil n'existe pas encore.");
		  } else {
			// Gérer les autres types d'erreurs
			console.error('Erreur lors de la récupération du profil :', response.statusText);
		  }
		} catch (error) {
		  console.error('Erreur lors de la vérification du profil:', error);
		}
	  };


    checkIfProfileExists();
  }, []);

 // État pour les données d'authentification
  const [authData, setAuthData] = useState({
    email: '',
    password: '***********',  // Pour masquer le mot de passe
  });

  // Charger les données d'authentification
  useEffect(() => {
    const fetchAuthData = async () => {
      const response = await fetch('/api/connexion/auth');
      if (response.ok) {
        const data = await response.json();
        setAuthData(data);
      }
    };
    fetchAuthData();
  }, []);

  return (
    <div className="w-full max-w-6xl p-4 mx-auto space-y-8">
      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Compte */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Compte</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-lg">Email</Label>
              <Input id="email" name="email" type="email" placeholder="votre@email.com" readOnly value={authData.email} className="text-lg shadow-md rounded-xl w-1/3 text-md" />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-lg">Mot de passe</Label>
              <Input id="password" name="password" type="password" value='***********' readOnly className="shadow-md rounded-xl w-1/3 text-md" onChange={handleChange} />
              {errors.password && <p className="text-red-500">{errors.password}</p>}
            </div>
            <div className="flex justify-start mt-4">
				<ChangePasswordPopup />
            </div>
          </CardContent>
        </Card>

        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="first_name" className="text-lg">Prénom</Label>
                <Input id="first_name" name="first_name" className="shadow-md rounded-xl w-2/3 text-md" value={formData.first_name} onChange={handleChange} />
                {errors.first_name && <p className="text-red-500">{errors.first_name}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last_name" className="text-lg">Nom</Label>
                <Input id="last_name" name="last_name" className="shadow-md rounded-xl w-2/3 text-md" value={formData.last_name} onChange={handleChange} />
                {errors.last_name && <p className="text-red-500">{errors.last_name}</p>}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date_of_birth" className="text-lg">Date de naissance</Label>
              <Input id="date_of_birth" name="date_of_birth" type="date" className="shadow-md rounded-xl w-1/3 text-md" value={formData.date_of_birth} onChange={handleChange} />
              {errors.date_of_birth && <p className="text-red-500">{errors.date_of_birth}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone_number" className="text-lg">Téléphone</Label>
              <Input id="phone_number" name="phone_number" type="tel" className="shadow-md rounded-xl w-1/3 text-md" value={formData.phone_number} onChange={handleChange} />
              {errors.phone_number && <p className="text-red-500">{errors.phone_number}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address_line1" className="text-lg">Adresse 1</Label>
              <Input id="address_line1" name="address_line1" className="shadow-md rounded-xl w-3/4 text-md" value={formData.address_line1} onChange={handleChange} />
              {errors.address_line1 && <p className="text-red-500">{errors.address_line1}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address_line2" className="text-lg">Adresse 2</Label>
              <Input id="address_line2" name="address_line2" className="shadow-md rounded-xl w-3/4 text-md" value={formData.address_line2} onChange={handleChange} />
              {errors.address_line2 && <p className="text-red-500">{errors.address_line2}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grip gap-2">
                <Label htmlFor="city" className="text-lg">Ville</Label>
                <Input id="city" name="city" className="shadow-md rounded-xl w-2/3 text-md" value={formData.city} onChange={handleChange} />
                {errors.city && <p className="text-red-500">{errors.city}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="zipcode" className="text-lg">Code postal</Label>
                <Input id="zipcode" name="zipcode" className="shadow-md rounded-xl w-1/3 text-md" value={formData.zipcode} onChange={handleChange} />
                {errors.zipcode && <p className="text-red-500">{errors.zipcode}</p>}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="country" className="text-lg">Pays</Label>
              <Select
                onValueChange={(value) => setFormData((prev) => ({ ...prev, country: value }))} // Met à jour formData
                value={formData.country} // Garde la valeur sélectionnée dans formData
              >
                <SelectTrigger id="country" name="country" className="text-lg bg-white shadow-md rounded-xl w-1/3">
                  <SelectValue placeholder="Sélectionnez votre pays" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="france">France</SelectItem>
                  <SelectItem value="belgique">Belgique</SelectItem>
                  <SelectItem value="suisse">Suisse</SelectItem>
                  <SelectItem value="canada">Canada</SelectItem>
                </SelectContent>
              </Select>
              {errors.country && <p className="text-red-500">{errors.country}</p>}
            </div>

            <div className="flex justify-start mt-4">
              <Button type="submit" className="w-auto rounded-xl bg-amber-400 text-md" disabled={isLoading}>
                {isSubmitted ? 'Modifier' : 'Soumettre'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
