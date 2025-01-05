// components/dialogs/InfoCardDialog.tsx

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import InfoCardForm from "../forms/InfoCardForm";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { create } from 'zustand';
import { stayInfo } from "@/db/appSchema";
import { useAuthStore } from "@/stores/authStore";

// Types
type InfoCardDialogProps = {
	logementId?: number;
	logementNom?: string;
	cardInfo?: typeof stayInfo.$inferSelect;
	onAddInfoCard?: (logementId: number, formData: FormData) => Promise<void>;
	onEditInfoCard?: (logementId: number, cardId: number, formData: FormData) => void;
	onDeleteInfoCard?: (logementId: number, cardId: number) => Promise<void>;
	onSubmit?: (formData: FormData) => Promise<void>;
	onDelete?: () => Promise<void>;
	children: React.ReactNode;
};

interface StayInfoStore {
	stayInfo: (typeof stayInfo.$inferSelect)[];
	isLoading: boolean;
	error: string | null;
	fetchstayInfo: (userId: number) => Promise<void>;
}

export const useStayInfoStore = create<StayInfoStore>((set) => ({
	stayInfo: [],
	isLoading: false,
	error: null,
	fetchstayInfo: async (userId) => {
		set({ isLoading: true });
		try {
			const response = await fetch(`/api/stayInfo/${userId}`);
			const data = await response.json();
			set({ stayInfo: data, isLoading: false });
		} catch (error) {
			set({ error: "Erreur lors du chargement des données", isLoading: false });
		}
	}
}));

const InfoCardDialog = ({
	logementId,
	logementNom,
	cardInfo,
	onAddInfoCard,
	onEditInfoCard,
	onDeleteInfoCard,
	onSubmit,
	onDelete,
	children
}: InfoCardDialogProps) => {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<{ success?: string; error?: string }>({});
	const { user } = useAuthStore();

	useEffect(() => {
		if (submitStatus.success) {
			toast.success(submitStatus.success);
		}
		if (submitStatus.error) {
			toast.error(submitStatus.error);
		}
	}, [submitStatus]);

	const handleSubmit = async (formData: FormData) => {
		setIsLoading(true);
		try {
			if (!logementId) throw new Error('ID du logement manquant');

			// Convertir FormData en objet JSON
			const jsonData = {
				user_id: formData.get('user_id'),
				accommodation_id: logementId,
				title: formData.get('title'),
				category: formData.get('type'),
				description: formData.get('description'),
				photo_url: formData.get('photo_url')
			};

			console.log('Données envoyées:', jsonData);

			const response = await fetch('/api/stayInfo', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				},
				body: JSON.stringify(jsonData)
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => null);
				console.error('Server error:', errorData);
				throw new Error(errorData?.message || 'Erreur lors de la sauvegarde');
			}

			if (onAddInfoCard) {
				await onAddInfoCard(logementId, formData);
			}

			toast.success("Carte d'information ajoutée avec succès");
			setOpen(false);
		} catch (error) {
			console.error('Erreur:', error);
			toast.error("Erreur lors de l'ajout de la carte d'information");
		} finally {
			setIsLoading(false);
		}
	};

	return (
	  <Dialog open={open} onOpenChange={setOpen}>
		<DialogTrigger asChild>{children}</DialogTrigger>
		<DialogContent className="p-0 bg-slate-50 rounded-xl shadow-lg overflow-y-auto max-h-[90vh] w-full max-w-2xl">
		  <DialogHeader className="p-4 border-b sticky top-0 z-10">
			<DialogTitle className="text-2xl font-bold">
			  Ajouter une carte d'information - {logementNom}
			</DialogTitle>
			<DialogDescription>
			  Remplissez les informations pour créer une nouvelle carte d'information
			</DialogDescription>
		  </DialogHeader>
		  <div className="p-4 overflow-y-auto">
			<InfoCardForm
			  onSubmit={handleSubmit}
			  onCancel={() => setOpen(false)}
			  isLoading={isLoading}
			  accommodationId={logementId || 0}
			  userId={user?.user_id ? String(user.user_id) : ''}
			/>
		  </div>
		</DialogContent>
	  </Dialog>
	);
};

export default InfoCardDialog;
