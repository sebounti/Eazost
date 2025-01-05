import { create } from 'zustand';
import { stayInfo } from '@/types';
import { ActionResult } from 'next/dist/server/app-render/types';


// State pour les informations de séjour
type State = {
	stayInfo: stayInfo | null;
	isLoading: boolean;
	error: string | null;
  };


// actions pour les informations de séjour
type Actions = {
  fetchStayInfo: (userId: number) => Promise<void>;
  getStayInfoImage: (id: number) => string | undefined;
  deleteStayInfo: (id: number) => Promise<void>;
  updateStayInfo: (id: number, updatedData: Partial<stayInfo>) => void;
};

// État initial pour les informations de séjour
const initialState: State = {
	stayInfo: null,
	isLoading: false,
	error: null,
  };


// Création du store pour les informations de séjour
export const useStayInfoStore = create<State & Actions>()((set, get) => ({
  ...initialState,

  // Fonction pour récupérer les informations de séjour
  fetchStayInfo: async (userId: number) => {
    try {
      set({ isLoading: true });
      const response = await fetch(`/api/stayInfo?userId=${userId}`);
      const data = await response.json();

	  //
      if (response.status === 404) {
        set({
          stayInfo: null,
          isLoading: false,
          error: null
        });
        return;
      }


      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

	  // Typage explicite des données
      const stayInfoData = Array.isArray(data) ? data[0] as stayInfo : null;

      set({
		stayInfo: stayInfoData,
		isLoading: false,
		error: null
	  });
    } catch (error) {
			console.error("Erreur de chargement:", error);
		set({
			stayInfo: null,
			isLoading: false,
			error: error instanceof Error ? error.message : 'Une erreur est survenue'
		});
    }
  },

  // Fonction pour récupérer l'image de l'information de séjour
  getStayInfoImage: (id: number) => {
    const stayInfo = get().stayInfo;
    return stayInfo?.photo_url;
  },

  // Fonction pour supprimer une information de séjour
  deleteStayInfo: async (id: number) => {
    try {
      const response = await fetch(`/api/stayInfo/${id}`, { method: 'DELETE' });
      if (response.ok) {
        set({ stayInfo: null });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw error;
    }
  },

  // Fonction pour mettre à jour une cardinformation de séjour
  updateStayInfo: (id: number, updatedData: Partial<stayInfo>) => {
    set(state => ({
      stayInfo: state.stayInfo ? { ...state.stayInfo, ...updatedData } : null
    }));
  }
}));
