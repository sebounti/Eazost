// components/dialogs/OrderDialog.tsx

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import OrderForm from "../forms/OrderForm";
import { Orders, Product } from "@/types";

type OrderDialogProps = {
  order?: Orders;
  products: Product[];
  logementNom: string;
  onSubmit: (formData: FormData) => void;
  children: React.ReactNode;
};

const OrderDialog = ({ order, products, logementNom, onSubmit, children }: OrderDialogProps) => (
  <Dialog>
    <DialogTrigger asChild>
      {children}
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px] bg-white rounded-xl shadow-xl border-2 border-gray-100">
      <DialogHeader className="space-y-3 pb-4 border-b">
        <DialogTitle className="text-xl font-semibold text-gray-900">
          {order ? "Modifier la commande" : `Ajouter une commande - ${logementNom}`}
        </DialogTitle>
      </DialogHeader>
      <div className="p-4 bg-slate-50 rounded-lg mt-4">
        <OrderForm order={order} products={products} onSubmit={onSubmit} onCancel={() => {}} />
      </div>
    </DialogContent>
  </Dialog>
);

export default OrderDialog;
