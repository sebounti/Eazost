import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/types/index";
import { ChangeEvent } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";
import CloudinaryFileUploader from "@/components/upload/CloudinaryFileUploder";

type ProductFormProps = {
  product: Product;
  onChange: (updatedProduct: Product) => void;
  onSubmit: (formData: FormData) => Promise<void>;
  onDelete?: (productId: number) => Promise<void>;
};

const ProductForm = ({ product, onChange, onSubmit, onDelete }: ProductFormProps) => {
  const [imageUrl, setImageUrl] = useState(product?.image_url || '');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleChange = (field: keyof Product, value: any) => {
    onChange({ ...product, [field]: value });
  };

  // Gestion de l'upload d'image
  const handleImageUpload = (url: string) => {
    setImageUrl(url);
    // Mettre à jour le produit avec la nouvelle URL d'image
    onChange({ ...product, image_url: url });
  };

  // Fonction pour supprimer le produit
  const handleDelete = async () => {
    if (!product || !onDelete) return;
    try {
      setIsDeleting(true);
      await onDelete(product.product_id);
      toast.success("Le produit a été supprimé avec succès");
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error("Impossible de supprimer le produit");
    } finally {
      setIsDeleting(false);
    }
  };

  // Déplacez la logique de soumission dans une fonction séparée
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleFormSubmit}  // Utilisez la nouvelle fonction
      className="space-y-4"
    >
      <div className="grid gap-2">
        <label htmlFor="name">Nom du produit</label>
        <Input
          id="name"
          value={product.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleChange("name", e.target.value)
          }
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <label htmlFor="price">Prix (€)</label>
          <Input
            id="price"
            type="number"
            value={product.price}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange("price", parseFloat(e.target.value) || 0)
            }
            required
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="stock">Stock</label>
          <Input
            id="stock"
            type="number"
            value={product.stock}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange("stock", parseInt(e.target.value) || 0)
            }
            required
          />
        </div>
      </div>
      <div className="grid gap-2">
        <label htmlFor="description">Description</label>
        <Textarea
          id="description"
          value={product.description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            handleChange("description", e.target.value)
          }
          required
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="image">Photo du produit</label>
        <div className="flex items-center gap-4">
          <div className="space-y-4 bg-slate-50 rounded-xl p-4 w-full">
            {(imageUrl || product.image_url) && (
              <div className="relative w-48 h-48 mx-auto">
                <Image
                  src={imageUrl}
                  alt="product"
                  fill
                  className="rounded-xl object-cover"
                />
              </div>
            )}
            <div className="space-y-2">
              <CloudinaryFileUploader
                uploadPreset="shop_product_preset"
                onUploadSuccess={handleImageUpload}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={handleDelete}>
          Annuler
        </Button>
        <Button type="submit" className="bg-amber-400 text-gray-900 hover:bg-amber-500">
          Enregistrer
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
