'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRef, useState, useMemo } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import CloudinaryFileUploader from "@/components/upload/CloudinaryFileUploder";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { stayInfo } from '@/db/appSchema';
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Types constants
export const CARDINFORMATION_TYPES = [
	'Electroménager',
	'Accès et Sécurité',
	'Guide d\'utilisation',
	'Arrivée et Départ',
	'Règles de la maison',
	'Découverte locale',
	'Environnement',
	'Autre'
] as const;

// Schéma de validation
const infoCardSchema = z.object({
	accommodation_id: z.number(),
	stay_info_id: z.number().optional(), // Corrigé de stayInfo_id à stay_info_id pour correspondre au schéma de la base de données
	title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
	category: z.enum(CARDINFORMATION_TYPES),
	description: z.string().min(10, "La description doit être plus détaillée"),
	photo_url: z.string().url().optional(),
	users_id: z.string().optional(), // Ajouté users_id qui est présent dans le schéma de la base de données
	created_at: z.date().optional(), // Ajouté created_at qui est présent dans le schéma
	updated_at: z.date().optional() // Ajouté updated_at qui est présent dans le schéma
});

// Types dérivés du schéma
type FormData = z.infer<typeof infoCardSchema>;
type CardType = typeof CARDINFORMATION_TYPES[number];


export interface InfoCardData {
	title: string;
	category: typeof CARDINFORMATION_TYPES[number];
	description: string;
	accommodation_id: number;
	photo_url?: string | null;
	stayInfo_id?: number;
}

// Types pour le formulaire
export interface InfoCardFormData {
	title: string;
	category: typeof CARDINFORMATION_TYPES[number];
	description: string;
	accommodation_id: number;
	photo_url: string | null | undefined;
}

// Props du composant
export interface InfoCardFormProps {
	cardInfo?: typeof stayInfo.$inferSelect;
	onSubmit: (data: InfoCardFormData) => Promise<void>;
	onCancel: () => void;
	isLoading?: boolean;
	logementId: number;
}

