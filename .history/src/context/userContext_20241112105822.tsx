'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Types pour l'utilisateur et le contexte
type User = {
  users_id: number;
  account_type: string;
  isAuthenticated: boolean;
};

type UserContextType = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;  // Ajout de la fonction checkAuth
};

// Création du contexte utilisateur
const UserContext = createContext<UserContextType | undefined>(undefined);

export { UserContext };

// Fournisseur de contexte pour l'utilisateur
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  console.log("UserProvider mounted");

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

	const newLocal = async () => {
		if (typeof window !== "undefined") {
			const token = localStorage.getItem('token');
			if (token) {
				const response = await fetch('/api/check-token'); // Appel API pour vérifier le token
				if (response.ok) {
					setCurrentUser((prevUser) => ({ ...prevUser!, isAuthenticated: true }));
				} else {
					setCurrentUser(null);
					router.push('/login'); // Redirige vers la page de login si le token est invalide
				}
			} else {
				setCurrentUser(null);
				router.push('/login');
			}
		}
	};
  // Fonction pour vérifier l'authentification
  const checkAuth = newLocal;

  // Charger l'utilisateur depuis localStorage au montage
  useEffect(() => {
    console.log("UserProvider useEffect - loading user from localStorage");
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
