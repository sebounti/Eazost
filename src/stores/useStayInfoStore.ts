import { create } from 'zustand';
import { type stayInfo } from '@/db/appSchema';

interface StayInfoStore {
	stayInfo: typeof stayInfo.$inferSelect[];
	isLoading: boolean;
	error: string | null;
	fetchStayInfos: (userId: string) => Promise<void>;
	updateStayInfo: (id: number, data: Partial<typeof stayInfo.$inferSelect>) => Promise<void>;
	deleteStayInfo: (id: number) => Promise<void>;
	fetchStayInfosByLogementId: (logementId: number) => Promise<void>;
	addStayInfo: (data: typeof stayInfo.$inferSelect) => Promise<void>;
}

export const useStayInfoStore = create<StayInfoStore>((set) => ({
	stayInfo: [],
	isLoading: false,
	error: null,

	//fetch des cartes information
	fetchStayInfos: async (userId: string) => {
		console.log('🔄 fetchStayInfos appelé avec userId:', userId);
		try {
			set({ isLoading: true, error: null });
			const response = await fetch(`/api/stayInfo?userId=${userId}`);
			console.log('📥 Réponse API:', response.status);
			const data = await response.json();
			console.log('📦 Données reçues:', data);
			set({ stayInfo: data, isLoading: false });
		} catch (error) {
			console.error('❌ Erreur store:', error);
			set({
				error: 'Erreur lors du chargement',
				isLoading: false,
				stayInfo: []
			});
		}
	},

	//ajout de la carte information
	addStayInfo: async (data: typeof stayInfo.$inferSelect) => {
		try {
			const response = await fetch('/api/stayInfo', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			});
			if (!response.ok) throw new Error('Erreur ajout');
			set(state => ({
				stayInfo: [...state.stayInfo, data]
			}));
		} catch (error) {
			console.error('Erreur ajout:', error);
			throw error;
		}
	},

	//mise à jour de la carte information
	updateStayInfo: async (id, data) => {
		try {
			const response = await fetch(`/api/stayInfo/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			});
			if (!response.ok) throw new Error('Erreur mise à jour');

			set(state => ({
				stayInfo: state.stayInfo.map(info =>
					info.stay_info_id === id ? { ...info, ...data } : info
				)
			}));
		} catch (error) {
			console.error('Erreur mise à jour:', error);
			throw error;
		}
	},

	// suppression de la carte information
	deleteStayInfo: async (id) => {
		try {
			const response = await fetch(`/api/stayInfo/${id}`, {
				method: 'DELETE'
			});
			if (!response.ok) throw new Error('Erreur suppression');

			set(state => ({
				stayInfo: state.stayInfo.filter(info => info.stay_info_id !== id)
			}));
		} catch (error) {
			console.error('Erreur suppression:', error);
			throw error;
		}
	},

	//fetch des cartes information par logement
	fetchStayInfosByLogementId: async (logementId: number) => {
		try {
			set({ isLoading: true, error: null });
			const response = await fetch(`/api/properties/stay-info/${logementId}`);

			if (!response.ok) {
				throw new Error('Erreur lors du chargement des données');
			}

			const data = await response.json();
			set({ stayInfo: data, isLoading: false });
		} catch (error) {
			set({
				error: 'Erreur lors du chargement',
				isLoading: false,
				stayInfo: []
			});
		}
	}
}));