// Composant InfoCardForm
const InfoCardForm = ({
	cardInfo,
	onSubmit,
	onCancel,
	isLoading = false,
	logementId
}: InfoCardFormProps) => {
	console.log("InfoCardForm - Props reçues:", { cardInfo, logementId });

	const { data: session } = useSession();
	console.log("cardInfo reçu dans InfoCardForm:", cardInfo);

	// Initialisation avec des valeurs par défaut sûres
	const initialValues = useMemo(() => ({
		title: cardInfo?.title ?? '',
		category: cardInfo?.category ?? CARDINFORMATION_TYPES[0],
		description: cardInfo?.description ?? '',
		photo_url: cardInfo?.photo_url ?? '',
		accommodation_id: logementId
	}), [cardInfo, logementId]);

	const formRef = useRef<HTMLFormElement>(null);
	const [imageUrl, setImageUrl] = useState(cardInfo?.photo_url || '');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [isImageModalOpen, setIsImageModalOpen] = useState(false);
	const [validationErrors, setValidationErrors] = useState<z.ZodError | null>(null);

	const form = useForm({
		resolver: zodResolver(infoCardSchema)
	});

	// Gestion de l'upload d'image
	const handleImageUpload = async (url: string) => {
		setIsUploading(true);
		setUploadError(null);

		try {
			if (!url) {
				throw new Error("URL de l'image non reçue");
			}

			setImageUrl(url);
			toast.success("Image téléchargée avec succès");
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Erreur inconnue lors du téléchargement";
			setUploadError(errorMessage);
			toast.error("Échec du téléchargement de l'image");
			console.error("Erreur upload:", error);
		} finally {
			setIsUploading(false);
		}
	};

	// Fonction pour supprimer l'image
	const handleRemoveImage = () => {
		setImageUrl('');
		setUploadError(null);
	};

	// Gestion de la soumission avec validation
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const formData = new FormData(e.currentTarget);
			const data: InfoCardFormData = {
				title: formData.get('title') as string,
				category: formData.get('type') as typeof CARDINFORMATION_TYPES[number],
				description: formData.get('description') as string,
				accommodation_id: logementId,
				photo_url: imageUrl || null
			};

			// Validation des données avant soumission
			const validationResult = infoCardSchema.safeParse(data);
			if (!validationResult.success) {
				setValidationErrors(validationResult.error);
				toast.error("Erreur de validation des données");
				return;
			}

			console.log("Form: Données à envoyer:", data);
			await onSubmit(data);
		} catch (error) {
			console.error('Form: Erreur soumission:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form ref={formRef} onSubmit={handleSubmit} className="space-y-4 bg-slate-50 rounded-xl p-4">
			{/* Section pour l'image */}
			<div className="space-y-4 bg-slate-50 rounded-xl p-4">
				{imageUrl && (
					<>
						<div className="relative cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
							<Image
								src={imageUrl}
								alt="Aperçu"
								width={500}
								height={500}
								className="w-full h-auto rounded-xl object-cover hover:opacity-90 transition-opacity"
							/>
							<Button
								type="button"
								variant="destructive"
								size="sm"
								className="absolute top-2 right-2 bg-red-500 text-white rounded-xl hover:bg-red-700"
								onClick={(e) => {
									e.stopPropagation();
									handleRemoveImage();
								}}
							>
								Supprimer
							</Button>
						</div>

						{/* Dialog pour l'image */}
						<Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
							<DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
								<div className="relative w-full h-full">
									<Image
										src={imageUrl}
										alt="Aperçu agrandi"
										width={1920}
										height={1080}
										className="w-full h-auto object-contain"
									/>
									<Button
										type="button"
										variant="secondary"
										size="sm"
										className="absolute top-2 right-2"
										onClick={() => setIsImageModalOpen(false)}
									>
										Fermer
									</Button>
								</div>
							</DialogContent>
						</Dialog>
					</>
				)}

				{/* Section pour l'image */}
				<div className="space-y-2">
					<Label>{isUploading && "(Téléchargement en cours...)"}</Label>
					<div className="flex justify-center items-center">
						<CloudinaryFileUploader
							uploadPreset="infocard_preset"
							onUploadSuccess={handleImageUpload}
							disabled={isUploading || isSubmitting}
						/>
					</div>
					{uploadError && (
						<p className="text-red-500 text-sm">{uploadError}</p>
					)}
				</div>


			<div className="space-y-2">
				<Label htmlFor="title">Titre</Label>
				<Input
					id="title"
					name="title"
					defaultValue={initialValues.title}
					placeholder="Titre de la carte"
					required
					className="bg-white rounded-xl focus:border-gray-400"
					aria-invalid={validationErrors?.errors.some(e => e.path[0] === 'title')}
				/>
				{validationErrors?.errors.some(e => e.path[0] === 'title') && (
					<p className="text-red-500 text-sm">Le titre est requis</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="type">Type de carte</Label>
				<select
					name="type"
					defaultValue={initialValues.category}
					required
					className="w-full bg-slate-50 rounded-xl p-2 border border-slate-200"
				>
					<option value="" disabled>Sélectionnez un type</option>
					{CARDINFORMATION_TYPES.map(type => (
						<option key={type} value={type}>{type}</option>
					))}
				</select>
				{validationErrors?.errors.some(e => e.path[0] === 'category') && (
					<p className="text-red-500 text-sm">Veuillez sélectionner un type de carte</p>
				)}
			</div>


				{/* Section pour la description */}
			<div className="space-y-2">
				<Label htmlFor="description">Description</Label>
				<div className="border rounded-t-xl bg-slate-100 p-2 flex gap-2">
					<button type="button" className="p-1 hover:bg-slate-200 rounded">
						<span className="font-bold">B</span>
					</button>
					<button type="button" className="p-1 hover:bg-slate-200 rounded">
						<span className="italic">I</span>
					</button>
					<button type="button" className="p-1 hover:bg-slate-200 rounded">
						<span className="underline">U</span>
					</button>
					<span className="w-px bg-slate-300 mx-1"></span>
					<button type="button" className="p-1 hover:bg-slate-200 rounded">
						<span>🔗</span>
					</button>
					<button type="button" className="p-1 hover:bg-slate-200 rounded">
						<span>📝</span>
					</button>
				</div>
				<Textarea
					id="description"
					name="description"
					defaultValue={initialValues.description}
					placeholder="Ajoutez les détails importants pour cette carte."
					required
					className="min-h-[150px] bg-slate-50 rounded-b-xl rounded-t-none p-4"
					aria-invalid={validationErrors?.errors.some(e => e.path[0] === 'description')}
				/>
				{validationErrors?.errors.some(e => e.path[0] === 'description') && (
					<p className="text-red-500 text-sm">
						{validationErrors.errors.find(e => e.path[0] === 'description')?.message}
					</p>
				)}
			</div>


				{/* Bouton de soumission */}
				<div className="flex gap-4">
					<Button
						type="submit"
						variant="default"
						className="flex-1 bg-amber-500 text-slate-800 rounded-xl hover:bg-amber-400"
						disabled={isLoading || isSubmitting || isUploading}
					>
						{(isLoading || isSubmitting) ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								{cardInfo ? "Modification..." : "Ajout..."}
							</>
						) : (
							cardInfo ? "Modifier la carte" : "Créer la carte"
						)}
					</Button>

					{cardInfo && onCancel && (
						<Button
							type="button"
							variant="destructive"
							className="flex-1 bg-red-500 text-white rounded-xl hover:bg-red-700"
							onClick={onCancel}
							disabled={isLoading || isSubmitting || isUploading}
						>
							Supprimer
						</Button>
					)}
				</div>
			</div>
		</form>
	);
};

export default InfoCardForm;
