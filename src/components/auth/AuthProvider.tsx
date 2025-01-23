//--- Composant AuthProvider ---
//--- Composant pour la gestion de l'authentification ---//


// React imports
import { useEffect } from 'react';
// Stores
import { useAuthStore } from '@/stores/authStore';


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initializeStore, setUser } = useAuthStore();

  useEffect(() => {
    console.log('🔄 AuthProvider - Initialisation...');

    const initAuth = async () => {
      try {
        // Récupérer les données du cookie user
        const userCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('user='));

        if (userCookie) {
          console.log('🍪 Cookie utilisateur trouvé');
          const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
          console.log('📦 Données utilisateur:', userData);
          setUser(userData);
          console.log('✅ Store mis à jour avec les données du cookie');
        } else {
          console.log('❌ Pas de cookie utilisateur trouvé');
          await initializeStore();
          console.log('✅ Store initialisé depuis la session');
        }
      } catch (error) {
        console.error('❌ Erreur:', error);
        await initializeStore();
      }
    };

    initAuth();
  }, [initializeStore, setUser]);

  return <>{children}</>;
}
