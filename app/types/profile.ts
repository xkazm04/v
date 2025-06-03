export interface Profile {
  id: string;
  name: string;
  name_normalized: string;
  avatar_url?: string;
  country?: string;
  party?: string;
  created_at: string;
  updated_at: string;
  total_statements?: number;
}

export interface ProfileCreateRequest {
  name: string;
  avatar_url?: string;
  country?: string;
  party?: string;
}

export interface ProfileUpdateRequest {
  name?: string;
  avatar_url?: string;
  country?: string;
  party?: string;
}