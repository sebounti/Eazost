'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import CloudinaryFileUploader from "@/components/upload/CloudinaryFileUploder";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

// Types constants
const CARDINFORMATION_TYPES = [
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
const formSchema = z.object({
	user_id: z.string(),
	accommodation_id: z.number(),
	stayInfo_id: z.number().optional(),
	title: z.string().min(1, "Le titre est requis"),
	category: z.enum(CARDINFORMATION_TYPES),
	description: z.string().min(10, "La description doit faire au moins 10 caractères"),
	photo_url: z.string().url().optional()
});

// Types dérivés du schéma
type FormData = z.infer<typeof formSchema>;
type CardType = typeof CARDINFORMATION_TYPES[number];

// Props avec types stricts
interface InfoCardFormProps {
	card?: FormData;
	onSubmit: (data: FormData) => Promise<void>;
	onCancel: () => void;
	onDelete?: () => Promise<void>;
	isLoading?: boolean;
	accommodationId: number;
	userId: string;
}

// Composant InfoCardForm
const InfoCardForm = ({ card, onSubmit, onCancel, onDelete, isLoading = false, accommodationId, userId }: InfoCardFormProps) => {
	const formRef = useRef<HTMLFormElement>(null);
	const [imageUrl, setImageUrl] = useState(card?.photo_url || '');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [isImageModalOpen, setIsImageModalOpen] = useState(false);
	const [validationErrors, setValidationErrors] = useState<z.ZodError | null>(null);

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
		setValidationErrors(null);
		setIsSubmitting(true);

		try {
			if (!accommodationId || !userId) {
				throw new Error("ID du logement ou de l'utilisateur manquant");
			}

			const formData = new FormData(e.currentTarget);
			const data = {
				user_id: userId,
				accommodation_id: accommodationId,
				stayInfo_id: card?.stayInfo_id,
				title: formData.get('title') as string,
				category: formData.get('type') as CardType,
				description: formData.get('description') as string,
				photo_url: imageUrl || undefined
			};

			// Validation avec Zod
			const validatedData = formSchema.parse(data);
			await onSubmit(validatedData);
			toast.success("Carte d'information enregistrée avec succès");
			onCancel();
		} catch (error) {
			if (error instanceof z.ZodError) {
				setValidationErrors(error);
				error.errors.forEach(err => {
					toast.error(`${err.path.join('.')}: ${err.message}`);
				});
			} else {
				console.error(error);
				toast.error("Erreur lors de la soumission du formulaire");
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form ref={formRef} onSubmit={handleSubmit} className="space-y-4 bg-slate-50 rounded-xl p-4">
			<div className="space-y-2">
				<Label htmlFor="title">Titre</Label>
				<Input
					id="title"
					name="title"
					defaultValue={card?.title}
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
				<Select name="type" defaultValue={card?.category || ''} required>
					<SelectTrigger className="w-full bg-slate-50 rounded-xl">
						<SelectValue placeholder="Sélectionnez un type" />
					</SelectTrigger>
					<SelectContent className="bg-slate-50 rounded-xl">
						{CARDINFORMATION_TYPES.map(type => (
							<SelectItem key={type} value={type}>{type}</SelectItem>
						))}
					</SelectContent>
				</Select>
				{validationErrors?.errors.some(e => e.path[0] === 'category') && (
					<p className="text-red-500 text-sm">Veuillez sélectionner un type de carte</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="description">Description</Label>
				<Textarea
					id="description"
					name="description"
					defaultValue={card?.description}
					placeholder="Contenu de la carte"
					required
					className="min-h-[150px] bg-slate-50 rounded-xl p-4"
					aria-invalid={validationErrors?.errors.some(e => e.path[0] === 'description')}
				/>
				{validationErrors?.errors.some(e => e.path[0] === 'description') && (
					<p className="text-red-500 text-sm">La description doit faire au moins 10 caractères</p>
				)}
			</div>

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

				<div className="space-y-2">
					<Label>Image {isUploading && "(Téléchargement en cours...)"}</Label>
					<div className="flex justify-center items-center">
						<CloudinaryFileUploader
							onUploadSuccess={handleImageUpload}
							disabled={isUploading || isSubmitting}
						/>
					</div>
					{uploadError && (
						<p className="text-red-500 text-sm">{uploadError}</p>
					)}
				</div>

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
								{card ? "Modification..." : "Ajout..."}
							</>
						) : (
							card ? "Modifier" : "Ajouter"
						)}
					</Button>

					{card && onDelete && (
						<Button
							type="button"
							variant="destructive"
							className="flex-1 bg-red-500 text-white rounded-xl hover:bg-red-700"
							onClick={onDelete}
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
