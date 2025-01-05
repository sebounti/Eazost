import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, UserInfo } from '@/types/auth';

const TOKEN_CONFIG = {
  STORAGE_KEY: 'auth-storage',
};

// Validation des informations utilisateur
function validateUserInfo(userInfo: any): boolean {
  return (
    typeof userInfo?.first_name === 'string' &&
    typeof userInfo?.last_name === 'string' &&
    typeof userInfo?.photo_url === 'string'
  );
}

// Fonction générique pour les appels API
async function apiFetch(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      credentials: 'include',
      ...options,
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorMessage}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur API :', error);
    throw error;
  }
}

// Interface pour Zustand
export interface AuthState {
  user: User | null;
  userInfo: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  email: string;
  password: string;
  setUser: (user: User | null) => void;
  setUserInfo: (userInfo: UserInfo | null) => void;
  setLoading: (isLoading: boolean) => void;
  handleLogin: (formData: { email: string; password: string }) => Promise<void>;
  checkAuth: () => Promise<boolean>;
  fetchUserInfo: (userId: number) => Promise<void>;
  logout: () => Promise<void>;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  fetchSession: () => Promise<any>;
  account_type: string;
  initializeStore: () => Promise<void>;
}

// Store Zustand
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      userInfo: null,
      token: null,
      isAuthenticated: false,
      loading: true,
      email: '',
      password: '',
      account_type: '',

      setUser: (user) => {
        console.log("Setting user in authStore:", user);
        set({ user, email: user?.email || '' });
      },
      setUserInfo: (userInfo) => set({ userInfo }),
      setLoading: (isLoading) => set({ loading: isLoading }),
      setEmail: (email) => set({ email }),
      setPassword: (password) => set({ password }),

	  // Fonction pour la connexion
      handleLogin: async (formData) => {
        set({ loading: true });

        try {
          const data = await apiFetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' },
          });

          console.log('Données reçues :', data);

          if (!data.user?.users_id || !data.user?.account_type || !data.token) {
            throw new Error('Données utilisateur invalides');
          }

          set({
            user: {
              user_id: data.user.users_id,
              role: data.user.account_type,
              email: data.user.email,
              account_type: data.user.account_type,
              first_name: data.user.first_name,
              last_name: data.user.last_name
            },
            token: data.token,
            isAuthenticated: true,
            loading: false,
            account_type: data.user.account_type
          });

          console.log('✅ État du store mis à jour :', get());
          console.log('✅ Connexion réussie');
        } catch (error) {
          set({ loading: false });
          console.error('❌ Erreur dans handleLogin :', error);
          throw error;
        }
      },

	  // Fonction pour la vérification de l'authentification
      checkAuth: async () => {
        try {
          console.log('🔍 Démarrage de checkAuth...');
          set({ loading: true });

          const data = await apiFetch('/api/auth/check-session');
          console.log('Réponse de /api/auth/check-session:', data);

          if (data.success && data.userId && data.role) {
            console.log('✅ Authentification validée');
            set((state) => ({
              user: {
                user_id: data.userId,
                role: data.role,
                email: state.user?.email || '',
                account_type: data.role,
                first_name: state.user?.first_name || '',
                last_name: state.user?.last_name || ''
              },
              isAuthenticated: true,
              account_type: data.role,
              loading: false
            }));
            return true;
          }

          set({
            user: null,
            isAuthenticated: false,
            loading: false
          });
          return false;
        } catch (error) {
          console.error('❌ Erreur lors de checkAuth:', error);
          set({
            user: null,
            isAuthenticated: false,
            loading: false
          });
          return false;
        }
      },


	  // Fonction pour la récupération des informations utilisateur
      fetchUserInfo: async (userId) => {
        console.log("fetchUserInfo appelé avec userId :", userId);
        try {
          const userInfo = await apiFetch(`/api/users/UsersInfo/${userId}`);

          if (!validateUserInfo(userInfo)) {
            throw new Error('Données utilisateur invalides');
          }

          set({ userInfo });
        } catch (error) {
          console.error('❌ Erreur lors de fetchUserInfo :', error);
        }
      },


	  // Fonction pour la déconnexion
      logout: async () => {
        try {
          await apiFetch('/api/auth/logout', { method: 'POST' });

          set({
            user: null,
            userInfo: null,
            token: null,
            isAuthenticated: false,
          });

          window.location.href = '/login';
        } catch (error) {
          console.error('❌ Erreur lors de logout :', error);
        }
      },


	  // Fonction pour la vérification de la session
      fetchSession: async () => {
        try {
          const data = await apiFetch('/api/auth/check-session');
          return data;
        } catch (error) {
          console.error('❌ Erreur lors de fetchSession:', error);
          return null;
        }
      },


      // Ajoutez une méthode pour initialiser le store avec les données utilisateur
      initializeStore: async () => {
        try {
          console.log('🔄 Initialisation du store...');
          set({ loading: true });

          // Récupérer la session
          const response = await fetch('/api/auth/session');
          const session = await response.json();
          console.log('📦 Session récupérée:', session);

          if (session?.user) {
            set({
              user: {
                user_id: session.user.id,
                email: session.user.email,
                role: session.user.account_type,
                account_type: session.user.account_type,
                first_name: session.user.first_name,
                last_name: session.user.last_name
              },
              isAuthenticated: true,
              loading: false
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              loading: false
            });
          }
        } catch (error) {
          console.error('❌ Erreur initialisation:', error);
          set({
            user: null,
            isAuthenticated: false,
            loading: false
          });
        }
      },

      initializeAuth: async () => {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            set({ token, isAuthenticated: true });
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
        }
      },
    }),
    {
      name: TOKEN_CONFIG.STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
