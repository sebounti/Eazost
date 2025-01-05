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
