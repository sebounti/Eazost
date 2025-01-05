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

// Hook personnalisé pour vérifier l'authentification
const useCheckAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      if (typeof window !== "undefined") {
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
        } catch (error) {
          console.error("Erreur de vérification du token :", error);
          router.push('/login');
        }
      }
    };

    verifyAuth();
  }, [router]);
};

// Fournisseur de contexte pour l'utilisateur
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  console.log("UserProvider mounted");

  // Initialiser `currentUser` à `null` dans le composant `UserProvider`
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Appel du hook personnalisé pour vérifier l'authentification
  useCheckAuth();


  // Charger l'utilisateur depuis localStorage au montage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
		const parsedeUser = JSON.parse(storedUser);

		if (parsedeUser.isLogged) {
			setCurrentUser(parsedeUser);
		}
		else {
			
				}

	}
    }
  }, []);

  // Sauvegarder l'utilisateur dans localStorage à chaque mise à jour
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (currentUser) {
        console.log("Saving currentUser to localStorage:", currentUser);
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("currentUser");
      }
    }
  }, [currentUser]);


  // Fonction pour gérer la connexion de l'utilisateur
  const handleLogin = (user: User) => {
    const updatedUser = { ...user, isLogged: true }; // Mettre isLogged à true
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, handleLogin }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook accession au contexte utilisateur
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser doit être utilisé dans un UserProvider');
  }
  return context;
};
