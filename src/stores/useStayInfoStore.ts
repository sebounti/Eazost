import { create } from 'zustand';
import { stayInfo } from '@/db/appSchema';

// Store pour les cartes d'information
type State = {
	stayInfo: typeof stayInfo.$inferSelect[];
	isLoading: boolean;
	error: string | null;
};

// Actions pour les cartes d'information
type Actions = {
	fetchstayInfo: (userId: string) => Promise<void>;
	updateStayInfo: (stayInfoId: number, updatedData: any) => void;
	deleteStayInfo: (stayInfoId: number) => Promise<void>;
};

// État initial pour les cartes d'information
const initialState: State = {
	stayInfo: [] as typeof stayInfo.$inferSelect[],
	isLoading: false,
	error: null,
};

// Création du store pour les cartes d'information
export const useStayInfoStore = create<State & Actions>()((set, get) => ({
	...initialState,

	// Fonction pour récupérer les cartes d'information
	fetchstayInfo: async (userId: string) => {
		set({ isLoading: true });
		try {
			const response = await fetch(`/api/stayInfo?userId=${userId}`);
			const data = await response.json();
			set({ stayInfo: data, isLoading: false });
		} catch (error) {
			set({ error: "Erreur lors du chargement des données", isLoading: false });
		}
	},

	// Fonction pour mettre à jour les cartes d'information
	updateStayInfo: (stayInfoId: number, updatedData: any) => {
		const currentStayInfo = get().stayInfo;
		const updated = currentStayInfo.map(info =>
			info.stay_info_id === stayInfoId ? { ...info, ...updatedData } : info
		);
		set({ stayInfo: updated });
	},

	// Fonction pour supprimer une carte d'information
	deleteStayInfo: async (stayInfoId: number) => {
		try {
			await fetch(`/api/stayInfo/${stayInfoId}`, { method: 'DELETE' });
			const currentStayInfo = get().stayInfo;
			set({ stayInfo: currentStayInfo.filter(info => info.stay_info_id !== stayInfoId) });
		} catch (error) {
			set({ error: "Erreur lors de la suppression" });
		}
	},
}));
