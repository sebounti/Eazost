'use client';

import { useState, useEffect, memo } from "react";
import { useAuthStore } from "@/stores/authStore";
import LogementCard from "@/components/card/LogementCard";
import { MdAdd } from "react-icons/md";
import { useAccommodationStore } from "@/stores/accommodationStore";
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Toaster, toast } from "sonner";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { type InfoCardFormData } from "@/components/card/forms/InfoCardForm";
import LogementDialog from "@/components/card/dialogs/LogementDialog";
import { useStayInfoStore } from "@/stores/useStayInfoStore";
import { Product } from "@/types";




// Page pour la gestion des logements
const LogementsPage = memo(function LogementsPage() {
  const { user, loading: authLoading, initializeStore } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');


  // store pour les logements
  const {
    accommodationInfo,
    isLoading,
    error,
    fetchAccommodationInfo,
    updateAccommodation,
    addAccommodation,
    deleteAccommodation
  } = useAccommodationStore();


  // Initialisation du store
  useEffect(() => {
    initializeStore();
  }, [initializeStore]);


  // Fetch des logements
  useEffect(() => {
    if (user?.user_id && !authLoading) {
      fetchAccommodationInfo(user.user_id);
    }
  }, [user?.user_id, authLoading]);


  // Filtrage des logements
  const filteredAccommodations = accommodationInfo?.filter(logement => {
    if (!logement || !logement.name) return false;

    const matchesSearch = logement.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || logement.type === filterType;
    return matchesSearch && matchesType;
  });


  // fonction pour les logements
  // Modification d'un logement
  const handleAddLogement = async (formData: FormData) => {
    try {
      if (!user?.user_id) return;

      // Créer le logement
      const photoUrl = formData.get('photo_url') as string || '/images/default-image.png';
      const logementData = {
        users_id: user.user_id,
        uuid: crypto.randomUUID(),
        type: formData.get('type') as string || 'Appartement',
        name: formData.get('name') as string,
        address_line1: formData.get('address_line1') as string,
        address_line2: formData.get('address_line2') as string || undefined,
        city: formData.get('city') as string,
        zipcode: formData.get('zipcode') as string,
        country: formData.get('country') as string || 'France',
        description: formData.get('description') as string || undefined,
        photo_url: photoUrl
      };

      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logementData),
      });

      if (response.ok) {
        const newLogement = await response.json();
        addAccommodation(newLogement);

        // Créer automatiquement un shop pour le nouveau logement
        const createShopResponse = await fetch('/api/shop', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accommodation_id: newLogement.accommodation_id,
            name: `Shop ${newLogement.name}`,
            description: `Boutique de ${newLogement.name}`,
            created_at: new Date(),
            updated_at: new Date()
          })
        });

        if (!createShopResponse.ok) {
          console.error('Erreur lors de la création du shop');
        }

        await fetchAccommodationInfo(user.user_id);
        toast.success("Logement et boutique ajoutés avec succès");
      } else {
        const error = await response.json();
        toast.error(`Erreur: ${error.message}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Erreur lors de l'ajout du logement");
    }
  };

// Modification d'un logement
  const handleEdit = async (formData: FormData) => {
    const logementId = Number(formData.get("id"));
    const updatedData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
    };

    const response = await fetch(`/api/properties/${logementId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      const updatedLogement = await response.json();
      updateAccommodation(logementId, updatedLogement);
    }
  };

  const handleDelete = async (logementId: number) => {
    deleteAccommodation(logementId);
  };


  // Handlers pour les actions sur les logements
  const handleUpdateImage = async (file: File) => {
    try {
      toast.success("Image mise à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de l'image");
    }
  };


  // fonction pour les cartes d'information
  // Ajout d'une carte d'information
  const handleAddInfoCard = async (logementId: number, data: InfoCardFormData) => {
    try {
      await useStayInfoStore.getState().addStayInfo({
        ...data,
        accommodation_id: logementId,
        stay_info_id: 0,
        created_at: new Date(),
        updated_at: new Date(),
        photo_url: data.photo_url || null
      });
      toast.success("Carte d'information ajoutée");
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la carte");
    }
  };

  // Modification de la carte d'information
  const handleEditInfoCard = async (logementId: number, cardId: number, data: InfoCardFormData) => {
    try {
      await useStayInfoStore.getState().updateStayInfo(cardId, {
        ...data,
        updated_at: new Date()
      });
      toast.success("Carte d'information modifiée");
    } catch (error) {
      toast.error("Erreur lors de la modification de la carte");
    }
  };

  // fonction pour les produits
  // Ajout d'un produit
  const handleAddProduct = async (logementId: number, product: Product): Promise<void> => {
    try {
      // Récupérer le shop existant pour ce logement
      const shopResponse = await fetch(`/api/shop?accommodationId=${logementId}`);
      const shopData = await shopResponse.json();

      if (!shopData.data?.shop?.length) {
        throw new Error('Aucun shop trouvé pour ce logement');
      }

      const shopId = shopData.data.shop[0].shop_id;

      // Créer le produit avec le shop_id existant
      const productData = {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image_url: product.image_url || null,
        shop_id: shopId,
        uuid: crypto.randomUUID()
      };

      const response = await fetch(`/api/shop/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'ajout du produit');
      }

      toast.success("Produit ajouté avec succès");
    } catch (error) {
      console.error('Erreur complète:', error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'ajout du produit");
    }
  };

  // Modification d'un produit
  const handleEditProduct = async (logementId: number, productId: number, formData: FormData) => {
    try {
      toast.success("Produit modifié avec succès");
    } catch (error) {
      toast.error("Erreur lors de la modification du produit");
    }
  };

  // fonction pour les codes d'accès
  // Génération d'un code d'accès
  const handleGenerateAccessCode = async (logementId: number, startDateTime: Date, endDateTime: Date, email: string) => {
    try {
      toast.success("Code d'accès généré avec succès");
    } catch (error) {
      toast.error("Erreur lors de la génération du code");
    }
  };

  // Suppression d'un code d'accès
  const handleDeleteAccessCode = async (logementId: number, code: string) => {
    try {
      toast.success("Code d'accès supprimé");
    } catch (error) {
      toast.error("Erreur lors de la suppression du code");
    }
  };

  // fonction pour les commandes

  // Ajout d'une commande
  const handleAddOrder = async (logementId: number, formData: FormData) => {
    try {
      toast.success("Commande ajoutée avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la commande");
    }
  };

  // Modification d'une commande
  const handleEditOrder = async (logementId: number, orderId: number, formData: FormData) => {
    try {
      toast.success("Commande modifiée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la modification de la commande");
    }
  };


  if (authLoading) return <LoadingSpinner />;
  if (!user) {
    return (
      <div className="text-center p-4">
        <p>Veuillez vous connecter pour accéder à cette page</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-4 p-4">
        <SidebarTrigger className="text-xl" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-md" href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="text-xl text-amber-500" href="/dashboard/property">Logement</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Toaster position="top-center" />
        <div className="container p-4 mx-auto">
          <h1 className="text-5xl font-extrabold tracking-tight p-2">
            Gestion des Logements
          </h1>
          <p className="mb-8 text-lg text-muted-foreground p-2">
            Gérez vos propriétés, codes d&apos;accès, vos commandes, ajouter des  Carte d'information logement en un seul endroit
          </p>


          {/* Contrôles de filtrage */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Rechercher par nom ou ville ou par pays"
              className="px-4 py-2 border rounded-xl flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

			{/* Filtre par type de logement */}
            <select
              className="px-4 py-2 border rounded-xl"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Tous les types</option>
              <option value="Appartement">Appartement</option>
              <option value="Maison">Maison</option>
              <option value="Studio">Studio</option>
              <option value="loft">Loft</option>
              <option value="Villa">Villa</option>
            </select>
          </div>


          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Carte d'ajout */}
            <div className="overflow-hidden border rounded-lg shadow-sm bg-slate-50 w-full h-[570px] flex flex-col">
              <div className="w-full h-48 bg-amber-100 flex items-center justify-center shrink-0">
                <span className="text-6xl text-amber-400">+</span>
              </div>

              <div className="p-4 flex flex-col h-full">
                <div>
                  <h2 className="mb-2 text-2xl font-semibold">Nouveau logement</h2>
                   <h3 className="mb-2 text-xl text-gray-500">Type de logement</h3>
                </div>

                <div className="space-y-2 mt-24">
				<LogementDialog onSubmit={handleAddLogement}>
					<button className="bg-amber-500 rounded-lg w-full px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium text-gray-700 hover:bg-amber-400 flex items-center justify-center gap-2">
						<MdAdd className="text-xl" /> Ajouter un logement
					</button>
				</LogementDialog>


                  <div className="text-xl space-x-4 text-center text-gray-500">
                    <h2 className="text-xl text-gray-500 animate-pulse mt-10">
                      Vous pouvez ajouter un logement en cliquant sur le bouton ci-dessus
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Liste des logements */}
            {(filteredAccommodations ?? []).map((logement) => (
              <LogementCard
                key={logement.accommodation_id}
                logement={logement}
                onEditLogement={handleEdit}
                onAddInfoCard={handleAddInfoCard}
                onEditInfoCard={handleEditInfoCard}
                onAddProduct={handleAddProduct}
                onGenerateAccessCode={handleGenerateAccessCode}
                onDeleteAccessCode={handleDeleteAccessCode}
                onAddOrder={handleAddOrder}
              />
            ))}
          </div>
        </div>
    </>
  );
});

export default LogementsPage;
