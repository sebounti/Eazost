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
          <SelectItem value="Appartement">Appartement</SelectItem>
          <SelectItem value="Maison">Maison</SelectItem>
          <SelectItem value="Studio">Studio</SelectItem>
		  <SelectItem value="loft">Loft</SelectItem>
		  <SelectItem value="Villa">Duplex</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <Label htmlFor="nom">Nom</Label>
      <Input id="nom" name="nom" defaultValue={logement?.name} required />
    </div>
    <div className="space-y-2">
      <Label htmlFor="adresse1">Adresse 1</Label>
      <Input id="adresse1" name="adresse1" defaultValue={logement?.address_line1} required />
    </div>
    <div className="space-y-2">
      <Label htmlFor="adresse2">Adresse 2</Label>
      <Input id="adresse2" name="adresse2" defaultValue={logement?.address_line2} />
    </div>
    <div className="space-y-2">
      <Label htmlFor="ville">Ville</Label>
      <Input id="ville" name="ville" defaultValue={logement?.city} required />
    </div>
    <div className="space-y-2">
      <Label htmlFor="codePostal">Code Postal</Label>
      <Input id="codePostal" name="codePostal" defaultValue={logement?.zipcode} required />
    </div>
    <div className="space-y-2">
      <Label htmlFor="pays">Pays</Label>
      <Input id="pays" name="pays" defaultValue={logement?.country} required />
    </div>
    <div className="space-y-2 rounded-xl">
      <Label htmlFor="description">Description</Label>
      <Textarea id="description" name="description" className="defaultValue={logement?.description} required />
    </div>
    <div className="space-y-2">
      <Label htmlFor="photo">Photo URL</Label>
      <Input id="photo" name="photo" type="url" defaultValue={logement?.photo_url} required />
    </div>
    <Button type="submit" className="bg-amber-500 rounded-xl shadow-xl hover:bg-amber-600">{logement ? 'Modifier' : 'Ajouter'}</Button>
  </form>
);

export default LogementForm;
