// types.ts


// Types pour les informations de séjour
export type stayInfo = {
	stayInfo_id: number;
	accommodation_id: number;
	title: string;
	description: string;
	photo_url?: string;
	category: string;
	status: string;
	created_at: Date;
	updated_at: Date;
};


// Types pour les produits
  export type Product = {
	product_id: number;
	uuid: string;
	name: string;
	description: string;
	price: number;
	imageUrl?: string;
	stock: number;
	created_at: Date;
	updated_at: Date;
  };

  // Types pour les codes d'accès
  export interface AccessCode {
	code: string;
	startDateTime: Date;
	endDateTime: Date;
	accommodation_id: number;
	isActive: boolean;

  }

// Types pour les commandes
  export type Orders = {
	order_id: number;
	uuid: string;
	users_id: number;
	customerName: string;
	customerEmail: string;
	status: string;
	payment_status: string;
	amount: number;
	products: Array<{
		productId: number;
		quantity: number;
	}>;
	created_at: Date;
	updated_at: Date;
  };


  // Types pour les logements
  export type Accommodation = {
	InfoCard: any;
	accommodation_id: number;
	uuid: string;
	users_id: number;
	type: string;
	name: string;
	address_line1: string;
	address_line2?: string;
	city: string;
	zipcode: string;
	country: string;
	description: string;
	photo_url?: string;
	created_at: Date;
	updated_at: Date;
	stayInfo: stayInfo[]
	products: Product[]; // Liste des produits liés
  	orders: Orders[]; // Liste des commandes liées
	accessCodes?: AccessCode[];
};

export interface UserInfo {
	users_id: number | null;
	user_name: string | null;
	first_name: string | null;
	last_name: string | null;
	date_of_birth: string | null;
	phone_number: string | null;
	address_line1: string | null;
	address_line2: string | null;
	city: string | null;
	zipcode: string | null;
	country: string | null;
	photo_url?: string | null;
}

export type ProductStore = {
	product: Product | null;
	isLoading: boolean;
	error: string | null;
};
