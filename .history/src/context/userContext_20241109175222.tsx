'use client'


import { createContext, useContext, useState } from 'react';

// Création du contexte utilisateur}
type users = {
	id: string;
	role: string;
	name: string;
};

type userContextType = {
	currentUser: users | null;
	setCurrentUser: (user: users | null) => void;
};

const UserContext = createContext<userContextType | undefined>(undefined);

// Export explicite de UserContext
export { UserContext };

// Hook pour accéder au contexte utilisateur
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const [currentUser, setCurrentUser] = useState<users | null>(null);

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
}
