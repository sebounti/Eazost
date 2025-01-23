import { Accommodation } from "@/types";

//----- useFilteredAccommodations -----//
// Hook pour filtrer les logements en fonction du terme de recherche et du type de logement //

export function useFilteredAccommodations(
  accommodations: Accommodation[],
  searchTerm: string,
  filterType: string
) {
  return accommodations?.filter((logement) => {
    const matchesSearch = logement.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || logement.type === filterType;
    return matchesSearch && matchesType;
  });
}
