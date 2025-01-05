// components/dialogs/LogementDialog.tsx

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import LogementForm from "../forms/LogementForm";
import { acc } from "@/types";

type LogementDialogProps = {
  logement?: Logement;
  onSubmit: (formData: FormData) => void;
};

const LogementDialog = ({ logement, onSubmit }: LogementDialogProps) => (
  <Dialog>
    <DialogTrigger asChild>
      <button>{logement ? "Modifier le logement" : "Ajouter un logement"}</button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{logement ? "Modifier le logement" : "Ajouter un nouveau logement"}</DialogTitle>
      </DialogHeader>
      <LogementForm logement={logement} onSubmit={onSubmit} />
    </DialogContent>
  </Dialog>
);

export default LogementDialog;
