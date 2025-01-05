// components/LogementCard.tsx

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { stayInfo } from '@/db/appSchema';
import InfoCardDialog from "./dialogs/InfoCardDialog";
import Image from "next/image";
import { useStayInfoStore } from "@/stores/useStayInfoStore";
import { useEffect } from "react";
import { toast } from "sonner";
import { IoDocumentText } from "react-icons/io5";
import { MdEdit, MdCreditCard } from "react-icons/md";
import { Loader2 } from "lucide-react";
import { useState } from "react";


// Props pour le composant LogementCard
type InfoCardProps = {
  cardInfo: typeof stayInfo.$inferSelect;
  // Fonctions pour la gestion des images
  onUpdateImage: (file: File) => void;
  // Fonctions pour la ajouter des cartes d'information
  onAddInfoCard: (logementId: number, formData: FormData) => void;
  // Fonctions pour la modifier des cartes d'information
  onEditInfoCard: (logementId: number, cardId: number, formData: FormData) => void;
  // Fonctions pour la suppression des cartes d'information
  onDeleteInfoCard: (logementId: number, cardId: number) => Promise<void>;
};


// Composant LogementCard
const InfoCard = ({
  cardInfo,
  onUpdateImage,
  onEditInfoCard,
  onDeleteInfoCard,
}: InfoCardProps) => {
  const { deleteStayInfo, updateStayInfo } = useStayInfoStore();


  // LogementCard - Données initiales
  useEffect(() => {
    console.log("InfoCard - Données initiales:", {
      logementId: cardInfo.stay_info_id,
      photoUrl: cardInfo.photo_url,
      storeImage: cardInfo.photo_url
    });
  }, [cardInfo, cardInfo.photo_url]);

  const imageUrl = cardInfo.photo_url || "/images/default-image.png";

  // LogementCard - Statut de chargement
  const [loading, setLoading] = useState(false);

  // Fonction pour supprimer un logement
  const handleDelete = async () => {
	setLoading(true);
    try {
      await deleteStayInfo(cardInfo.stay_info_id);
      toast.success("La carte d'information a été supprimée avec succès");
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error("Impossible de supprimer la carte d'information");
    } finally {
      setLoading(false);
    }
  };


  // Fonction pour modifier un logement
  const handleEdit = async (formData: FormData) => {
    try {
      const response = await fetch(`/api/infoCard/${cardInfo.stay_info_id}`, {
        method: 'PUT',
        body: formData
      });

      if (response.ok) {
        const updatedData = await response.json();
        updateStayInfo(cardInfo.stay_info_id, updatedData);
        toast.success("Carte d'information modifiée avec succès");
      }
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      toast.error("Erreur lors de la modification");
    }
  };


  return (
    <div className="overflow-hidden border rounded-xl shadow-lg bg-slate-50 w-full h-[570px] flex flex-col">
      <Image
        src={imageUrl}
        alt={cardInfo.title}
        className="object-cover w-full h-48 shrink-0"
        width={120}
        height={60}
      />
      <div className="p-4 flex flex-col h-full">
        <div>
          <h2 className="mb-2 text-2xl font-semibold">{cardInfo.title}</h2>
		  <h3 className="mb-2 text-lg text-gray-900">{cardInfo.category}</h3>
        </div>

        <div className="space-y-2 mt-auto">
          <InfoCardDialog cardInfo={cardInfo} onSubmit={handleEdit} onDelete={handleDelete}>
            <button className="bg-amber-500 rounded-xl w-full px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium text-gray-700 hover:bg-amber-400 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="text-xl animate-spin" /> : <MdEdit className="text-xl" />}
              Modifier la carte d'information
            </button>
          </InfoCardDialog>

          <div className="grid grid-cols-2 gap-2	">
            <InfoCardDialog
              logementNom={cardInfo.title}
              logementId={cardInfo.stay_info_id}
              onEditInfoCard={onEditInfoCard}
              onDeleteInfoCard={onDeleteInfoCard}
              onAddInfoCard={async () => {}}
            >
              <button className="bg-amber-200 border border-slate-300 rounded-xl w-full px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium text-gray-700 hover:bg-slate-50 flex items-center justify-center gap-2">
                <IoDocumentText className="text-xl" /> Nouvelle carte
              </button>
            </InfoCardDialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" aria-label="Voir les cartes"
                  className="bg-amber-200 border border-slate-300 rounded-xl w-full px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium text-gray-700 hover:bg-slate-50 flex items-center justify-center gap-2"
                >
                  <MdCreditCard className="text-xl" /> Voir les cartes
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>

          </div>
        </div>
      </div>
  );
};

export default InfoCard;
