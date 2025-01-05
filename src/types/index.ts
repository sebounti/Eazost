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
};

export interface InfoCard {
  id?: number;
  title: string;
  type: string;
  content: string;
  imageUrl?: string;
}

interface stayInfo {
  accommodation_id: number;
  stayInfo_id: number;
  type: string;
  title: string;
  description: string;
  photo_url: string | null;
  name: string;
}
