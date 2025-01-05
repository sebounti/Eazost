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

  export type Logement = {
	id: number;
	type: string;
	nom: string;
	adresse1: string;
	adresse2: string;
	ville: string;
	codePostal: string;
	pays: string;
	description: string;
	photo: string;
	infoCards: InfoCard[];
	products: Product[];
	accessCodes: AccessCode[];
	orders: Order[];
  };
