import { create } from "zustand";

//	interface pour les informations de l'utilisateur
interface UserInfo {
  users_id: number | null;
  user_name: string | null;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: Date | null;
  phone_number: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  zipcode: string | null;
  country: string | null;
  photo_url: string | null;
}

//	interface pour les informations de l'utilisateur
interface UserInfoState {
  userInfo: UserInfo | null;
  isProfileComplete: boolean;
  fetchBasicInfo: (userId: string) => Promise<void>;
  fetchFullInfo: (userId: string) => Promise<void>;
  setUserInfo: (info: UserInfo) => void;
}

//	store pour les informations de l'utilisateur
export const useUserinfoStore = create<UserInfoState>((set) => ({
  userInfo: null,
  isProfileComplete: false,
  async fetchBasicInfo(userId) {
    try {
      const response = await fetch(`/api/users/${userId}/profile`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du profil');
      }
      const data = await response.json();
      const isComplete = Boolean(
        data.first_name &&
        data.last_name &&
        data.date_of_birth &&
        data.phone_number &&
        data.address_line1 &&
        data.city &&
        data.zipcode &&
        data.country &&
        data.photo_url
      );
      set({ userInfo: data, isProfileComplete: isComplete });
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
    }
  },

  //	fetch les informations de l'utilisateur
  async fetchFullInfo(userId) {
    const response = await fetch(`/api/users/${userId}/profile`);
    const data = await response.json();
	console.log("donnees recu de l'api", data);
    const isComplete = Boolean(
      data.first_name &&
      data.last_name &&
      data.date_of_birth &&
      data.phone_number &&
      data.address_line1 &&
      data.city &&
      data.zipcode &&
      data.country
    );
    set({ userInfo: data, isProfileComplete: isComplete });
  },
  setUserInfo(info) {
    const isComplete = Boolean(
      info.first_name &&
      info.last_name &&
      info.date_of_birth &&
      info.phone_number &&
      info.address_line1 &&
      info.city &&
      info.zipcode &&
      info.country
    );
    set({ userInfo: info, isProfileComplete: isComplete });
  },
}));
