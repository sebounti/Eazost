// components/LogementCard.tsx

import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Accommodation, stayInfo, Product, Orders, AccessCode } from "@/types";
import LogementDialog from "./dialogs/LogementDialog";
import InfoCardDialog from "./dialogs/InfoCardDialog";
import ProductDialog from "./dialogs/ProductDialog";
import AccessCodeDialog from "./dialogs/AccessCodeDialog";
import OrderDialog from "./dialogs/OrderDialog";
import Image from "next/image";

type LogementCardProps = {
  logement: Accommodation;
  onEditLogement: (formData: FormData) => void;
  onAddInfoCard: (logementId: number, formData: FormData) => void;
  onEditInfoCard: (logementId: number, cardId: number, formData: FormData) => void;
  onAddProduct: (logementId: number, formData: FormData) => void;
  onEditProduct: (logementId: number, productId: number, formData: FormData) => void;
  onGenerateAccessCode: (logementId: number, startDateTime: Date, endDateTime: Date, email: string) => void;
  onDeleteAccessCode: (logementId: number, code: string) => void;
  onAddOrder: (logementId: number, formData: FormData) => void;
  onEditOrder: (logementId: number, orderId: number, formData: FormData) => void;
};

const LogementCard = ({
  logement,
  onEditLogement,
  onAddInfoCard,
  onEditInfoCard,
  onAddProduct,
  onEditProduct,
  onGenerateAccessCode,
  onDeleteAccessCode,
  onAddOrder,
  onEditOrder,
}: LogementCardProps) => (
  <div className="overflow-hidden border rounded-lg shadow">
    <Image src={Accommodation.photo} alt={Accommodation.nom} className="object-cover w-full h-48" />
    <div className="p-4">
      <h2 className="mb-2 text-xl font-semibold">{logement.nom}</h2>
      <p className="mb-2 text-sm text-gray-500">{logement.infoCards.length} carte(s) d&apos;information</p>
      <p className="mb-2 text-sm text-gray-500">{logement.products.length} produit(s) dans le shop</p>
      <p className="mb-4 text-sm text-gray-500">{logement.orders.length} commande(s)</p>

      <div className="space-y-3">
        {/* Logement Edit */}
        <LogementDialog logement={logement} onSubmit={onEditLogement} />

        {/* Gestion des cartes d'information */}
        <div className="grid grid-cols-2 gap-3">
          <InfoCardDialog
            logementNom={logement.nom}
            onSubmit={(formData) => onAddInfoCard(logement.id, formData)}
          />
          <DialogTrigger asChild>
            <Button variant="outline">Voir cartes</Button>
          </DialogTrigger>
        </div>

        {/* Gestion des produits */}
        <div className="grid grid-cols-2 gap-3">
          <ProductDialog
            logementNom={logement.nom}
            onSubmit={(formData) => onAddProduct(logement.id, formData)}
          />
          <DialogTrigger asChild>
            <Button variant="outline">Voir shop</Button>
          </DialogTrigger>
        </div>

        {/* Gestion des codes d'accès */}
        <AccessCodeDialog
          logementNom={logement.nom}
          accessCodes={logement.accessCodes}
          onGenerateCode={(startDateTime, endDateTime, email) =>
            onGenerateAccessCode(logement.id, startDateTime, endDateTime, email)
          }
          onDeleteCode={(code) => onDeleteAccessCode(logement.id, code)}
        />

        {/* Gestion des commandes */}
        <OrderDialog
          logementNom={logement.nom}
          products={logement.products}
          onSubmit={(formData) => onAddOrder(logement.id, formData)}
        />
      </div>
    </div>
  </div>
);

export default LogementCard;
