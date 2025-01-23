import { create } from 'zustand';
import { product } from '@/db/appSchema';
import { shopSchema } from '@/validation/shopSchema';
import { productSchema } from '@/validation/productSchema';


// on définit les types des données du shop
interface ShopData {
	shop_id: number;
	uuid: string;
	accommodation_id: number;
	name: string;
	created_at: Date;
	updated_at: Date;
	total_revenue?: number;
	total_orders?: number;
	average_order?: number;
	best_seller?: string;
	monthly_sales?: {
		jan: number;
		feb: number;
	};
	products?: typeof product.$inferSelect[];
}


// on définit les types des données des produits
interface ProductData {
	product_id: number;
	shop_id: number;
	uuid: string;
	name: string;
	created_at: Date;
	updated_at: Date;
	description: string | null;
	price: string;
	image_url: string | null;
	stock: number;
}

// on définit les types des données du store
interface shopStore {
	shop: ShopData[];
	product: ProductData[];
	isLoading: boolean;
	error: string | null;
	fetchShopInfo: (shopId: number) => Promise<void>;
	updateProduct: (id: number, updatedData: Partial<typeof product.$inferSelect>) => Promise<void>;
	addProduct: (data: typeof product.$inferSelect) => Promise<void>;
	deleteProduct: (productData: typeof product.$inferSelect) => Promise<void>;
}

// on crée le store
export const useProductStore = create<shopStore>((set) => ({
	shop: [], // on initialise le shop
	product: [], // on initialise le product
	isLoading: false, // on initialise le loading
	error: null, // on initialise l'erreur

	// on récupère les données du shop
	fetchShopInfo: async (accommodationId: number) => {
		set({ isLoading: true });
		try {
			const response = await fetch(`/api/shop?accommodationId=${accommodationId}`);
			const data = await response.json();

			const shopData = shopSchema.parse(data.data);
			const productData = productSchema.parse(data.data);

			// Transformer les dates
			const transformedProducts = Array.isArray(productData) ? productData.map(p => ({
				...p,
				created_at: new Date(p.created_at),
				updated_at: new Date(p.updated_at)
			})) : [productData].map(p => ({
				...p,
				created_at: new Date(p.created_at),
				updated_at: new Date(p.updated_at)
			}));

			set({
				shop: Array.isArray(shopData) ? shopData : [shopData],
				product: transformedProducts as ProductData[],
				isLoading: false
			});
		} catch (error) {
			console.error("Erreur lors de l'appel API:", error);
			set({ shop: [], isLoading: false });
		}
	},



	//update produit - on met à jour un produit
	updateProduct: async (id: number, updatedData: Partial<typeof product.$inferSelect>) => {
		set({ isLoading: true });
		try {
			const response = await fetch(`/api/shop?id=${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updatedData)
			});
			const data = await response.json();
			set((state) => ({
				product: state.product.map(p => p.product_id === id ? {
					...p,
					...updatedData,
					created_at: p.created_at || new Date(),
					updated_at: new Date()
				} as ProductData : p),
				isLoading: false
			}));
		} catch (error) {
			set({ error: 'Erreur lors de la mise à jour du produit', isLoading: false });
			throw error;
		}
	},

	//add produit - on ajoute un produit
	addProduct: async (productData: typeof product.$inferSelect) => {
		set({ isLoading: true });
		try {
			const response = await fetch(`/api/shop`, {
				method: 'POST',
				body: JSON.stringify(productData),
			});
			const responseData = await response.json();
			set({
				product: responseData.productData.map((p: any) => ({
					...p,
					created_at: new Date(p.created_at),
					updated_at: new Date(p.updated_at)
				} as ProductData)),
				isLoading: false
			});
		} catch (error) {
			set({ error: 'Erreur lors du chargement des données', isLoading: false });
			throw error;
		}
	},

	//del
	deleteProduct: async (productData: typeof product.$inferSelect) => {
		set({ isLoading: true });
		try {
			const response = await fetch(`/api/shop`, { method: 'DELETE', body: JSON.stringify(productData) });
			const data = await response.json();
			set({ isLoading: false });
		} catch (error) {
			set({ error: 'Erreur lors de la suppression du produit', isLoading: false });
			throw error;
		}
	}

}));
