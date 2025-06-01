export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  theme: 'light' | 'dark' | 'system';
  color: string;
  notifications: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
  };
}

export interface AuthState {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}