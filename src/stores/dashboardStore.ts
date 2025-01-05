import { create } from 'zustand';
import { useAuthStore } from './authStore';

interface Property {
  id: number;
  name: string;
  totalSales: number;
  pendingOrders: number;
  upcomingBookings: number;
  unreadMessages: number;
  activeCodes: number;
}

interface Notification {
  id: number;
  message: string;
  type: string;
  date: Date;
}

interface DashboardStore {
  properties: Property[];
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  properties: [],
  notifications: [],
  isLoading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ isLoading: true });
    try {
      // Remplacez par votre appel API réel
      const response = await fetch('/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${useAuthStore.getState().token}`
        }
      });

      if (!response.ok) throw new Error('Erreur lors du chargement des données');

      const data = await response.json();
      set({
        properties: data.properties || [],
        notifications: data.notifications || [],
        isLoading: false
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));
