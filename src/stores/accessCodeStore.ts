import { create } from 'zustand';
import { AccessCode } from '@/types';

interface AccessCodeStore {
  accessCodes: AccessCode[];
  isLoading: boolean;
  error: string | null;
  fetchAccessCodes: (accommodationId: number) => Promise<void>;
}

export const useAccessCodeStore = create<AccessCodeStore>((set) => ({
  accessCodes: [],
  isLoading: false,
  error: null,
  fetchAccessCodes: async (accommodationId) => {
    try {
      set({ isLoading: true, error: null });

      const response = await fetch(`/api/properties/${accommodationId}/access-codes`);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      set({
        accessCodes: data,
        isLoading: false,
        error: null
      });

    } catch (error) {
      set({
        accessCodes: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue'
      });
    }
  }
}));
