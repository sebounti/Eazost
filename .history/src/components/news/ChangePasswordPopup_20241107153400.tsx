"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertCircle, Eye, EyeOff } from "lucide-react"; // Icônes pour basculer la visibilité

export default function ChangePasswordPopup({ requireOldPassword = true }: { requireOldPassword?: boolean }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // États pour la visibilité du mot de passe
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (requireOldPassword && !oldPassword) {
      setError("L'ancien mot de passe est requis.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/connexion/auth', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (response.ok) {
        alert('Mot de passe modifié avec succès.');
        setOpen(false);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de la modification du mot de passe.');
      }
    } catch (err) {
      console.error('Erreur de changement de mot de passe:', err);
      setError("Une erreur s'est produite.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Changer le mot de passe</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Changer le mot de passe</DialogTitle>
          <DialogDescription>
            Entrez votre ancien mot de passe et votre nouveau mot de passe ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 bg-white">
            {requireOldPassword && (
              <div className="grid grid-cols-4 items-center gap-4 relative">
                <Label htmlFor="old-password" className="text-right">
                  Ancien mot de passe
                </Label>
                <Input
                  id="old-password"
                  type={showOldPassword ? "text" : "password"}
                  className="col-span-3 bg-gray-200"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
                <span
                  className="absolute right-4 cursor-pointer"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                </span>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4 bg-white relative">
              <Label htmlFor="new-password" className="text-right">
                Nouveau mot de passe
              </Label>
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                className="col-span-3 bg-gray-200"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <span
                className="absolute right-4 cursor-pointer"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4 relative">
              <Label htmlFor="confirm-password" className="text-right">
                Confirmer le mot de passe
              </Label>
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                className="col-span-3 bg-gray-200"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                className="absolute right-4 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
              </span>
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-500 mb-4">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" className="bg-amber-400 rounded-badge" disabled={isLoading}>
              {isLoading ? "Chargement..." : "Enregistrer les modifications"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
