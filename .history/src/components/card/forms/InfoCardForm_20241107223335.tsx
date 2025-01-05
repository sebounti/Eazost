// components/forms/InfoCardForm.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { , InfoCard } from "@/types"; // Définissez InfoCard dans vos types partagés

type InfoCardFormProps = {
  card?: InfoCard;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
};

const InfoCardForm = ({ card, onSubmit, onCancel }: InfoCardFormProps) => (
  <form onSubmit={(e) => { e.preventDefault(); onSubmit(new FormData(e.currentTarget)); }} className="space-y-2">
    <Input name="title" defaultValue={card?.title} placeholder="Titre" required />
    <Textarea name="content" defaultValue={card?.content} placeholder="Contenu" required />
    <div className="space-y-2">
      <Label htmlFor="imageUrl">URL de l'image (optionnel)</Label>
      <Input id="imageUrl" name="imageUrl" type="url" defaultValue={card?.imageUrl} placeholder="https://example.com/image.jpg" />
    </div>
    <div className="flex justify-end space-x-2">
      <Button type="submit">Enregistrer</Button>
      <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
    </div>
  </form>
);

export default InfoCardForm;
