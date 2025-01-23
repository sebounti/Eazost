//--- Composant OrderCardForm ---
//--- Composant pour la gestion des commandes ---//

// React imports
import { useState } from "react";
import Link from "next/link";

// UI Components
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Icons
import { MdShoppingBag } from "react-icons/md";

// Types & Validation
import { Product } from "@/types";
import { z } from "zod";



// Schéma de validation des données du formulaire
export const orderSchema = z.object({
	product_id: z.number(),
	quantity: z.number(),
	customer_name: z.string().min(1, "Le nom du client est requis"),
	customer_email: z.string().email("L'adresse e-mail est invalide"),
	accommodation_id: z.number()
});

interface OrderCardFormProps {
  onSubmit: (data: any) => Promise<void>;
  logementNom: string;
  products: Product[];
}

const OrderCardForm = ({ onSubmit, logementNom, products = [] }: OrderCardFormProps) => {
const [selectedOrder, setSelectedOrder] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const orderData = {
      productId: selectedOrder,
      quantity,
      customerName,
      customerEmail,
      logementNom
    };

    await onSubmit(orderData);

    // Reset form
    setSelectedOrder("");
    setQuantity(1);
    setCustomerName("");
    setCustomerEmail("");
  };

  const selectedProduct = products.find(product =>
    product.product_id === parseInt(selectedOrder)
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="product">Commande</Label>
        <select
          id="logement"
          value={selectedOrder}
          onChange={(e) => setSelectedOrder(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Sélectionnez une commande</option>
          {products?.map((product) => (
            <option key={product.product_id} value={product.product_id}>
              {product.name} - {product.price}€
            </option>
          ))}
        </select>
      </div>

      {selectedProduct && (
        <div className="border p-4 rounded">
          <h3>Détails de la commande</h3>
          <p><strong>Nom du produit:</strong> {selectedProduct.name}</p>
          <p><strong>Prix:</strong> {selectedProduct.price}€</p>
          <p><strong>Description:</strong> {selectedProduct.description}</p>
        </div>
      )}

      <Button type="submit" className="w-full bg-amber-400 border border-slate-300 rounded-xl px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium text-gray-700 hover:bg-slate-50 flex items-center justify-center gap-2">
		<MdShoppingBag className="text-xl" />
		<Link href={`/logements/${logementNom}/orders`}>
			Voir toutes les commandes
		</Link>
      </Button>
    </form>
  );
};

export default OrderCardForm;
