import { create } from 'zustand';
import { getSession } from "next-auth/react";

// on définit les types des données du dashboard
interface Property {
  id: number;
  name: string;
  totalSales: number;
  pendingOrders: number;
  upcomingBookings: number;
  unreadMessages: number;
  activeCodes: number;
}

// on définit les types des données des notifications
interface Notification {
  id: number;
  message: string;
  type: string;
  date: Date;
}

// on définit les types des données du store
interface DashboardStore {
  properties: Property[];
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
}

// on crée le store
export const useDashboardStore = create<DashboardStore>((set, get) => ({
  properties: [],
  notifications: [],
  isLoading: false,
  error: null,

  // on récupère les données du dashboard
  fetchDashboardData: async () => {
    set({ isLoading: true });
    try {
      const session = await getSession();
      const response = await fetch('/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${session?.user?.id}`
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
