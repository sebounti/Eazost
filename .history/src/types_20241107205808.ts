// types.ts

export type InfoCard = {
	id: number;
	title: string;
	content: string;
	imageUrl?: string;
  };

  export type Product = {
	id: number;
	name: string;
	description: string;
	price: number;
	imageUrl?: string;
  };

  export type AccessCode = {
	code: string;
	startDateTime: Date;
	endDateTime: Date;
	createdAt: Date;
	isActive: boolean;
  };

  export type Order = {
	id: number;
	customerName: string;
	customerEmail: string;
	products: { productId: number; quantity: number }[];
	totalAmount: number;
	status: 'pending' | 'processing' | 'completed' | 'cancelled';
	createdAt: Date;
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
	zipcode: string;
	country: string;
	description?: string; // Champ optionnel
	created_at: Date;
	updated_at: Date;
  };

