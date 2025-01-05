// components/dialogs/ProductDialog.tsx

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ProductForm from "../forms/ProductForm";
import { Product } from "@/types";

type ProductDialogProps = {
  logementNom: string;
  onSubmit: (formData: FormData) => void;
  children: React.ReactNode;
};

const ProductDialog = ({ logementNom, onSubmit, children }: ProductDialogProps) => (
  <Dialog>
    <DialogTrigger asChild>
      {children}
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px] bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-2xl">
      <DialogHeader>
        <DialogTitle>{children ? "Modifier le produit" : `Ajouter un produit - ${logementNom}`}</DialogTitle>
      </DialogHeader>
      <ProductForm onSubmit={onSubmit} onCancel={() => {}} />
    </DialogContent>
  </Dialog>
);

export default ProductDialog;
