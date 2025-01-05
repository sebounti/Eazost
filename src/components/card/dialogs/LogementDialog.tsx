// components/dialogs/LogementDialog.tsx

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import LogementForm from "../forms/LogementForm";
import { Accommodation } from "@/types";
import { useState } from 'react';

type LogementDialogProps = {
  logement?: Accommodation;
  onSubmit: (formData: FormData) => Promise<void>;
  onDelete?: () => void | Promise<void>;
  children: React.ReactNode;
};

const LogementDialog = ({ logement, onSubmit, onDelete, children }: LogementDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="p-0 bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-2xl">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-2xl font-bold">
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
            onSubmit={onSubmit}
            onDelete={onDelete}
            onCancel={() => {}}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogementDialog;
