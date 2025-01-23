import { create } from 'zustand';

interface User {
  id: string;
  user_id: string;
  email: string;
  name?: string;
  account_type: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  initializeStore: () => Promise<void>;
  setUser: (userData: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  setUser: (userData) => set({ user: userData }),
  initializeStore: async () => {
    try {
      const response = await fetch('/api/auth/session');
      const session = await response.json();

      if (session?.user) {
        set({
          user: {
            id: session.user.id,
            user_id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            account_type: session.user.account_type
          },
          loading: false
        });
        console.log('✅ User initialisé:', session.user);
      } else {
        set({ user: null, loading: false });
      }
    } catch (error) {
      console.error('❌ Erreur auth:', error);
      set({ error: 'Erreur lors du chargement de l\'utilisateur', loading: false });
    }
  }
}));
