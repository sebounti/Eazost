interface User {
  users_id: number;
  user_id?: number;
  // ... autres propriétés
}

export type Accommodation = {
  accommodation_id: number;
  uuid: string;
  users_id: string;
  type: string;
  name: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  zipcode: string;
  country: string;
  description?: string | null;
  photo_url?: string | null;
  created_at?: Date;
  updated_at?: Date;
  stayInfo?: {
    stay_info_id: number;
    title: string;
    description: string;
    category: string;
    photo_url: string | null;
  }[];
};

export interface InfoCard {
  stay_info_id: number;
  title: string;
  category: string;
  description: string;
  accommodation_id: number;
  photo_url?: string;
  // Ajoutez d'autres propriétés si nécessaire
}

export interface stayInfo {
  stay_info_id: number;
  accommodation_id: number;
  users_id: string;
  created_at: Date;
  updated_at: Date;
  description: string;
  photo_url: string | null;
  title: string;
  category: string | null;
}

export interface Product {
  product_id: number;
  name: string;
  description: string;
  image_url: string | null;
  price: number;
  stock: number;
  uuid?: string;
  created_at?: Date;
  updated_at?: Date;
  shop_id?: number;
}
