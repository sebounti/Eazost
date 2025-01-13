// components/LogementCard.tsx

import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Image from "next/image";
import { useStayInfoStore } from "@/stores/useStayInfoStore";
import { useEffect, useState } from "react";
import { MdEdit, MdDelete,  } from "react-icons/md";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { stayInfo } from "@/db/appSchema";
import type { InfoCardData } from "./forms/InfoCardForm";  // Importez le type depuis InfoCardForm
import { FocusScope } from '@radix-ui/react-focus-scope';
import InfoCardDialog from "./dialogs/InfoCardDialog";
import { InfoCardFormData } from "./forms/InfoCardForm";



// Props pour le composant LogementCard
interface InfoCardProps {
  cardInfo: typeof stayInfo.$inferSelect;
  onUpdateImage: (file: File) => void;
  onEditInfoCard: (logementId: number, cardId: number, data: InfoCardFormData) => Promise<void>;
  onAddInfoCard: (logementId: number, data: InfoCardFormData) => Promise<void>;
  onDeleteInfoCard: (cardId: number) => void;
}


// Composant LogementCard
const InfoCard = ({ cardInfo, onUpdateImage, onEditInfoCard, onAddInfoCard, onDeleteInfoCard }: InfoCardProps) => {
	console.log("InfoCard - cardInfo:", cardInfo);
	const { updateStayInfo, deleteStayInfo } = useStayInfoStore();
	const [loading, setLoading] = useState(false);
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);

	const handleSubmit = async (data: InfoCardData) => {
		try {
			const updatedData = {
				title: data.title,
				description: data.description,
				category: data.category ?? null,
				photo_url: data.photo_url ?? null
			};
			await updateStayInfo(cardInfo.stay_info_id, updatedData);
		} catch (error) {
			console.error("Erreur lors de la mise à jour:", error);
		}
	};

  // LogementCard - Données initiale
  useEffect(() => {
    console.log("InfoCard - Données initiales:", {
      logementId: cardInfo.stay_info_id,
      photoUrl: cardInfo.photo_url,
      storeImage: cardInfo.photo_url,
      title: cardInfo.title,
      description: cardInfo.description,
      category: cardInfo.category,
    });
  }, [cardInfo]);

  // LogementCard - URL de l'image
  const imageUrl = cardInfo.photo_url || "/images/default-image.png";

  return (
    <FocusScope asChild>
      <div className="bg-white rounded-lg shadow-md p-4 relative h-[500px] flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{cardInfo.title}</h2>
          <div className="flex gap-2">
            <InfoCardDialog
              cardInfo={cardInfo}
              logementId={cardInfo.accommodation_id}
              onEditInfoCard={onEditInfoCard}
              onAddInfoCard={onAddInfoCard}
            >
              <button className="p-2 bg-amber-200 rounded hover:bg-amber-400">
                <MdEdit className="text-gray-600 text-xl" />
              </button>
            </InfoCardDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="p-2 bg-red-200 rounded hover:bg-red-400">
                  <MdDelete className="text-gray-600 text-xl" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    La carte sera définitivement supprimée.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteStayInfo(cardInfo.stay_info_id)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <Image
          src={imageUrl}
          alt={cardInfo.title}
          className="w-full h-48 object-cover rounded mb-4"
          width={300}
          height={200}
          quality={100}
        />

        <div className="space-y-3 flex-1 mb-4">
          <h3 className="text-xl text-gray-700">{cardInfo.category}</h3>
          <div className="relative h-[90px] overflow-hidden">
            <p className={`text-sm italic text-gray-600 ${
              cardInfo.description.length > 100 ? 'line-clamp-3' : ''
            }`}>
              {cardInfo.description}
            </p>
            {cardInfo.description.length > 150 && (
              <div>
                <button
                  aria-label="Voir plus"
                  onClick={() => setIsPreviewOpen(true)}
                  className="text-amber-500 hover:text-amber-700 text-sm absolute bottom-0 right-0 bg-white"
                >
                  Voir plus...
                </button>
              </div>
            )}
          </div>

          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogContent>
              <DialogTitle>{cardInfo.title}</DialogTitle>
              <DialogDescription>{cardInfo.description}</DialogDescription>
              <div className="space-y-6 flex flex-col items-center">
                <div className="flex justify-between w-full">
                </div>
                <Image
                  src={cardInfo.photo_url || "/images/default-image.png"}
                  alt={cardInfo.title}
                  width={250}
                  height={200}
                  className="rounded"
                />
                <p className="text-2xl text-gray-500">{cardInfo.category}</p>
                <p className="text-base italic text-gray-400 justify-center">{cardInfo.description}</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </FocusScope>
  );
};

export default InfoCard;
