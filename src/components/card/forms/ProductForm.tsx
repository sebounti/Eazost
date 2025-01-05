// components/forms/ProductForm.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Product } from "@/types";

type ProductFormProps = {
  product?: Product;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
};

const ProductForm = ({ product, onSubmit, onCancel }: ProductFormProps) => (
  <form onSubmit={(e) => { e.preventDefault(); onSubmit(new FormData(e.currentTarget)); }} className="space-y-2">
    <Input name="name" defaultValue={product?.name} placeholder="Nom du produit" required />
    <Textarea name="description" defaultValue={product?.description} placeholder="Description du produit" required />
    <Input name="price" type="number" defaultValue={product?.price} placeholder="Prix" required step="0.01" min="0" />
    <div className="space-y-2">
      <Label htmlFor="imageUrl">URL de l&apos;image (optionnel)</Label>
      <Input id="imageUrl" name="imageUrl" type="url" defaultValue={product?.imageUrl} placeholder="https://example.com/image.jpg" />
    </div>
    <div className="flex justify-end space-x-2">
      <Button type="submit">Enregistrer</Button>
      <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
    </div>
  </form>
);

export default ProductForm;
