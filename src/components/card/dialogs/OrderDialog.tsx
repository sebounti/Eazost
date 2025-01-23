//--- Composant OrderDialog ---//
//--- Composant pour la gestion des commandes ---//

"use client";


// React imports
import { useState } from "react";
// UI Components
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// Custom Components
import OrderCardForm from "@/components/card/forms/OrderCardForm";
// Types
import { Product } from "@/types";

// Types
interface OrderDialogProps {
  logementNom: string;
  products: Product[];
  children: React.ReactNode;
  onSubmit: (data: any) => Promise<void>;
}

const OrderDialog = ({ logementNom, products, children, onSubmit }: OrderDialogProps) => {
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  const handleSubmit = async (data: any) => {
    console.log("Commande soumise:", data);
    setOrders([...orders, data]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md mx-auto bg-white">
        <DialogHeader>
          <DialogTitle>Liste des Commandes</DialogTitle>
          <DialogDescription>
            {orders.length > 0 ? (
              <ul>
                {orders.map((order, index) => (
                  <li key={index}>{JSON.stringify(order)}</li>
                ))}
              </ul>
            ) : (
              <p>Aucune commande pour le moment.</p>
            )}
          </DialogDescription>
        </DialogHeader>
        <OrderCardForm
          onSubmit={handleSubmit}
          logementNom={logementNom}
          products={products}
        />
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
