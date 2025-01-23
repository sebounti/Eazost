//--- Composant OrderCard ---
//--- Composant pour la gestion des commandes ---//

"use client";

// React imports
import { useState } from "react";
// UI Components
import { toast } from "@/components/ui/use-toast";
// Custom Components
import OrderDialog from "./dialogs/OrderDialog";
// Types
import { Product } from "@/types";


type OrderCardProps = {
  logementNom: string;
  products: Product[];
  onSubmitOrder: (data: any) => void;
};

const OrderCard = ({ logementNom, products, onSubmitOrder }: OrderCardProps) => {
  const [orders, setOrders] = useState<any[]>([]);

  const handleSubmitOrder = async (data: any) => {
    try {
      await onSubmitOrder(data);
      setOrders([...orders, data]);
      toast({
        title: "Succès",
        description: "La commande a été créée avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la commande.",
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-bold mb-4">Gestion des Commandes</h2>

      <OrderDialog
        logementNom={logementNom}
        products={products}
        onSubmit={handleSubmitOrder}
      >
        <button className="w-full bg-amber-500 text-white rounded-lg p-2">
          Nouvelle Commande
        </button>
      </OrderDialog>

      {orders.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Commandes récentes:</h3>
          <div className="space-y-2">
            {orders.map((order, index) => (
              <div key={index} className="p-2 bg-gray-100 rounded">
                <p>Client: {order.customerName}</p>
                <p>Produit: {order.productId}</p>
                <p>Quantité: {order.quantity}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
