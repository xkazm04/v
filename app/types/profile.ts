export interface Profile {
  id: string;
  name: string;
  name_normalized: string;
  avatar_url?: string;
  country?: string; // ISO 3166-1 alpha-2 country code
  party?: string;
  total_statements?: number; // Added by backend when include_counts=true
  created_at: string;
  updated_at: string;
}

export interface ProfileCreate {
  name: string;
  avatar_url?: string;
  country?: string;
  party?: string;
}

export interface ProfileUpdate {
  name?: string;
  avatar_url?: string;
  country?: string;
  party?: string;
}

export interface ProfileStats {
  total_profiles: number;
  unique_countries: number;
  unique_parties: number;
  countries: string[];
  parties: string[];
  total_statements: number;
  linked_statements: number;
  unlinked_statements: number;
}

export interface ProfileStatement {
  id: string;
  statement: string;
  verdict?: string;
  status?: string;
  confidence?: number;
  created_at: string;
}