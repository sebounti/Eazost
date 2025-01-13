import { create } from 'zustand';
import { type Accommodation } from '@/types';

interface AccommodationStore {
  accommodationInfo: Accommodation[] | null;
  isLoading: boolean;
  error: string | null;
  fetchAccommodationInfo: (userId: string | number) => Promise<void>;
  deleteAccommodation: (id: number) => Promise<void>;
  updateAccommodation: (logementId: number, updatedData: Partial<Accommodation>) => void;
  addAccommodation: (accommodation: Accommodation) => void;
}

export const useAccommodationStore = create<AccommodationStore>((set) => ({
  accommodationInfo: null,
  isLoading: false,
  error: null,


  // Récupération des logements
  fetchAccommodationInfo: async (userId: string | number) => {
    set({ isLoading: true });
    try {
      console.log("Fetching accommodations for userId:", userId);
      const response = await fetch(`/api/properties?userId=${userId}`);
      const result = await response.json();
      console.log("API Response:", result);

      set({
        accommodationInfo: result.data || [],
        isLoading: false
      });
    } catch (error) {
      console.error("Error fetching accommodations:", error);
      set({ error: 'Failed to fetch accommodations', isLoading: false });
    }
  },


  // Suppression d'un logement
  deleteAccommodation: async (id) => {
    try {
      const response = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
      if (response.ok) {
        set(state => ({
          accommodationInfo: state.accommodationInfo?.filter(acc => acc.accommodation_id !== id) || null
        }));
      }
    } catch (error) {
      throw error;
    }
  },


  // Modification d'un logement
  updateAccommodation: (logementId: number, updatedData: Partial<Accommodation>) => {
    set((state) => ({
      accommodationInfo: state.accommodationInfo?.map((logement) =>
        logement.accommodation_id === logementId ? { ...logement, ...updatedData } : logement
      ) || null
    }));
  },


  // Ajout d'un logement
  addAccommodation: (accommodation) => {
    set(state => ({
      accommodationInfo: state.accommodationInfo
        ? [...state.accommodationInfo, accommodation]
        : [accommodation]
    }));
  }
}));
