// components/LogementCard.tsx

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Accommodation, stayInfo } from "@/types";
import LogementDialog from "./dialogs/LogementDialog";
import InfoCardDialog from "./dialogs/InfoCardDialog";
import ProductDialog from "./dialogs/ProductDialog";
import AccessCodeDialog from "./dialogs/AccessCodeDialog";
import OrderDialog from "./dialogs/OrderDialog";
import Image from "next/image";
import { useAccommodationStore } from "@/stores/accommodationStore";
import { useEffect } from "react";
import { toast } from "sonner";
import { MdEdit, MdAdd, MdCreditCard, MdShoppingCart, MdKey, MdShoppingBag } from "react-icons/md";
import { IoDocumentText } from "react-icons/io5";
import { Loader2 } from "lucide-react";
import { useState } from "react";


// Props pour le composant LogementCard
type LogementCardProps = {
  logement: Accommodation;
  // Fonctions pour la gestion des images
  onUpdateImage: (file: File) => Promise<void>;
  // Fonctions pour la gestion des logements
  onEditLogement: (formData: FormData) => void;
  // Fonctions pour la ajouter des cartes d'information
  onAddInfoCard: (logementId: number, formData: FormData) => Promise<void>;
  // Fonctions pour la modifier des cartes d'information
  onEditInfoCard: (logementId: number, cardId: number, formData: FormData) => void;
  // Fonctions pour la gestion des produits
  onAddProduct: (logementId: number, formData: FormData) => void;
  // Fonctions pour la modifier des produits
  onEditProduct: (logementId: number, productId: number, formData: FormData) => void;
  // Fonctions pour la gestion des codes d'accès
  onGenerateAccessCode: (logementId: number, startDateTime: Date, endDateTime: Date, email: string) => void;
  // Fonctions pour effacer un code d'accès
  onDeleteAccessCode: (logementId: number, code: string) => void;
  // Fonctions pour ajouter une commande
  onAddOrder: (logementId: number, formData: FormData) => void;
  // Fonctions pour la gestion des commandes
  onEditOrder: (logementId: number, orderId: number, formData: FormData) => void;
};


// Composant LogementCard
const LogementCard = ({
  logement,
  onUpdateImage,
  onEditLogement,
  onAddInfoCard,
  onAddProduct,
  onEditProduct,
  onGenerateAccessCode,
  onDeleteAccessCode,
  onAddOrder,
  onEditInfoCard,
}: LogementCardProps) => {
  const { deleteAccommodation, updateAccommodation } = useAccommodationStore();


  // LogementCard - Données initiales
  useEffect(() => {
    console.log("LogementCard - Données initiales:", {
      logementId: logement.accommodation_id,
      photoUrl: logement.photo_url,
      storeImage: logement.photo_url
    });
  }, [logement, logement.photo_url]);

  const imageUrl = logement.photo_url || "/images/default-image.png";

  // LogementCard - Statut de chargement
  const [loading, setLoading] = useState(false);

  // Fonction pour supprimer un logement
  const handleDelete = async () => {
	setLoading(true);
    try {
      await deleteAccommodation(logement.accommodation_id);
      toast.success("Le logement a été supprimé avec succès");
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error("Impossible de supprimer le logement");
    } finally {
      setLoading(false);
    }
  };


  // Fonction pour modifier un logement
  const handleEdit = async (formData: FormData) => {
    try {
      const response = await fetch(`/api/properties/${logement.accommodation_id}`, {
        method: 'PUT',
        body: formData
      });

      if (response.ok) {
        const updatedData = await response.json();
        updateAccommodation(logement.accommodation_id, updatedData);
        toast.success("Logement modifié avec succès");
      }
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      toast.error("Erreur lors de la modification");
    }
  };


  return (
    <div className="overflow-hidden border rounded-lg shadow-xl bg-slate-50 w-full h-[570px] flex flex-col">
      <Image
        src={imageUrl}
        alt={logement.name}
        className="object-cover w-full h-48 shrink-0"
        width={120}
        height={60}
      />
      <div className="p-4 flex flex-col h-full">
        <div>
          <h2 className="mb-2 text-2xl font-semibold">{logement.name}</h2>
		  <h3 className="mb-2 text-lg text-gray-900">{logement.type}</h3>

          <p className="mb-2 text-sm text-gray-500">{logement.InfoCard?.length || 0} carte(s) d'information</p>
          <p className="mb-2 text-sm text-gray-500">{logement.products?.length || 0} produit(s) dans le shop</p>
          <p className="mb-4 text-sm text-gray-500">{logement.orders?.length || 0} commande(s)</p>
        </div>

        <div className="space-y-2 mt-auto">
          <LogementDialog logement={logement} onSubmit={handleEdit} onDelete={handleDelete}>
            <button className="bg-amber-500 rounded-lg w-full px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium text-gray-700 hover:bg-amber-400 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="text-xl animate-spin" /> : <MdEdit className="text-xl" />}
              Modifier le logement
            </button>
          </LogementDialog>

          <div className="grid grid-cols-2 gap-2">
            <InfoCardDialog
              logementNom={logement.name}
              logementId={logement.accommodation_id}
              onAddInfoCard={onAddInfoCard}
              onEditInfoCard={onEditInfoCard}
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

          <div className="grid grid-cols-2 gap-2">
            <ProductDialog
              logementNom={logement.name}
              onSubmit={(formData) => onAddProduct(logement.accommodation_id, formData)}
            >
            <button className="bg-amber-200 border border-slate-300 rounded-xl w-full px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium text-gray-700 hover:bg-slate-50 flex items-center justify-center gap-2">
				{loading ? <Loader2 className="text-xl animate-spin" /> : <MdAdd className="text-xl" />}
				Nouveau produit
              </button>
            </ProductDialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  aria-label="Voir le shop"
                  className="bg-amber-200 border border-slate-300 rounded-xl w-full px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium text-gray-700 hover:bg-slate-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="text-xl animate-spin" /> : <MdShoppingCart className="text-xl" />}
                  Voir le shop
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <AccessCodeDialog
              logementNom={logement.name}
              accommodationId={logement.accommodation_id}
              onGenerateCode={(startDateTime, endDateTime, email) =>
                onGenerateAccessCode(logement.accommodation_id, startDateTime, endDateTime, email)
              }
              onDeleteCode={(code) => onDeleteAccessCode(logement.accommodation_id, code)}
            >
              <button className="bg-amber-200 border border-slate-300 rounded-xl w-full px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium text-gray-700 hover:bg-slate-50 flex items-center justify-center gap-2">
                <MdKey className="text-xl" /> Codes d'accès
              </button>
            </AccessCodeDialog>
            <OrderDialog
              logementNom={logement.name}
              products={logement.products}
              onSubmit={(formData) => onAddOrder(logement.accommodation_id, formData)}
            >
              <button className="bg-amber-200 border border-slate-300 rounded-xl w-full px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium text-gray-700 hover:bg-slate-50 flex items-center justify-center gap-2">
                <MdShoppingBag className="text-xl" /> Commandes
              </button>
            </OrderDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogementCard;
