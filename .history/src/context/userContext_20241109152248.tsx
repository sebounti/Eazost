import { createContext, useContext, useState } from 'react';

// Création du contexte utilisateur}
type users = {
	id: string;
	role: string;
};

type usercontextType = {
