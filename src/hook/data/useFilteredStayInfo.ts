import { useMemo } from "react";
import { stayInfo, Accommodation } from "@/types";

//----- useFilteredStayInfo -----//
// Hook pour filtrer les informations de séjour en fonction du terme de recherche et du type de logement //

interface UseFilteredStayInfoParams {
  stayInfo: stayInfo[];
  accommodation: Accommodation[];
  filterType: string;
  searchTerm: string;
  selectedAccommodation: string;
}

export const useFilteredStayInfo = ({
  stayInfo,
  accommodation,
  filterType,
  searchTerm,
  selectedAccommodation,
}: UseFilteredStayInfoParams) => {
  return useMemo(() => {
	// Vérification si les données sont disponibles
    if (!stayInfo || !accommodation) return [];

	// Filtrage des informations de séjour en fonction du terme de recherche et du type de logement
    return stayInfo.filter((cardInfo) => {
		// Recherche du logement associé
      const relatedAccommodation = accommodation.find(
        (acc) => acc.accommodation_id === cardInfo.accommodation_id
      );

	  // Vérification si le type de séjour correspond au type sélectionné
      const matchesType = filterType === "all" || cardInfo.category === filterType;

	  // Vérification si le titre du séjour contient le terme de recherche
      const matchesSearch = cardInfo.title.toLowerCase().includes(searchTerm.toLowerCase());

	  // Vérification si le logement sélectionné correspond au logement associé
      const matchesAccommodation =
        selectedAccommodation === "all" ||
        relatedAccommodation?.accommodation_id === parseInt(selectedAccommodation);

      return matchesType && matchesSearch && matchesAccommodation;
    });
  }, [stayInfo, accommodation, filterType, searchTerm, selectedAccommodation]);
};
