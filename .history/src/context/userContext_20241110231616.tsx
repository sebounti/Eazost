'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Types pour l'utilisateur et le contexte
type User = {
  id: string;
  role: string;
  name: string;
};

type UserContextType = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
};

// Création du contexte utilisateur
const UserContext = createContext<UserContextType | undefined>(undefined);

export { UserContext };

// Fournisseur de contexte pour l'utilisateur
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Charger l'utilisateur depuis localStorage au montage
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
	console.log("Initialisation depuis localStorage :", storedUser); // Debug

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      console.log("Utilisateur chargé depuis localStorage :", JSON.parse(storedUser));
    }
  }, []);

  // Sauvegarder l'utilisateur dans localStorage à chaque mise à jour
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      console.log("Utilisateur sauvegardé dans localStorage :", currentUser);
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
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
