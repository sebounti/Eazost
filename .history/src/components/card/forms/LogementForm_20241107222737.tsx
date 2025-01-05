// components/forms/LogementForm.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Accommodation } from "@/types"; // Assurez-vous de bien définir vos types dans un fichier séparé si nécessaire

type LogementFormProps = {
  logement?: Accommodation;
  onSubmit: (formData: FormData) => void;
};

const LogementForm = ({ logement, onSubmit }: LogementFormProps) => (
  <form onSubmit={(e) => { e.preventDefault(); onSubmit(new FormData(e.currentTarget)); }} className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="type">Type de logement</Label>
      <Select name="type" defaultValue={logement?.type}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionnez un type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="appartement">Appartement</SelectItem>
          <SelectItem value="maison">Maison</SelectItem>
          <SelectItem value="studio">Studio</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <Label htmlFor="nom">Nom</Label>
      <Input id="nom" name="nom" defaultValue={logement?.nom} required />
    </div>
    <div className="space-y-2">
      <Label htmlFor="adresse1">Adresse 1</Label>
      <Input id="adresse1" name="adresse1" defaultValue={logement?.adresse1} required />
    </div>
    <div className="space-y-2">
      <Label htmlFor="adresse2">Adresse 2</Label>
      <Input id="adresse2" name="adresse2" defaultValue={logement?.adresse2} />
    </div>
    <div className="space-y-2">
      <Label htmlFor="ville">Ville</Label>
      <Input id="ville" name="ville" defaultValue={logement?.ville} required />
    </div>
    <div className="space-y-2">
      <Label htmlFor="codePostal">Code Postal</Label>
      <Input id="codePostal" name="codePostal" defaultValue={logement?.codePostal} required />
    </div>
    <div className="space-y-2">
      <Label htmlFor="pays">Pays</Label>
      <Input id="pays" name="pays" defaultValue={logement?.pays} required />
    </div>
    <div className="space-y-2">
      <Label htmlFor="description">Description</Label>
      <Textarea id="description" name="description" defaultValue={logement?.description} required />
    </div>
    <div className="space-y-2">
      <Label htmlFor="photo">Photo URL</Label>
      <Input id="photo" name="photo" type="url" defaultValue={logement?.photo} required />
    </div>
    <Button type="submit">{logement ? 'Modifier' : 'Ajouter'}</Button>
  </form>
);

export default LogementForm;
