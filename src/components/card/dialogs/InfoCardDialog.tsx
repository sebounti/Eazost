//--- Composant InfoCardDialog ---
//--- Composant pour la gestion des cartes d'informations ---//

"use client";

// React imports
import { useState, useCallback, useEffect } from "react";
// UI Components
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
// Custom Components
import InfoCardForm, { InfoCardFormData } from "../forms/InfoCardForm";
// Types
import { stayInfo } from "@/db/appSchema";
import * as Dialog from '@radix-ui/react-dialog'


// Types
type InfoCardDialogProps = {
	logementId: number;
	logementNom?: string;
	cardInfo?: typeof stayInfo.$inferSelect;
	onAddInfoCard: (logementId: number, data: InfoCardFormData) => Promise<void>;
	onEditInfoCard: (logementId: number, cardId: number, data: InfoCardFormData) => Promise<void>;
	onDeleteInfoCard?: (logementId: number, cardId: number) => Promise<void>;
	children: React.ReactNode;
};

export default function InfoCardDialog({
	logementId,
	cardInfo,
	onEditInfoCard,
	onAddInfoCard,
	children
}: InfoCardDialogProps) {
	console.log("InfoCardDialog - Props reçues:", { logementId, cardInfo });

	const [isLoading, setIsLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState(cardInfo);
	const [isEditing, setIsEditing] = useState(false);


	//	fetch des cartes information par logement
	useEffect(() => {
		if (cardInfo) {
			setFormData(cardInfo);
		}
	}, [cardInfo]);

	const handleSubmit = async (data: InfoCardFormData) => {
		try {
			setIsLoading(true);
			if (!logementId) throw new Error("ID logement manquant");

			if (!cardInfo) {
				console.log("Dialog: Tentative création carte:", { logementId, data });
				if (!onAddInfoCard) throw new Error("Fonction onAddInfoCard manquante");
				await onAddInfoCard(logementId, data);
			} else {
				await onEditInfoCard?.(logementId, cardInfo.stay_info_id, data);
			}

			setOpen(false);
		} catch (error) {
			console.error('Erreur:', error);
			toast.error("Une erreur est survenue");
		} finally {
			setIsLoading(false);
		}
	};

	const handleOpenChange = useCallback((newOpen: boolean) => {
		setOpen(newOpen);
		if (!newOpen) {
			setIsLoading(false);
		}
	}, []);

	return (
		<Dialog.Root open={open} onOpenChange={handleOpenChange}>
			<Dialog.Trigger asChild>
				{children}
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="bg-black/50 fixed inset-0" />
				<Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-0 bg-slate-50 rounded-xl shadow-lg overflow-y-auto max-h-[90vh] w-full max-w-2xl">
					<Dialog.Title className="sr-only">
						{cardInfo ? "Modifier la carte" : "Nouvelle carte"}
					</Dialog.Title>
					<Dialog.Description className="sr-only">
						{cardInfo ? "Modifier les informations de la carte" : "Créer une nouvelle carte d'information"}
					</Dialog.Description>

					<DialogHeader className="p-4 bg-amber-500 border-b sticky top-0 z-10">
						<DialogTitle>{cardInfo?.title || "Nouvelle carte"}</DialogTitle>
					</DialogHeader>

					<div className="p-4 overflow-y-auto">
							<InfoCardForm
								cardInfo={formData}
								onSubmit={handleSubmit}
								onCancel={() => setIsEditing(false)}
								isLoading={isLoading}
								logementId={logementId || 0}
							/>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
