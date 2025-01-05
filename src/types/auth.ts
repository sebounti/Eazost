export type AccountType = 'owner' | 'user';

export interface User {
  user_id: string;
  email: string;
  account_type: string;
  first_name?: string;
  last_name?: string;
  role?: string;
}

export interface UserInfo {
  first_name: string;
  last_name: string;
  photo_url: string;
}

export interface AuthState {
  user: User | null;
  userInfo: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  email: string;
  password: string;
  account_type: string;
  setUser: (user: User | null) => void;
  setUserInfo: (userInfo: UserInfo | null) => void;
  setLoading: (isLoading: boolean) => void;
  handleLogin: (formData: { email: string; password: string }) => Promise<void>;
  checkAuth: () => Promise<boolean>;
  fetchUserInfo: (userId: number) => Promise<void>;
  logout: () => Promise<void>;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  fetchSession: () => Promise<any>;
  initializeStore: () => Promise<void>;
}

export interface UserData {
  user: User; // L'objet utilisateur principal
  token: string; // Jeton d'authentification
}
