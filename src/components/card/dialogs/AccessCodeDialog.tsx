// components/dialogs/AccessCodeDialog.tsx

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAccessCodeStore } from '@/stores/accessCodeStore';
import { useEffect } from 'react';
import { AccessCode } from '@/types';

type AccessCodeDialogProps = {
  accommodationId: number;
  logementNom: string;
  onGenerateCode: (startDateTime: Date, endDateTime: Date, email: string) => void;
  onDeleteCode: (code: string) => void;
  children: React.ReactNode;
};

const AccessCodeDialog = ({ accommodationId, logementNom, onGenerateCode, onDeleteCode, children }: AccessCodeDialogProps) => {
  const { accessCodes, isLoading, error, fetchAccessCodes } = useAccessCodeStore();

  useEffect(() => {
    fetchAccessCodes(accommodationId);
  }, [accommodationId]);

  const generateSignature = async (folder: string, timestamp: number) => {
    const response = await fetch('/api/cloudinary/signature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder, timestamp }),
    });
    const data = await response.json();
    return data.signature;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-slate-50 rounded-lg">
        <DialogHeader>
          <DialogTitle>Codes d'accès</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {isLoading && <p>Chargement des codes d'accès...</p>}
          {error && <p>Erreur: {error}</p>}
          {accessCodes.map((code, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <p>Code: {code.code}</p>
              <p>Début: {new Date(code.startDateTime).toLocaleString()}</p>
              <p>Fin: {new Date(code.endDateTime).toLocaleString()}</p>
              <p>État: {code.isActive ? "Actif" : "Inactif"}</p>
              <Button variant="destructive" size="sm" onClick={() => onDeleteCode(code.code)}>Supprimer</Button>
            </div>
          ))}
          {/* Ajouter le formulaire pour générer un code d'accès si nécessaire */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccessCodeDialog;
