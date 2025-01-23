export interface StayInfo {
  stay_info_id: number;
  accommodation_id: number;
  title: string;
  description: string;
  category: string;
  photo_url: string | null;
  created_at: Date;
  updated_at: Date;
}
