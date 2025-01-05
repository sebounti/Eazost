'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Assurez-vous d'importer depuis 'next/navigation' pour les fonctions côté client

// Types pour l'utilisateur et le contexte
type User = {
  users_id: number;
  account_type: string;
  isAuthenticated: boolean;
};

type UserContextType = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
};

// Création du contexte utilisateur
const UserContext = createContext<UserContextType | undefined>(undefined);

export { UserContext };

// Fournisseur de contexte pour l'utilisateur
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  console.log("UserProvider mounted");

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = typeof window !== "undefined" ? useRouter() : null;

  const checkAuth = async () => {
	if (typeof window !== "undefined") {
	  const token = localStorage.getItem('token');
	  console.log("Token récupéré dans checkAuth :", token);

	  if (token) {
		const response = await fetch('/api/tokenService/');
		console.log("Réponse de check-token :", response);

		if (response.ok) {
		  setCurrentUser((prevUser) => ({ ...prevUser!, isAuthenticated: true }));
		} else {
		  setCurrentUser(null);
		  console.log("Token invalide, redirection vers login");
		  router?.push('/login');
		}
	  } else {
		setCurrentUser(null);
		console.log("Aucun token trouvé, redirection vers login");
		router?.push('/login');
	  }
	}
  };

  // Charger l'utilisateur depuis localStorage au montage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        setCurrentUser({ ...JSON.parse(storedUser), isAuthenticated: false });
      }
    }
  }, []);

  // Vérification de l'authentification au chargement de la page
  useEffect(() => {
    checkAuth();
  }, []);

  // Sauvegarder l'utilisateur dans localStorage à chaque mise à jour
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (currentUser) {
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("currentUser");
      }
    }
  }, [currentUser]);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, checkAuth }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook pour accéder au contexte utilisateur
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser doit être utilisé dans un UserProvider');
  }
  return context;
};
