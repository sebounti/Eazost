"use client"

// Importation des bibliothèques nécessaires
import { useEffect, useState } from "react";
import { useUserinfoStore } from "@/stores/userinfoStore";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

// Importation des composants UI
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ChangePasswordPopup from "@/components/news/ChangePasswordPopup";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShadcnDatePicker } from "@/components/ui/date-picker";


/**
 * formulaire de mise à jour des informations de l'utilisateur.
 *
 * Cette page affiche les informations de l'utilisateur.
 */


// Interface pour les données du formulaire
interface FormData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone_number: string;
  address_line1: string;
  address_line2: string;
  city: string;
  zipcode: string;
  country: string;
  email: string;
}

// Interface pour les données de l'utilisateur
interface UserInfo {
  users_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone_number: string;
  address_line1: string;
  address_line2: string;
  city: string;
  zipcode: string;
  country: string;
  email: string;
}



// Composant pour le formulaire de mise à jour des informations de l'utilisateur
export default function UserInfoForm() {
	const { userInfo, fetchFullInfo } = useUserinfoStore();
	const { user } = useAuthStore();

	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isInitialLoading, setIsInitialLoading] = useState(true);
	const [formData, setFormData] = useState<FormData>({
		first_name: "",
		last_name: "",
		date_of_birth: "",
		phone_number: "",
		address_line1: "",
		address_line2: "",
		city: "",
		zipcode: "",
		country: "",
		email: user?.email || "",
	});

	// Ajout des logs de débogage
	console.log("User from authStore:", user);
	console.log("UserInfo:", userInfo);
	console.log("FormData:", formData);

	// Modification de l'effet pour mettre à jour formData quand userInfo change
	useEffect(() => {
		if (userInfo) {
			console.log("Mise à jour du formData avec:", {
				userInfo,
				email: user?.email
			});

			setFormData({
				first_name: userInfo.first_name || "",
				last_name: userInfo.last_name || "",
				date_of_birth: userInfo.date_of_birth?.toString().split('T')[0] || "",
				phone_number: userInfo.phone_number || "",
				address_line1: userInfo.address_line1 || "",
				address_line2: userInfo.address_line2 || "",
				city: userInfo.city || "",
				zipcode: userInfo.zipcode || "",
				country: userInfo.country || "",
				email: user?.email || "",
			});
		}
	}, [userInfo, user?.email]);

	// Séparation de l'effet de chargement initial
	useEffect(() => {
		const loadUserInfo = async () => {
			if (user?.user_id && !userInfo) {
				setIsInitialLoading(true);
				try {
					await fetchFullInfo(user.user_id);
				} finally {
					setIsInitialLoading(false);
				}
			} else {
				setIsInitialLoading(false);
			}
		};
		loadUserInfo();
	}, [user, userInfo, fetchFullInfo]);

	if (isInitialLoading) {
		return <div>Chargement des informations...</div>;
	}

	// Fonction pour gérer les changements dans les champs du formulaire
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};


	// Fonction pour soumettre le formulaire
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!user?.user_id) {
			toast.error("Utilisateur non trouvé");
			return;
		}
		setIsLoading(true);

		try {
			const response = await fetch(`/api/users/${user.user_id}/profile`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => null);
				throw new Error(errorData?.message || `Erreur HTTP: ${response.status}`);
			}

			const data = await response.json();
			setIsSubmitted(true);
			await fetchFullInfo(user.user_id);
			toast.success("Profil mis à jour avec succès !");
		} catch (error) {
			console.error("Erreur lors de la soumission du formulaire :", error);
			toast.error(error instanceof Error ? error.message : "Erreur lors de la mise à jour des données.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form className="space-y-8" onSubmit={handleSubmit}>
			{/* Carte Compte */}
			<Card>
				<CardHeader>
					<CardTitle className="text-3xl">Compte</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="rounded-lg border p-4">
						<Label htmlFor="email" className="text-xl">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							value={user?.email || ''}
							readOnly
							className="mt-2 w-1/3"
						/>
					</div>
					<div className="rounded-lg border p-4">
						<Label htmlFor="password" className="text-xl">Mot de passe</Label>
						<Input
							id="password"
							name="password"
							type="password"
							value="***********"
							readOnly
							className="mt-2 w-1/3"
						/>
						<div className="flex justify-start mt-4">
							<ChangePasswordPopup />
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Carte Informations Personnelles */}
			<Card>
				<CardHeader>
					<CardTitle className="text-3xl">Informations personnelles</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="rounded-lg border p-4">
						<Label htmlFor="first_name" className="text-xl">Prénom</Label>
						<Input
							id="first_name"
							name="first_name"
							placeholder="John"
							value={formData.first_name}
							onChange={handleChange}
							className="mt-2 w-1/3 text-xl"
						/>
					</div>

					<div className="rounded-lg border p-4">
						<Label htmlFor="last_name" className="text-xl">Nom</Label>
						<Input
							id="last_name"
							name="last_name"
							placeholder="Doe"
							value={formData.last_name}
							onChange={handleChange}
							className="mt-2 w-1/3"
						/>
					</div>

					<div className="rounded-lg border flex flex-col p-4">
						<Label htmlFor="date_of_birth" className="text-xl pr-2">Date de naissance</Label>
								<ShadcnDatePicker
									startYear={1930}
									endYear={2030}
									selected={formData.date_of_birth ? new Date(formData.date_of_birth) : undefined}
									onSelect={(date: Date | undefined) =>
										setFormData(prev => ({
											...prev,
											date_of_birth: date ? date.toISOString().split('T')[0] : ""
										}))
									}
									initialFocus
								/>
					</div>

					{/* Téléphone */}
					<div className="rounded-lg border p-4">
						<Label htmlFor="phone_number" className="text-xl">Téléphone</Label>
						<Input
							id="phone_number"
							name="phone_number"
							type="tel"
							placeholder="06 70 XX XX XX"
							value={formData.phone_number}
							onChange={handleChange}
							className="mt-2 w-1/6"
						/>
					</div>

					{/* Adresse 1 */}
					<div className="rounded-lg border p-4">
						<Label htmlFor="address_line1" className="text-xl">Adresse 1</Label>
						<Input
							id="address_line1"
							name="address_line1"
							placeholder="123 Rue de la Paix"
							value={formData.address_line1}
							onChange={handleChange}
							className="mt-2 w-2/3"
						/>
					</div>

					{/* Adresse 2 */}
					<div className="rounded-lg border p-4">
						<Label htmlFor="address_line2" className="text-xl">Adresse 2</Label>
						<Input
							id="address_line2"
							name="address_line2"
							value={formData.address_line2}
							onChange={handleChange}
							className="mt-2 w-2/3"
						/>
					</div>

					{/* Ville */}
					<div className="rounded-lg border p-4">
						<Label htmlFor="city" className="text-xl">Ville</Label>
						<Input
							id="city"
							name="city"
							placeholder="Paris"
							value={formData.city}
							onChange={handleChange}
							className="mt-2 w-1/3"
						/>
					</div>

					{/* Code postal */}
					<div className="rounded-lg border p-4">
						<Label htmlFor="zipcode" className="text-xl">Code postal</Label>
						<Input
							id="zipcode"
							name="zipcode"
							placeholder="75000"
							value={formData.zipcode}
							onChange={handleChange}
							className="mt-2 w-1/6"
						/>
					</div>

					{/* Pays */}
					<div className="rounded-lg border p-4">
						<Label htmlFor="country" className="text-xl">Pays</Label>
						<Select
							onValueChange={(value) =>
								setFormData((prev) => ({
									...prev,
									country: value,
								}))
							}
							value={formData.country}
						>
							<SelectTrigger className="mt-2 w-1/3">
								<SelectValue placeholder="Sélectionnez votre pays" />
							</SelectTrigger>
							<SelectContent className="bg-amber-200">
								<SelectItem value="france">France</SelectItem>
								<SelectItem value="belgique">Belgique</SelectItem>
								<SelectItem value="suisse">Suisse</SelectItem>
								<SelectItem value="canada">Canada</SelectItem>
							</SelectContent>
						</Select>
					</div>


					{/* Bouton de soumission */}
					<div className="flex justify-start mt-4">
						<Button
							type="submit"
							disabled={isLoading}
							className="text-silver-400 bg-amber-400 text-lg shadow-lg rounded-xl hover:bg-amber-600"
						>
							{isSubmitted ? "Modifier le profil" : "Sauvegarder le profil"}
						</Button>
					</div>
				</CardContent>
			</Card>
		</form>
	);
}
