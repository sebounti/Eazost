import { create } from 'zustand';
import { Product } from '@/types/product';


// État initial pour les produits
interface State {
  product: Product | null;
  isLoading: boolean;
  error: string | null;
}


// Actions pour les produits
interface Actions {
  setProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
  updateProduct: (id: number, updatedData: Partial<Product>) => void;
}


// Initialisation de l'état
const initialState: State = {
    product: null,
    isLoading: false,
	error: null,
};

// Création du store pour les produits
export const useProductStore = create<State & Actions>()((set, get) => ({
	...initialState,









}));
