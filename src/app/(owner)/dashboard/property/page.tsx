'use client';

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useAuthStore } from "@/stores/authStore";
import LogementCard from "@/components/card/LogementCard";
import LogementForm from "@/components/card/forms/LogementForm";
import { Accommodation } from "@/types";
import { MdClose, MdAdd, MdEdit, MdCreditCard, MdShoppingCart, MdKey, MdShoppingBag } from "react-icons/md";
import { useAccommodationStore } from "@/stores/accommodationStore";
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Toaster, toast } from "sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";


// Ajout de la fonction pour upload sur Cloudinary
const uploadImageToCloudinary = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'properties');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Erreur upload Cloudinary:', error);
    throw error;
  }
};

// Page pour la gestion des logements
const LogementsPage = memo(function LogementsPage() {
  const { user, loading, initializeStore } = useAuthStore();
  console.log('🔍 User:', user);

  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    accommodationInfo,
    isLoading,
    error,
    fetchAccommodationInfo
  } = useAccommodationStore();

  console.log('📦 AccommodationInfo:', accommodationInfo);
  console.log('⏳ Loading states:', { loading, isLoading });
  console.log('❌ Error:', error);

  // Ajout des états pour le filtrage
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const session = await response.json();
        console.log('🔑 Session:', session);
      } catch (error) {
        console.error('❌ Erreur session:', error);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    if (user?.user_id) {
      console.log('🔄 Fetching accommodations for user:', user.user_id);
      fetchAccommodationInfo(user.user_id);
    }
  }, [user, fetchAccommodationInfo]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    const init = async () => {
      await initializeStore();
    };
    init();
  }, [initializeStore]);

  // Ajout du filtrage des logements
  const filteredAccommodations = useMemo(() => {
    if (!accommodationInfo) return [];

    return accommodationInfo.filter(logement => {
      const matchesType = filterType === 'all' || logement.type === filterType;
      const matchesSearch = logement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          logement.city.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesType && matchesSearch;
    });
  }, [accommodationInfo, filterType, searchTerm]);

  // Fonction modifiée pour gérer l'upload d'image
  const ajouterLogement = useCallback(async (formData: FormData) => {
    try {
      let imageUrl = null;
      const photo = formData.get('photo_url') as File;

      if (photo) {
        imageUrl = await uploadImageToCloudinary(photo);
      }

      const logementData = {
        type: formData.get('type'),
        name: formData.get('name'),
        address_line1: formData.get('address_line1'),
        address_line2: formData.get('address_line2'),
        city: formData.get('city'),
        zipcode: formData.get('zipcode'),
        country: formData.get('country'),
        description: formData.get('description'),
        photo_url: imageUrl,
        user_id: user?.user_id
      };

      const response = await fetch(`/api/properties/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logementData),
      });

      if (response.ok) {
        setIsDialogOpen(false);
        fetchAccommodationInfo(user!.user_id);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
    }
  }, [user, fetchAccommodationInfo]);


  // Fonction pour mettre à jour l'image d'un logement existant
  const updatePropertyImage = useCallback(async (propertyId: number, file: File) => {
    try {
      const imageUrl = await uploadImageToCloudinary(file);

      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageUrl }),
      });

      if (response.ok) {
        fetchAccommodationInfo(user!.user_id);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'image:', error);
    }
  }, [user, fetchAccommodationInfo]);


  // Fonction pour modifier un logement
  const editLogement = useCallback(async (logementId: number, formData: FormData) => {
    try {
      let imageUrl = null;
      const photo = formData.get('photo_url') as File;

      // Si une nouvelle photo a été uploadée
      if (photo instanceof File) {
        imageUrl = await uploadImageToCloudinary(photo);
      }

	  // Ajout des données du logement
      const data: Partial<Accommodation> = {
        type: formData.get('type') as string,
        name: formData.get('name') as string,
        address_line1: formData.get('address_line1') as string,
        address_line2: formData.get('address_line2') as string,
        city: formData.get('city') as string,
        zipcode: formData.get('zipcode') as string,
        country: formData.get('country') as string,
        description: formData.get('description') as string,
        photo_url: imageUrl || formData.get('photo_url') as string, // Utilise l'ancienne URL si pas de nouvelle photo
      };

      const response = await fetch(`/api/properties/${logementId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Recharge uniquement après confirmation de la mise à jour
        await fetchAccommodationInfo(user!.user_id);
      } else {
        throw new Error('Erreur lors de la modification');
      }
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
    }
  }, [user, fetchAccommodationInfo]);


  // Fonction pour fermer le modal proprement
  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedCard(null);
    // S'assurer que le scroll est réactivé
    document.body.style.overflow = 'unset';
  }, []);


  // Fonction pour ouvrir le modal
  const handleOpenDialog = useCallback((cardId?: number) => {
    setSelectedCard(cardId || null);
    setIsDialogOpen(true);
    // Éviter le scroll en arrière-plan
    document.body.style.overflow = 'hidden';
  }, []);

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            Vous devez être connecté pour accéder à cette page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!accommodationInfo) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert className="max-w-md">
          <AlertDescription>
            Aucun logement trouvé. Commencez par enun !
          </AlertDescription>
        </Alert>
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
            <BreadcrumbLink className="text-xl" href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
		  <BreadcrumbItem>
            <BreadcrumbLink className="text-xl" href="/dashboard/property">Logement</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
      <Toaster position="top-center" />
      <ErrorBoundary>
        <div className="container p-4 mx-auto">
          <h1 className="text-5xl font-extrabold tracking-tight p-2">
            Gestion des Logements
          </h1>
          <p className="mb-8 text-lg text-muted-foreground p-2">
            Gérez vos propriétés, codes d&apos;accès, Carte info logement et commandes en un seul endroit
          </p>

          {/* Ajout des contrôles de filtrage */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Rechercher par nom ou ville..."
              className="px-4 py-2 border rounded-xl flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
            {/* Carte pour ajouter un logement */}
            <div className="overflow-hidden border rounded-xl shadow-sm bg-slate-50 w-full h-[570px] flex flex-col">
              {/* Section image simulée avec un fond */}
              <div className="w-full h-48 bg-amber-100 flex items-center justify-center shrink-0">
                <span className="text-6xl text-amber-400">+</span>
              </div>

              <div className="p-4 flex flex-col h-full">
                <div>
                  <h2 className="mb-2 text-2xl font-semibold">Nouveau logement</h2>
				  <h3 className="mb-2 text-xl text-gray-500">Type de logement</h3>
                  <p className="mb-2 text-sm text-gray-500"> {filteredAccommodations.length} carte(s) d'information</p>
                  <p className="mb-2 text-sm text-gray-500"> {filteredAccommodations.length} produit(s) dans le shop</p>
                  <p className="mb-4 text-sm text-gray-500"> {filteredAccommodations.length} commande(s)</p>
                </div>

                <div className="space-y-2 space-x-2">
                  <button
                    onClick={() => handleOpenDialog()}
                    className="bg-amber-500 rounded-xl w-full px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium text-gray-700 hover:bg-amber-400 flex items-center justify-center gap-2"
                  >
                    <MdAdd className="text-xl" /> Ajouter un logement
                  </button>


				  <div className="text-xl space-x-4 text-center text-gray-500">
					<h2 className="text-xl text-gray-500 animate-pulse">Vous pouvez ajouter un logement en cliquant sur le bouton ci-dessus</h2>
				</div>

                </div>
              </div>
            </div>

            {/* Liste des logements filtrés */}
            {filteredAccommodations.map((logement) => (
              <LogementCard
                key={logement.accommodation_id}
                logement={logement}
                onUpdateImage={(file) => updatePropertyImage(logement.accommodation_id, file)}
                onEditLogement={(formData) => editLogement(logement.accommodation_id, formData)}
                onAddInfoCard={async (logementId: number, formData: FormData) => {
                  try {
                    // Logique d'ajout de carte
                    console.log("Ajouter carte", logementId);
                    return Promise.resolve();
                  } catch (error) {
                    return Promise.reject(error);
                  }
                }}
                onEditInfoCard={() => {
                  console.log("Modifier carte", logement.accommodation_id);
                }}
                onAddProduct={() => {
                  console.log("Ajouter produit", logement.accommodation_id);
                }}
                onEditProduct={( ) => {
                  console.log("Modifier produit", logement.accommodation_id);
                }}
                onGenerateAccessCode={() => {
                  console.log("Générer code d'accès", logement.accommodation_id);
                }}
                onDeleteAccessCode={() => {
                  console.log("Supprimer code d'accès", logement.accommodation_id);
                }}
                onAddOrder={() => {
                  console.log("Ajouter commande", logement.accommodation_id);
                }}
                onEditOrder={() => {
                  console.log("Modifier commande", logement.accommodation_id);
                }}
              />
            ))}
          </div>

          {/* Modal avec LogementForm */}
          <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
            <DialogContent className="sm:max-w-2xl bg-slate-50 rounded-xl shadow-lg overflow-hidden w-full max-w-2xl">
              <DialogTitle>
                {selectedCard ? 'Modifier le logement' : 'Ajouter un logement'}
              </DialogTitle>
              <DialogDescription>
                Remplissez les informations ci-dessous pour {selectedCard ? 'modifier' : 'ajouter'} un logement.
              </DialogDescription>
              <div className="max-h-[80vh] overflow-y-auto">
                <LogementForm
                  onSubmit={(formData) =>
                    selectedCard
                      ? editLogement(selectedCard, formData)
                      : ajouterLogement(formData)
                  }
                  onCancel={handleCloseDialog}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </ErrorBoundary>
    </>
  );
});

export default LogementsPage;
