// app/types/client/sites.types.ts

export interface SiteLocation {
  id: number;
  title: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
  contacts: LocationContact[];
  created_at: string;
  updated_at?: string;
}

export interface LocationContact {
  id: number;
  name: string;
  phone: string;
  email?: string;
  designation?: string;
}

export interface SiteGuard {
  id: number;
  name: string;
  guard_code: string;
  email: string;
  phone: string;
  is_active: boolean;
}

export interface Site {
  id: number;
  site_name: string;
  site_instruction: string | null;
  address: string | null;
  guards_required: number;
  latitude: number | null;
  longitude: number | null;
  status: 'active' | 'inactive' | 'planned' | 'under_maintenance';
  locations: SiteLocation[];
  guards: SiteGuard[];
  contacts: SiteContact[];
  guards_count: number;
  created_at: string;
  updated_at: string;
}

export interface SiteContact {
  id: number;
  name: string;
  phone: string;
  email?: string;
  designation?: string;
}

export interface SitesPaginatedResponse {
  items: Site[];
  data: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
}

export interface LocationsResponse {
  items: SiteLocation[];
  data: {
    site_id: number;
    site_name: string;
    total_locations: number;
  };
}

export interface CreateSiteData {
  site_name: string;
  site_instruction?: string;
  address?: string;
  guards_required?: number;
  latitude?: number;
  longitude?: number;
  status?: string;
}

export interface UpdateSiteData extends Partial<CreateSiteData> {
  id: number;
}

export interface CreateLocationData {
  site_id: number;
  title: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  is_active?: boolean;
}

export interface UpdateLocationData extends Partial<CreateLocationData> {
  id: number;
  site_id: number;
}

export interface SitesState {
  sites: Site[];
  currentSite: Site | null;
  locations: SiteLocation[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  } | null;
}