// components/forms/OrderForm.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {   export type Orders = {
	, Product } from "@/types";

type OrderFormProps = {
  order?: Order;
  products: Product[];
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
};

const OrderForm = ({ order, products, onSubmit, onCancel }: OrderFormProps) => (
  <form onSubmit={(e) => { e.preventDefault(); onSubmit(new FormData(e.currentTarget)); }} className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="customerName">Nom du client</Label>
      <Input id="customerName" name="customerName" defaultValue={order?.customerName} required />
    </div>
    <div className="space-y-2">
      <Label htmlFor="customerEmail">Email du client</Label>
      <Input id="customerEmail" name="customerEmail" type="email" defaultValue={order?.customerEmail} required />
    </div>
    <div className="space-y-2">
      <Label>Produits</Label>
      {products.map((product) => (
        <div key={product.id} className="flex items-center space-x-2">
          <Input
            id={`product-${product.id}`}
            name={`product-${product.id}`}
            type="number"
            min="0"
            defaultValue={order?.products.find(p => p.productId === product.id)?.quantity || 0}
          />
          <Label htmlFor={`product-${product.id}`}>{product.name}</Label>
        </div>
      ))}
    </div>
    <div className="space-y-2">
      <Label htmlFor="status">Statut</Label>
      <Select name="status" defaultValue={order?.status || 'pending'}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionnez un statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">En attente</SelectItem>
          <SelectItem value="processing">En cours</SelectItem>
          <SelectItem value="completed">Terminée</SelectItem>
          <SelectItem value="cancelled">Annulée</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="flex justify-end space-x-2">
      <Button type="submit">Enregistrer</Button>
      <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
    </div>
  </form>
);

export default OrderForm;
