"use client";

import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import AccessCodeDialog from "./dialogs/AccessCodeDialog";

type AccessCodeCardProps = {
  onGenerateCode: (data: any) => void;
};

const AccessCodeCard = ({ onGenerateCode }: AccessCodeCardProps) => {
  const [accessCode, setAccessCode] = useState<string | null>(null);

  const handleGenerateCode = (data: any) => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    setAccessCode(code);
    onGenerateCode({ ...data, code });
    toast({
      title: "Succès",
      description: `Le code ${code} a été généré.`,
    });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-bold mb-4">Générateur de Code d'Accès</h2>

      <AccessCodeDialog onSubmit={handleGenerateCode}>
        <button className="w-full bg-amber-500 text-white rounded-lg p-2">
          Ouvrir le formulaire
        </button>
      </AccessCodeDialog>

      {accessCode && (
        <div className="mt-4 p-4 bg-gray-100 rounded text-center">
          <p>Code d'accès généré :</p>
          <p className="text-lg font-bold">{accessCode}</p>
        </div>
      )}
    </div>
  );
};

export default AccessCodeCard;
