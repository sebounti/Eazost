'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Types pour l'utilisateur et le contexte
type User = {
	users_id: number;
  account_type: string;
  isAuthenticated: boolean;
  

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
	console.log("UserProvider mounted");  // Log ajouté pour le diagnostic

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Charger l'utilisateur depuis localStorage au montage
  useEffect(() => {
	console.log("UserProvider useEffect - loading user from localStorage");  // Log pour ce useEffect
	if (typeof window !== "undefined") {  // Vérifie si on est côté client
		console.log("window is defined"); // Ce log vérifiera si window est accessible
		const storedUser = localStorage.getItem("currentUser");
    console.log("Stored user in localStorage:", storedUser);  // Log ajouté
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      console.log("Utilisateur chargé depuis localStorage :", JSON.parse(storedUser));
    }
  }
  }, []);

  // Sauvegarder l'utilisateur dans localStorage à chaque mise à jour
  useEffect(() => {
	console.log("currentUser changed:", currentUser);  // Vérifie que `currentUser` a changé
	if (typeof window !== "undefined") {
	  if (currentUser) {
		localStorage.setItem("currentUser", JSON.stringify(currentUser));
		console.log("currentUser saved to localStorage:", currentUser);
	  } else {
		localStorage.removeItem("currentUser");
		console.log("currentUser removed from localStorage");
	  }
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
