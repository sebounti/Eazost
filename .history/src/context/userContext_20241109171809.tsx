import { createContext, useContext, useState } from 'react';

// Création du contexte utilisateur}
type users = {
	id: string;
	role: string;
};

type userContextType = {
	currentUser: users | null;
	setCurrentUser: (user: users | null) => void;
};

const UserContext = createContext<userContextType | undefined>(undefined);


// Hook pour accéder au contexte utilisateur
export const userProvider = ({ children }: { children: React.ReactNode }) => {
	const [currentUser, setCurrentUser] = useState<users | null>(null);

	return (
		<UserContext.Provider value={{ currentUser, setCurrentUser }}>
			{children}
		</UserContext.Provider>
	);
	
