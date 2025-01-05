"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useUserinfoStore } from "@/stores/userinfoStore";
import { useAuthStore } from "@/stores/authStore";

export default function UserProfile() {
  const profileInputRef = useRef<HTMLInputElement>(null);

  // Accès au store Zustand
  const { user } = useAuthStore();
  console.log("État complet du store:", useAuthStore.getState());
  console.log("Données utilisateur:", user);
  const { userInfo, fetchBasicInfo, setUserInfo } = useUserinfoStore();


  const [loading, setLoading] = useState(true);
  const userId = userInfo?.users_id;

  // Initialisation du composant
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        setLoading(true);
        // Utiliser l'ID de l'utilisateur depuis authStore plutôt que userinfoStore
        const currentUserId = user?.user_id;

        if (currentUserId) {
          await fetchBasicInfo(currentUserId);
          console.log("✅ Infos utilisateur chargées");
        } else {
          console.log("❌ Pas d'ID utilisateur disponible");
        }
      } catch (error) {
        console.error("❌ Erreur:", error);
        toast.error("Erreur lors de la récupération des données.");
      } finally {
        setLoading(false);
      }
    };

    loadUserInfo();
  }, [user?.user_id, fetchBasicInfo]); // Dépendre de user?.user_id au lieu de userId

  // Gestion de l’upload de l'image
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error("Aucun fichier sélectionné.");
      return;
    }

    try {
      toast.loading("Téléchargement en cours...");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "upload_preset");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        { method: "POST", body: formData }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de l'upload de l'image.");
      }

      const data = await response.json();
      await fetch(`/api/users/UsersInfo/${userId}/photo`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo_url: data.secure_url }),
      });

      if (userInfo) {
        setUserInfo({
          ...userInfo,
          photo_url: data.secure_url
        });
      } else {
        toast.error("Impossible de mettre à jour le profil");
      }
      toast.success("Photo de profil mise à jour !");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la photo.");
    }
  };

  // Vérification de la présence de account_type
  const accountType = user?.account_type || 'Non défini';
  console.log("Type de compte:", accountType);

  if (loading) {
    return <div className="text-center py-4">Chargement...</div>;
  }

  return (
    <div className="w-full max-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-amber-600 to-silver-300 rounded-xl">
      <div className="relative flex justify-center pt-4">
        <div className="inline-block p-1 rounded-full">
          <Avatar className="rounded-full h-55 w-55">
            <AvatarImage
              src={userInfo?.photo_url || "/utilisateur.png"}
              alt="Photo de profil"
              className="object-cover w-40 h-40 rounded-full border-gray-800 border-2"
            />
            <AvatarFallback className="rounded-full">
              {userInfo?.first_name?.charAt(0) || "?"}
			  {userInfo?.last_name?.charAt(0) || "?"}
			  {accountType && (
            <span className="block text-2xl text-gray-600">
              {accountType === "owner" ? "Propriétaire" : "Utilisateur"}
            </span>
          )}
            </AvatarFallback>
          </Avatar>
        </div>
        <Button
          size="icon"
          variant="secondary"
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 rounded-full"
          onClick={() => profileInputRef.current?.click()}
          aria-label="Changer la photo de profil"
        />
        <Input
          type="file"
          ref={profileInputRef}
          className="hidden"
          onChange={handleImageChange}
          accept="image/*"
        />
      </div>
      <div className="max-w-4xl px-4 py-6 mx-auto">
        <h1 className="my-2 text-4xl font-bold text-center">
          {userInfo?.first_name} {userInfo?.last_name}
          {accountType && (
            <span className="block text-2xl text-gray-600">
              {accountType === "owner" ? "Propriétaire" : "Utilisateur"}
            </span>
          )}
        </h1>
      </div>
    </div>
  );
}
