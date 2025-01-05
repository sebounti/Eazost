'use client';

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useAuthStore } from "@/stores/authStore";
import LogementForm from "@/components/card/forms/LogementForm";
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
	  fetchstayInfo
	} = useStayInfoStore();
	const { accommodationInfo: accommodation, fetchAccommodationInfo } = useAccommodationStore();

	// Ajout des états pour le filtrage
	const [filterType, setFilterType] = useState<string>('all');
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [selectedAccommodation, setSelectedAccommodation] = useState('all');


	// Récupération des cartes d'information
	useEffect(() => {
	  if (user?.user_id) {
		// Chargez les données en parallèle
		Promise.all([
		  fetchstayInfo(String(user.user_id)),
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

	const onEditInfoCard = async (stayInfoId: number, formData: FormData) => {
	  try {
		await fetch(`/api/stayInfo/${stayInfoId}`, {
		  method: 'PUT',
		  body: formData
		});
		toast.success("Carte d'information mise à jour avec succès");
	  } catch (error) {
		toast.error("Erreur lors de la mise à jour de la carte");
	  }
	};

	const onAddInfoCard = async (formData: FormData) => {
	  try {
		await fetch('/api/stayInfo', {
		  method: 'POST',
		  body: formData
		});
		toast.success("Carte d'information ajoutée avec succès");
		handleCloseDialog();
	  } catch (error) {
		toast.error("Erreur lors de l'ajout de la carte");
	  }
	};

	const onDeleteInfoCard = async (cardId: number) => {
	  try {
		await fetch(`/api/stayInfo/${cardId}`, {
		  method: 'DELETE'
		});
		await fetchstayInfo(String(user!.user_id));
		toast.success("Carte supprimée avec succès");
	  } catch (error) {
		toast.error("Erreur lors de la suppression");
	  }
	};


	if (!user) {
	  return (
		<div className="flex justify-center items-center min-h-screen">
		  <Alert variant="destructive" className="max-w-md">
			<AlertDescription>
			  Vous avez été déconnecté. Veuillez vous reconnecter pour accéder à cette page.
			</AlertDescription>
		  </Alert>
		</div>
	  );
	}

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
            <BreadcrumbLink className="text-xl" href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
		  <BreadcrumbItem>
            <BreadcrumbLink className="text-xl" href="/dashboard/Carte-info">Carte d'Information</BreadcrumbLink>
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
				Gérez ici vos Carte info logement
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
					onEditInfoCard={(_, cardId, formData) => onEditInfoCard(cardId, formData)}
					onAddInfoCard={(_, formData) => onAddInfoCard(formData)}
					onDeleteInfoCard={async (_, cardId: number) => {
					  try {
						// Logique d'ajout de carte
						console.log("Ajouter carte", cardId);
						return Promise.resolve();
					  } catch (error) {
						return Promise.reject(error);
					  }
					}}
				  />
				))}
			  </div>

			  {/* Modal avec LogementForm */}
			  {isDialogOpen && (
				<div
				  className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 p-4 z-50"
				  onClick={(e) => {
					// Fermer le modal uniquement si on clique sur l'arrière-plan
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
					  <LogementForm
						onSubmit={(formData) =>
						  selectedCard
							? onEditInfoCard(selectedCard, formData)
							: onAddInfoCard(formData)
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
