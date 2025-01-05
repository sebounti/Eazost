// types.ts

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

  export type AccessCode = {
	
	accessCode_id: number;
	accommodation_id: number;
	code: string;
	expirationDate?: Date;
	created_at: Date;
	updated_at: Date;
  };

  export type Orders = {
	order_id: number;
	uuid: string;
	users_id: number;
	status: string;
	payment_status: string;
	amount: number;
	created_at: Date;
	updated_at: Date;
  };

  export type Accommodation = {
	accommodation_id: number;
	uuid: string;
	users_id: number;
	type: string;
	name: string;
	address_line1: string;
	address_line2?: string; // Champ optionnel
	city: string;
	photo_url?: string;
	zipcode: string;
	country: string;
	description?: string; // Champ optionnel
	created_at: Date;
	updated_at: Date;
	stayInfo: InfoCard[]
	products: Product[]; // Liste des produits liés
  	accessCodes: AccessCode[]; // Liste des codes d'accès liés
  	orders: Orders[]; // Liste des commandes liées
};
  };
