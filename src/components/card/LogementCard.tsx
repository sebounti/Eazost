//--- Composant LogementCard ---
//--- Composant pour la gestion des logements ---//

// React imports
import { useState, useEffect } from "react";
import Image from "next/image";
// UI Components
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// Custom Components
import ProductDialog from "./dialogs/ProductDialog";
import AccessCodeDialog from "./dialogs/AccessCodeDialog";
import OrderDialog from "@/components/card/dialogs/OrderDialog";
// Icons
import { MdEdit, MdAdd, MdCreditCard, MdShoppingCart, MdKey, MdShoppingBag } from "react-icons/md";
import { IoDocumentText } from "react-icons/io5";
import { Loader2 } from "lucide-react";
// Types
import { Accommodation, Product } from "@/types";
import { type InfoCardFormData, CARDINFORMATION_TYPES } from "./forms/InfoCardForm";
// Stores
import { useAccommodationStore } from "@/stores/accommodationStore";
import { useStayInfoStore } from "@/stores/useStayInfoStore";
// Utils
import { toast } from "sonner";


// Custom Components
import LogementDialog from "./dialogs/LogementDialog";
import InfoCardDialog from "./dialogs/InfoCardDialog";
import { useOrderStore } from "@/stores/useOrderStore";

// Props interface
interface LogementCardProps {
  logement: Accommodation;
  onEditLogement: (formData: FormData) => Promise<void>;
  onAddInfoCard: (logementId: number, data: InfoCardFormData) => Promise<void>;
  onEditInfoCard: (logementId: number, cardId: number, data: InfoCardFormData) => void;
  onAddProduct: (logementId: number, product: Product) => Promise<void>;
  onGenerateAccessCode: (logementId: number, startDateTime: Date, endDateTime: Date, email: string) => void;
  onAddOrder: (logementId: number, formData: FormData) => void;
  onDeleteAccessCode: (logementId: number, code: string) => void;
}


// Composant avec export nommé
export default function LogementCard({
  logement,
  onAddInfoCard,
  onEditInfoCard,
  onAddProduct,
  onGenerateAccessCode,
  onAddOrder,
  onDeleteAccessCode,
}: LogementCardProps) {
  const { stayInfo, fetchStayInfosByLogementId } = useStayInfoStore();
  const { deleteAccommodation, updateAccommodation } = useAccommodationStore();
  const { fetchOrders } = useOrderStore();

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


  /* --------- fonction logement ------------- */

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
      } else {
		const errorData = await response.json();
		toast.error(`Erreur : ${errorData.message || "Modification échouée"}`);
	  }
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      toast.error("Erreur lors de la modification");
    }
  };

  // Fonction pour générer un code d'accès
  const handleGenerateCode = (data: any) => {
    console.log("Code généré :", data);
  };

  // Fonction pour soumettre une commande
  const onSubmitOrder = async (data: any) => {
    try {
      await fetchOrders(logement.accommodation_id);
    } catch (error) {
      toast.error("Erreur lors de la lecture des commandes");
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

          {/* Cette ligne affiche le nombre de cartes d'information associées au logement.
              - logement.stayInfo?.length : Accède au nombre de cartes de façon sécurisée avec l'opérateur ?.
              - || 0 : Retourne 0 si stayInfo est null/undefined
              - Le texte est en gris (text-gray-500) et petit (text-sm) avec une marge en bas (mb-2) */}
          <p className="mb-2 text-sm text-gray-500">{logement.stayInfo?.length || 0} carte(s) d'information</p>
          <p className="mb-2 text-sm text-gray-500">{logement.products?.length || 0} produit(s) dans le shop</p>
          <p className="mb-4 text-sm text-gray-500">{logement.orders?.length || 0} commande(s)</p>
        </div>



        <div className="space-y-2 mt-auto">
          <LogementDialog
		  logement={logement}
		  onSubmit={handleEdit}
		  onDelete={handleDelete}>
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
                <Button
                  onClick={() => fetchStayInfosByLogementId(logement.accommodation_id)}
                  className="bg-amber-200 border border-slate-300 rounded-xl w-full px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium text-gray-700 hover:bg-slate-50 flex items-center justify-center gap-2"
                >
                  <MdCreditCard className="text-xl" /> Voir les cartes
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl bg-slate-50 ">
                <DialogHeader >
                  <DialogTitle>Cartes d'information - {logement.name}</DialogTitle>
                  <DialogDescription>
                    Gérez les cartes d'information pour ce logement
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-h-[70vh] overflow-y-auto">
                  {stayInfo.map((card) => (
                    <div key={card.stay_info_id} className="bg-white p-4 rounded-xl shadow-xl border border-gray-300">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{card.title}</h3>
                        <span className="text-sm text-gray-600 px-2 py-1 bg-amber-400 rounded">
                          {card.category}
                        </span>
                      </div>
                      {card.photo_url && (
                        <div className="relative h-40 mb-2">
                          <Image
                            src={card.photo_url}
                            alt={card.title}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <p className=" text-gray-600 text-sm">{card.description}</p>
                      <div className="mt-4 flex justify-end gap-2">
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <ProductDialog
              initialProduct={{
                product_id: 0,
                name: '',
                description: '',
                image_url: null,
                price: 0,
                stock: 0
              }}
              onSave={async (product: Product) => await onAddProduct(logement.accommodation_id, product)}
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
				onSubmit={handleGenerateCode}>
				<button className="bg-amber-200 border border-slate-300 rounded-xl w-full px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium text-gray-700 hover:bg-slate-50 flex items-center justify-center gap-2">
                <MdKey className="text-xl" /> Codes d'accès
              </button>
            </AccessCodeDialog>
            <OrderDialog
              logementNom={logement.name}
              products={logement.products}
              onSubmit={onSubmitOrder}
              children={
                <button className="bg-amber-200 border border-slate-300 rounded-xl w-full px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium text-gray-700 hover:bg-slate-50 flex items-center justify-center gap-2">
                  <MdShoppingBag className="text-xl" /> Commandes
                </button>
              }
            >
            </OrderDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
