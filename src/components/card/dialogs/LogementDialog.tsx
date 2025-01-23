//--- Composant LogementDialog ---
//--- Composant pour la gestion des logements ---//

"use client";
// React imports
import { useState } from 'react';
// UI Components
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// Custom Components
import LogementForm from "../forms/LogementForm";
// Types
import { Accommodation } from "@/types";


type LogementDialogProps = {
  logement?: Accommodation;
  onSubmit: (formData: FormData) => Promise<void>;
  onDelete?: () => void | Promise<void>;
  children: React.ReactNode;
};

export default function LogementDialog({ logement, onSubmit, onDelete, children }: LogementDialogProps) {
  const [open, setOpen] = useState(false);

  const handleFormSubmit = async (formData: FormData) => {
    await onSubmit(formData);
    setOpen(false);  // Ferme le dialog après soumission
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="p-0 bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-2xl">
        <DialogHeader className="p-4 border-b bg-amber-500">
          <DialogTitle className="text-2xl font-bold  ">
            {logement ? 'Modifier le logement' : 'Ajouter un logement'}
          </DialogTitle>
          <DialogDescription>
            {logement ? 'Modifiez les informations de votre logement' : 'Ajoutez un nouveau logement à votre liste'}
          </DialogDescription>
        </DialogHeader>
        <div id="logement-dialog-description" className="sr-only">
          Formulaire pour {logement ? "modifier" : "ajouter"} un logement
        </div>
        <div className="p-4 max-h-[80vh] overflow-y-auto">
          <LogementForm
            logement={logement}
            onSubmit={handleFormSubmit}
            onDelete={onDelete}
            onCancel={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
