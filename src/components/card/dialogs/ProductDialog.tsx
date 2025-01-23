//--- Composant ProductDialog ---//
//--- Composant pour la gestion des produits ---//



// React imports
import { useState } from "react";
// UI Components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// Custom Components
import ProductForm from "../forms/ProductForm";
// Types
import { Product } from "@/types/index";




type ProductDialogProps = {
  initialProduct: Product;
  onSave: (product: Product) => Promise<void>;
  children: React.ReactNode;
};

const ProductDialog = ({ initialProduct, onSave, children }: ProductDialogProps) => {
  const [product, setProduct] = useState<Product>(initialProduct);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = async (formData: FormData): Promise<void> => {
    await onSave(product);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl bg-slate-50 p-4 rounded-md">
        <DialogHeader>
          <DialogTitle>Ajouter un produit</DialogTitle>
        </DialogHeader>
        <ProductForm
          product={product}
          onChange={setProduct}
          onSubmit={handleSave}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
