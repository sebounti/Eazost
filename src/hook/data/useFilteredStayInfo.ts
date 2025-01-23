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
    if (!stayInfo || !accommodation) return [];

    return stayInfo.filter((cardInfo) => {
      const relatedAccommodation = accommodation.find(
        (acc) => acc.accommodation_id === cardInfo.accommodation_id
      );

      const matchesType = filterType === "all" || cardInfo.category === filterType;
      const matchesSearch = cardInfo.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAccommodation =
        selectedAccommodation === "all" ||
        relatedAccommodation?.accommodation_id === parseInt(selectedAccommodation);

      return matchesType && matchesSearch && matchesAccommodation;
    });
  }, [stayInfo, accommodation, filterType, searchTerm, selectedAccommodation]);
};
