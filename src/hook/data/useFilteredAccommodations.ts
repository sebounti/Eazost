import { Accommodation } from "@/types";

//----- useFilteredAccommodations -----//
// Hook pour filtrer les logements en fonction du terme de recherche et du type de logement //

export function useFilteredAccommodations(
  accommodations: Accommodation[],
  searchTerm: string,
  filterType: string
) {
  return accommodations?.filter((logement) => {
	// Conversion du terme de recherche en minuscule
	const lowerSearchTerm = searchTerm.toLowerCase();

	// Vérification si le nom du logement contient le terme de recherche
    const matchesSearch =
	logement.name.toLowerCase().includes(searchTerm.toLowerCase());
	logement.city.toLowerCase().includes(searchTerm.toLowerCase());
	logement.country.toLowerCase().includes(searchTerm.toLowerCase());

	// Vérification si le type du logement correspond au type sélectionné
    const matchesType = filterType === 'all' || logement.type === filterType;

	// Retourne true si les deux conditions sont remplies
	return matchesSearch && matchesType;
  });
}
