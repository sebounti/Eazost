import { create } from 'zustand';
import { Accommodation } from '@/types';


// Store pour les logements
type State = {
  accommodationInfo: Accommodation[] | null;
  isLoading: boolean;
  error: string | null;
};

// Actions pour les logements
type Actions = {
  fetchAccommodationInfo: (userId: string) => Promise<void>;
  getAccommodationImage: (id: number) => string | undefined;
  deleteAccommodation: (id: number) => Promise<void>;
  updateAccommodation: (id: number, updatedData: Partial<Accommodation>) => void;
};

// État initial pour les logements
const initialState: State = {
  accommodationInfo: null,
  isLoading: false,
  error: null,
};

// Création du store pour les logements
export const useAccommodationStore = create<State & Actions>()((set, get) => ({
  ...initialState,

  // Fonction pour récupérer les logements d'un utilisateur
  fetchAccommodationInfo: async (userId: string) => {
    try {
      console.log('🔍 Appel API avec userId:', userId, 'type:', typeof userId);
      set({ isLoading: true, error: null });
      const response = await fetch(`/api/properties?userId=${userId}`);
      const result = await response.json();
      console.log('📦 Réponse API:', result);

      if (!response.ok) {
        throw new Error(result.message || `Erreur HTTP: ${response.status}`);
      }

      set({
        accommodationInfo: result.data || [],
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error("Erreur de chargement:", error);
      set({
        accommodationInfo: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue'
      });
    }
  },

  // Fonction pour récupérer l'image d'un logement
  getAccommodationImage: (id) => {
    const accommodation = get().accommodationInfo?.find(a => a.accommodation_id === id);
    console.log("getAccommodationImage appelé pour id:", id, "résultat:", accommodation?.photo_url);
    return accommodation?.photo_url;
  },


  // Fonction pour supprimer un logement
  deleteAccommodation: async (id: number) => {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Mettre à jour le state en filtrant le logement supprimé
        set(state => ({
          accommodationInfo: state.accommodationInfo?.filter(acc => acc.accommodation_id !== id) || null
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw error;
    }
  },


  // Fonction pour modifier un logement
  updateAccommodation: (id: number, updatedData: Partial<Accommodation>) => {
    set(state => ({
      accommodationInfo: state.accommodationInfo?.map(acc =>
        acc.accommodation_id === id
          ? { ...acc, ...updatedData }
          : acc
      ) || null
    }));
  }

}));
