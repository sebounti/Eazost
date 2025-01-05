'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import depuis 'next/navigation'

// Types pour l'utilisateur et le contexte
type User = {
  users_id: number;
  account_type: string;
  isAuthenticated: boolean;
  isLogged: boolean;
};

type UserContextType = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  handleLogin: (user: User) => void;
};

// Création du contexte utilisateur
const UserContext = createContext<UserContextType | undefined>(undefined);

export { UserContext };

// Fonction de redirection vers la page de connexion avec délai
const redirectToLogin = (router: ReturnType<typeof useRouter>) => {
	// Affichage du message d'erreur, puis redirection après un délai
	setTimeout(() => {
	  router.push('/login');
	}, 30000); //
  };

// Hook personnalisé pour vérifier l'authentification
const useCheckAuth = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);  // Gestion du message d'erreur

  useEffect(() => {
    const verifyAuth = async () => {
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;

        // Exclure la redirection pour les pages 'login' et 'registration'
        if (currentPath === '/login' || currentPath === '/registration') {
          return; // Sortir de la fonction sans rediriger
        }

        try {
          const response = await fetch('/api/tokenservice', {
            credentials: 'include',
          });
          if (!response.ok) {
            throw new Error('Token invalide ou expiré');
          }
          // Si tout va bien, l’utilisateur est authentifié
          setErrorMessage(null);  // Clear any previous error
        } catch (error) {
          console.error('Erreur de vérification du token :', error);
          setErrorMessage('Votre session a expiré ou est invalide. Vous devez vous reconnecter.');
          redirectToLogin(router);
        }
      }
    };

    verifyAuth();
  }, [router]);

  return errorMessage;
};

// Fournisseur de contexte pour l'utilisateur
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  console.log('UserProvider mounted');

  // Initialiser `currentUser` à `null` dans le composant `UserProvider`
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Utiliser le hook `useRouter` pour accéder à l'objet `router`
  const router = useRouter();

  // Appel du hook personnalisé pour vérifier l'authentification
  const errorMessage = useCheckAuth();  // Obtenir le message d'erreur

  // Charger l'utilisateur depuis localStorage au montage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        // Vérifier si l'utilisateur est connecté
        if (parsedUser.isLogged) {
          setCurrentUser(parsedUser);
        } else {
          redirectToLogin(router); // Rediriger si l'utilisateur n'est pas connecté
        }
      } else {
        redirectToLogin(router); // Rediriger si aucun utilisateur n'est stocké
      }
    }
  }, [router]);

  // Sauvegarder l'utilisateur dans localStorage à chaque mise à jour
  useEffect(() => {
    if (typeof window !== 'undefined' && currentUser) {
      console.log('Saving currentUser to localStorage:', currentUser);
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // Fonction pour gérer la connexion de l'utilisateur
  const handleLogin = (user: User) => {
    const updatedUser = { ...user, isLogged: true }; // Mettre isLogged à true
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  // Fournir le contexte utilisateur aux composants enfants
  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, handleLogin }}>
      {children}

      {/* Affichage du message d'erreur si nécessaire */}
      {errorMessage && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
    <div className="bg-white p-6  shadow-lg rounded-lg">
      <h2 className="text-red-500 text-xl font-bold">Erreur</h2>
      <p>{errorMessage}</p>
      <button
        onClick={() => redirectToLogin(router)}
        className="mt-4 bg-amber-500 text-white px-4 py-2 rounded-xl"
      >
        Se reconnecter
      </button>
    </div>
  </div>
)}
    </UserContext.Provider>
  );
};

// Hook d'accès au contexte utilisateur
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser doit être utilisé dans un UserProvider');
  }
  return context;
};
