'use client';

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useAuthStore } from "@/stores/authStore";
import { MdClose, MdAdd, MdEdit, MdCreditCard } from "react-icons/md";
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import InfoCard from "@/components/card/InfoCard";
import { useStayInfoStore } from "@/stores/useStayInfoStore";
import { useAccommodationStore } from "@/stores/accommodationStore";
import { type Accommodation, type stayInfo } from '@/types';
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useSession } from "next-auth/react";
import InfoCardForm from "@/components/card/forms/InfoCardForm";
import OrderDialog from "@/components/card/dialogs/OrderDialog";
import OrderCardForm from "@/components/card/forms/OrderCardForm";
import { CARDINFORMATION_TYPES, InfoCardFormData } from "@/components/card/forms/InfoCardForm";

const apiService = {
  fetchStayInfo: (userId: string) => fetch(`/api/stayInfo/${userId}`),
  updateStayInfo: (id: number, data: FormData) => fetch(`/api/stayInfo/${id}`, {
    method: 'PUT',
    body: data
  }),
  // ... autres méthodes API
};

// Page pour la gestion des cartes d'information
const CardInfoPage = memo(function CardInfoPage(): JSX.Element {
	const { user } = useAuthStore();
	const [selectedCard, setSelectedCard] = useState<number | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const {
	  stayInfo,
	  isLoading,
	  error,
	  fetchStayInfos
	} = useStayInfoStore();
	const { accommodationInfo: accommodation, fetchAccommodationInfo } = useAccommodationStore();
	const { data: session } = useSession();

	// Ajout des états pour le filtrage
	const [filterType, setFilterType] = useState<string>('all');
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [selectedAccommodation, setSelectedAccommodation] = useState('all');


	// Récupération des cartes d'information
	useEffect(() => {
	  if (user?.user_id) {
		// Chargez les données en parallèle
		Promise.all([
		  fetchStayInfos(String(user.user_id)),
		  fetchAccommodationInfo(user.user_id)
		]);
	  }
	}, [user]);

	// Gestion des erreurs
	useEffect(() => {
	  if (error) {
		toast.error(error);
	  }
	}, [error]);


	// Ajout du filtrage des cartes d'information
	const filteredstayinfo = useMemo(() => {
	  if (!stayInfo || !accommodation) return [];

	  return (Array.isArray(stayInfo) ? stayInfo : []).filter((cardInfo) => {
		// Trouve le logement correspondant
		const relatedAccommodation = accommodation.find(
		  acc => acc.accommodation_id === cardInfo.accommodation_id
		);

		const matchesType = filterType === 'all' || cardInfo.category === filterType;
		const matchesSearch = cardInfo.title.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesAccommodation = selectedAccommodation === 'all' ||
									relatedAccommodation?.accommodation_id === parseInt(selectedAccommodation);

		return matchesType && matchesSearch && matchesAccommodation;
	  });
	}, [stayInfo, accommodation, filterType, searchTerm, selectedAccommodation]);




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


	const onUpdateImage = async (stayInfoId: number, file: File) => {
	  try {
		// Logique de mise à jour de l'image
		const formData = new FormData();
		formData.append('image', file);
		await fetch(`/api/stayInfo/${stayInfoId}/image`, {
		  method: 'PUT',
		  body: formData
		});
		toast.success("Image mise à jour avec succès");
	  } catch (error) {
		toast.error("Erreur lors de la mise à jour de l'image");
	  }
	};

	// Modification d'une carte d'information
	const onEditInfoCard = async (stayInfoId: number, data: {
	  title: string;
	  category: typeof CARDINFORMATION_TYPES[number];
	  description: string;
	  accommodation_id: number;
	  photo_url: string | null | undefined;
	}) => {
	  try {
		await fetch(`/api/stayInfo/${stayInfoId}`, {
		  method: 'PUT',
		  headers: { 'Content-Type': 'application/json' },
		  body: JSON.stringify(data)
		});

		// Rafraîchir les données après la modification
		if (user?.user_id) {
		  await fetchStayInfos(String(user.user_id));
		}

		toast.success("Carte d'information mise à jour avec succès");
	  } catch (error) {
		toast.error("Erreur lors de la mise à jour de la carte");
	  }
	};

	// Ajout d'une carte d'information
	const handleAddInfoCard = async (logementId: number, data: InfoCardFormData) => {
	  try {
		console.log("Tentative création carte:", { logementId, data });

		const cardData = {
		  ...data,
		  accommodation_id: logementId,
		  created_at: new Date(),
		  updated_at: new Date()
		};

		// Utiliser le chemin complet
		const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/stayInfo`;
		console.log("Envoi requête à:", apiUrl);
		console.log("Données envoyées:", cardData);

		const response = await fetch(apiUrl, {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		  },
		  body: JSON.stringify(cardData)
		}).catch(error => {
		  console.error("Erreur fetch:", error);
		  throw error;
		});

		console.log("Status réponse:", response.status);
		const responseText = await response.text();
		console.log("Réponse brute:", responseText);

		if (!response.ok) {
		  throw new Error(`Erreur HTTP: ${response.status} - ${responseText}`);
		}

		const result = JSON.parse(responseText);
		console.log("Résultat création:", result);

		await refreshData();
		toast.success('Carte créée avec succès');
	  } catch (error) {
		console.error('Erreur création détaillée:', error);
		toast.error('Erreur lors de la création');
		throw error;
	  }
	};

	// Suppression d'une carte d'information
	const onDeleteInfoCard = async (cardId: number) => {
	  try {
		await fetch(`/api/stayInfo/${cardId}`, {
		  method: 'DELETE'
		});
		await fetchStayInfos(String(user!.user_id));
		toast.success("Carte supprimée avec succès");
	  } catch (error) {
		toast.error("Erreur lors de la suppression");
	  }
	};

	// Rafraîchissement des données
	const refreshData = useCallback(async () => {
	  if (user?.user_id) {
		try {
		  await fetchStayInfos(String(user.user_id));
		} catch (error) {
		  console.error('Erreur rafraîchissement:', error);
		}
	  }
	}, [user?.user_id, fetchStayInfos]);


	if (isLoading) {
	  return (
		<div className="flex justify-center items-center min-h-screen">
		  <LoadingSpinner />
		</div>
	  );
	}

	if (error) {
	  return <div>Erreur: {error}</div>;
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
            <BreadcrumbLink className="text-xl text-amber-500" href="/dashboard/Carte-info">Carte d'Information</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>

		  <ErrorBoundary>
			<div className="container p-4 mx-auto">
			  <h1 className="text-5xl font-extrabold tracking-tight p-2 ">
				Gestion des cartes d'information
			  </h1>
			  <p className="mb-8 text-lg text-muted-foreground p-2 ">
				Gérez ici toutes vos Cartes d'information de vos logements
			  </p>

			  {/* Ajout des contrôles de filtrage */}
			  <div className="mb-6 flex flex-col sm:flex-row gap-4">
				<input
				  type="text"
				  placeholder="Rechercher ici par nom"
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
				  <option value="Electroménager">Electroménager</option>
				  <option value="Accès et Sécurité">Accès et Sécurité</option>
				  <option value="Guide d\'utilisation">Guide d'utilisation</option>
				  <option value="Arrivée et Départ">Arrivée et Départ</option>
				  <option value="Règles de la maison">Règles de la maison</option>
				  <option value="Découverte locale">Découverte locale</option>
				  <option value="Environnement">Environnement</option>
				  <option value="Autre">Autre</option>
				</select>
				<select
				  className="px-4 py-2 border rounded-xl"
				  value={selectedAccommodation}
				  onChange={(e) => setSelectedAccommodation(e.target.value)}
				>
					<option value="all">Tous les logements</option>
					{accommodation?.map((logement: Accommodation) => (
						<option key={logement.accommodation_id} value={logement.accommodation_id}>
							{logement.name}
						</option>
					))}
				</select>
			  </div>


			  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

				{/* Liste des cartes d'information filtrées */}
				{filteredstayinfo.map((cardInfo) => (
				  <InfoCard
					key={cardInfo.stay_info_id}
					cardInfo={cardInfo}
					onUpdateImage={(file: File) => onUpdateImage(cardInfo.stay_info_id, file)}
					onEditInfoCard={(logementId, cardId, formData) => onEditInfoCard(cardId, formData)}
					onAddInfoCard={(_, formData) => handleAddInfoCard(cardInfo.accommodation_id, formData)}
					onDeleteInfoCard={onDeleteInfoCard}
				  />
				))}
			  </div>


			  {/* Modal avec LogementForm */}
			  {isDialogOpen && (
				<div
				  className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 p-4 z-50"
				  onClick={(e) => {
					if (e.target === e.currentTarget) {
					  handleCloseDialog();
					}
				  }}
				>
				  <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-2xl">
					<div className="flex justify-between items-center p-4 border-b">
					  <h2 className="text-xl font-semibold">
						{selectedCard ? 'Modifier la carte d\'information' : 'Ajouter une carte d\'information'}
					  </h2>
					  <button
						onClick={handleCloseDialog}
						className="text-gray-400 hover:text-gray-600"
					  >
						<MdClose size={24} />
					  </button>
					</div>

					<div className="p-4 max-h-[80vh] overflow-y-auto">
					  <InfoCardForm
						logementId={accommodation?.[0]?.accommodation_id ?? 0}
						onSubmit={(formData) =>
							selectedCard
								? onEditInfoCard(selectedCard, formData)
								: handleAddInfoCard(accommodation?.[0]?.accommodation_id ?? 0, formData)
						}
						onCancel={handleCloseDialog}
					  />
					</div>
				  </div>
				</div>
			  )}
			</div>
		  </ErrorBoundary>
		</>
	);
});

export default CardInfoPage;
