//--- Composant AccessCodeDialog ---
//--- Composant pour la gestion des codes d'accès ---//

"use client";

// UI Components
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// Custom Components
import AccessCodeForm from "@/components/card/forms/AcessCodeForm";
// Types
import { useState } from "react";


type AccessCodeDialogProps = {
  onSubmit: (data: any) => void;
  children: React.ReactNode;
};

const AccessCodeDialog = ({ onSubmit, children }: AccessCodeDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (data: any) => {
    await onSubmit(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md mx-auto bg-white">
        <DialogHeader>
          <DialogTitle>Générer un Code d'Accès</DialogTitle>
          <DialogDescription>
            Remplissez le formulaire pour générer un nouveau code d'accès
          </DialogDescription>
        </DialogHeader>
        <AccessCodeForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
};

export default AccessCodeDialog;
